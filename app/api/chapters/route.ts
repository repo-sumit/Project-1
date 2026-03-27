import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

// GET /api/chapters?subjectId=...&userId=...
// Returns chapters for a subject with user's progress per chapter.

const DEMO_CHAPTERS: Record<string, { id: string; name: string; orderIndex: number; totalQ: number }[]> = {
  'science-10': [
    { id: 'c-s10-01', name: 'Chemical Reactions and Equations', orderIndex: 1,  totalQ: 3 },
    { id: 'c-s10-02', name: 'Acids, Bases and Salts',           orderIndex: 2,  totalQ: 3 },
    { id: 'c-s10-03', name: 'Metals and Non-metals',            orderIndex: 3,  totalQ: 3 },
    { id: 'c-s10-04', name: 'Life Processes',                   orderIndex: 4,  totalQ: 3 },
    { id: 'c-s10-12', name: 'Electricity',                      orderIndex: 12, totalQ: 3 },
  ],
  'maths-10': [
    { id: 'c-m10-01', name: 'Real Numbers',              orderIndex: 1,  totalQ: 3 },
    { id: 'c-m10-04', name: 'Quadratic Equations',       orderIndex: 4,  totalQ: 3 },
    { id: 'c-m10-05', name: 'Arithmetic Progressions',   orderIndex: 5,  totalQ: 3 },
    { id: 'c-m10-06', name: 'Triangles',                 orderIndex: 6,  totalQ: 3 },
    { id: 'c-m10-10', name: 'Circles',                   orderIndex: 10, totalQ: 3 },
    { id: 'c-m10-14', name: 'Statistics',                orderIndex: 14, totalQ: 3 },
  ],
}

export async function GET(req: NextRequest) {
  const subjectId = req.nextUrl.searchParams.get('subjectId')
  const userId    = req.nextUrl.searchParams.get('userId')

  if (!subjectId) {
    return NextResponse.json({ error: 'subjectId is required' }, { status: 400 })
  }

  // ── Demo mode ─────────────────────────────────────────────────────────────
  if (!isSupabaseConfigured) {
    const raw = DEMO_CHAPTERS[subjectId] ?? []
    return NextResponse.json({
      chapters: raw.map((c) => ({ ...c, attempted: 0, accuracy: 0 }))
    })
  }

  // ── Supabase mode ─────────────────────────────────────────────────────────
  try {
    const supabase = createServerClient()!

    // Get chapters for this subject
    const { data: chapRows } = await supabase
      .from('chapters')
      .select('id, name, order_index')
      .eq('subject_id', subjectId)
      .order('order_index', { ascending: true })

    if (!chapRows || chapRows.length === 0) {
      // Fall back to demo chapters if table is empty
      const raw = DEMO_CHAPTERS[subjectId] ?? []
      return NextResponse.json({ chapters: raw.map((c) => ({ ...c, attempted: 0, accuracy: 0 })) })
    }

    // Get question counts per chapter
    const chapIds = chapRows.map((c) => c.id)
    const { data: qCounts } = await supabase
      .from('questions')
      .select('chapter_id')
      .in('chapter_id', chapIds)
      .eq('is_active', true)

    const totalByChap: Record<string, number> = {}
    ;(qCounts ?? []).forEach((r: { chapter_id: string }) => {
      totalByChap[r.chapter_id] = (totalByChap[r.chapter_id] ?? 0) + 1
    })

    // Get user progress per chapter (via attempts)
    let attemptedByChap: Record<string, { attempted: number; correct: number }> = {}
    if (userId) {
      const { data: attempts } = await supabase
        .from('attempts')
        .select('question_id, is_correct, questions(chapter_id)')
        .eq('user_id', userId)

      ;(attempts ?? []).forEach((a) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const chapId = (a.questions as any)?.chapter_id
        if (!chapId) return
        if (!attemptedByChap[chapId]) attemptedByChap[chapId] = { attempted: 0, correct: 0 }
        attemptedByChap[chapId].attempted++
        if (a.is_correct) attemptedByChap[chapId].correct++
      })
    }

    const chapters = chapRows.map((c) => {
      const totalQ   = totalByChap[c.id] ?? 0
      const prog     = attemptedByChap[c.id]
      const attempted = prog?.attempted ?? 0
      const accuracy  = attempted > 0 ? Math.round((prog!.correct / attempted) * 100) : 0

      return {
        id:         c.id,
        name:       c.name,
        orderIndex: c.order_index,
        totalQ,
        attempted,
        accuracy,
      }
    })

    return NextResponse.json({ chapters })
  } catch (err) {
    console.error('[chapters] Error:', err)
    const raw = DEMO_CHAPTERS[subjectId] ?? []
    return NextResponse.json({ chapters: raw.map((c) => ({ ...c, attempted: 0, accuracy: 0 })) })
  }
}
