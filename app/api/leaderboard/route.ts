import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

// GET /api/leaderboard?userId=...
// Returns weekly XP-based leaderboard.
// For V1: mix of real users (from DB) + fake peers so the board always
// has content even with only 1-2 real users.

const MOCK_PEERS = [
  { name: 'Riya S.',    xp: 1240, streak: 12 },
  { name: 'Arjun K.',   xp: 1180, streak: 9  },
  { name: 'Priya M.',   xp:  950, streak: 7  },
  { name: 'Rohit V.',   xp:  880, streak: 5  },
  { name: 'Sneha D.',   xp:  820, streak: 6  },
  { name: 'Karan A.',   xp:  760, streak: 4  },
  { name: 'Divya R.',   xp:  710, streak: 8  },
  { name: 'Amit P.',    xp:  670, streak: 3  },
  { name: 'Neha J.',    xp:  630, streak: 5  },
  { name: 'Vikas S.',   xp:  590, streak: 2  },
  { name: 'Pooja T.',   xp:  540, streak: 4  },
  { name: 'Rahul G.',   xp:  490, streak: 1  },
  { name: 'Ananya B.',  xp:  440, streak: 3  },
  { name: 'Suresh L.',  xp:  390, streak: 0  },
  { name: 'Meera C.',   xp:  340, streak: 2  },
]

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')

  // Get start of current week (Monday)
  const weekStart = getMonday(new Date())

  // ── Demo mode ─────────────────────────────────────────────────────────────
  if (!isSupabaseConfigured || !userId) {
    return NextResponse.json(buildDemoLeaderboard(weekStart))
  }

  // ── Supabase mode ─────────────────────────────────────────────────────────
  try {
    const supabase  = createServerClient()!

    // Get user's XP for this week (sum of session xp_earned since weekStart)
    const { data: userSessions } = await supabase
      .from('sessions')
      .select('xp_earned')
      .eq('user_id', userId)
      .gte('started_at', weekStart.toISOString())
      .not('completed_at', 'is', null)

    const userXp = (userSessions ?? []).reduce(
      (sum: number, s: { xp_earned: number }) => sum + (s.xp_earned ?? 0), 0
    )

    // Get user's name + streak
    const [userRow, streakRow] = await Promise.all([
      supabase.from('users').select('name').eq('id', userId).single(),
      supabase.from('streaks').select('current_streak').eq('user_id', userId).single(),
    ])

    const userName    = userRow.data?.name ?? 'You'
    const userStreak  = streakRow.data?.current_streak ?? 0

    // Determine user's XP position among mock peers
    const userEntry = { name: userName, xp: userXp, streak: userStreak, isReal: true }
    const allEntries = [
      ...MOCK_PEERS.map((p) => ({ ...p, isReal: false })),
      userEntry,
    ].sort((a, b) => b.xp - a.xp)

    const userRank = allEntries.findIndex((e) => e.isReal) + 1

    const entries = allEntries.map((e, i) => ({
      rank:          i + 1,
      name:          e.isReal ? e.name : e.name,
      xp:            e.xp,
      streak:        e.streak,
      isCurrentUser: e.isReal,
      avatar:        e.name.charAt(0).toUpperCase(),
    }))

    return NextResponse.json({
      league:          'bronze',
      leagueIcon:      '🥉',
      weekStart:       weekStart.toISOString().slice(0, 10),
      userRank,
      userXp,
      promotionCutoff: 5,
      relegationCutoff: 12,
      entries,
    })
  } catch (err) {
    console.error('[leaderboard] Error:', err)
    return NextResponse.json(buildDemoLeaderboard(weekStart))
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMonday(date: Date): Date {
  const d   = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function buildDemoLeaderboard(weekStart: Date) {
  const entries = MOCK_PEERS.map((p, i) => ({
    rank:          i + 1,
    name:          p.name,
    xp:            p.xp,
    streak:        p.streak,
    isCurrentUser: false,
    avatar:        p.name.charAt(0),
  }))

  return {
    league:          'bronze',
    leagueIcon:      '🥉',
    weekStart:       weekStart.toISOString().slice(0, 10),
    userRank:        10,
    userXp:          0,
    promotionCutoff: 5,
    relegationCutoff: 12,
    entries,
  }
}
