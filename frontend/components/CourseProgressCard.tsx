interface Progress {
  percentage: number;
  completedCount: number;
  totalCount: number;
}

interface CourseProgressCardProps {
  progress: Progress;
}

export default function CourseProgressCard({ progress }: CourseProgressCardProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          Your Journey
        </span>
        <span className="text-sm font-bold text-slate-400">
          {progress.completedCount} / {progress.totalCount}
        </span>
      </div>

      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-4xl font-black dark:text-white">{progress.percentage}%</span>
        <span className="text-slate-500 font-bold text-sm">Complete</span>
      </div>

      <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-700 ease-out rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>

      {progress.percentage === 0 && progress.totalCount > 0 && (
        <div className="mt-4 flex items-center gap-2 text-slate-400 text-sm font-bold">
          <span>🚀 Ready to start your journey?</span>
        </div>
      )}
      {progress.percentage === 100 && (
        <div className="mt-4 flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-bold">
          <span>✨ Course Mastered</span>
        </div>
      )}
    </div>
  );
}