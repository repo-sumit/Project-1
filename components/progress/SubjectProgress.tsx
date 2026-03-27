import type { SubjectProgress as SubjectProgressType } from '@/types'
import { getSubjectById } from '@/lib/constants'
import ProgressBar from '@/components/ui/ProgressBar'

interface SubjectProgressProps {
  data: SubjectProgressType
}

export default function SubjectProgress({ data }: SubjectProgressProps) {
  const subject = getSubjectById(data.subjectId)
  const icon = subject?.icon ?? '📚'

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="font-semibold text-gray-800 text-sm">{data.subject}</span>
        </div>
        <div className="text-right">
          <span className={`text-base font-bold ${data.accuracyPct >= 70 ? 'text-green-600' : data.accuracyPct >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
            {data.accuracyPct}%
          </span>
          <div className="text-xs text-gray-400">accuracy</div>
        </div>
      </div>
      <ProgressBar
        value={data.accuracyPct}
        color={data.accuracyPct >= 70 ? 'bg-green-500' : data.accuracyPct >= 50 ? 'bg-amber-500' : 'bg-red-400'}
        height="h-1.5"
      />
      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-400">{data.attempted} attempted</span>
        <span className="text-xs text-gray-400">{data.correct} correct</span>
      </div>
    </div>
  )
}
