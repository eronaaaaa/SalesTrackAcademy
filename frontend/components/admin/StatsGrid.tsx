interface Stats {
  totalAgents: number;
  totalCourses: number;
  totalAssignments: number;
  averageScore: number;
  completionRate: number;
}

export default function StatsGrid({ stats }: { stats: Stats }) {
  const numericScore =
    typeof stats.averageScore === "string"
      ? parseInt(stats.averageScore)
      : stats.averageScore;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8">
      <div className="bg-blue-600 p-4 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/20">
        <span className="text-xs font-bold uppercase tracking-widest opacity-80">Active Agents</span>
        <p className="text-4xl font-black mt-2">{stats.totalAgents}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-widest text-green-600">Completion Rate</span>
        <p className="text-4xl font-black mt-2 text-green-600">{stats.completionRate}%</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Published Courses</span>
        <p className="text-4xl font-black mt-2 dark:text-white">{stats.totalCourses}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Assignments</span>
        <p className="text-4xl font-black mt-2 dark:text-white">{stats.totalAssignments}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Avg. Quiz Score</span>
        <div className="flex items-end gap-2 mt-2">
          <p className="text-4xl font-black">{stats.averageScore}%</p>
        </div>
        <div className="flex gap-1 mt-4">
          {[1, 2, 3, 4, 5].map((dot) => (
            <div
              key={dot}
              className={`h-1.5 w-full rounded-full transition-colors duration-500 ${
                numericScore / 20 >= dot ? "bg-blue-500" : "bg-blue-500/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}