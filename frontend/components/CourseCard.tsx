import { Course } from "@/types/course";

export default function CourseCard({ course }: { course: Course }) {
  const percentage = course.progress?.percentage ?? 0;
  const isCompleted = course.assignments?.[0]?.status === "COMPLETED";
  const isStarted = percentage > 0 && !isCompleted;

  return (
    <div className="bg-[var(--card)] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden">
      {course.thumbnail ? (
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full p-2 rounded-2xl border-transparent h-40 object-cover mt-1"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      ) : (
        <div className="w-full mt-4 h-40 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-5xl">
          🎓
        </div>
      )}

      <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold font-sans">{course.title}</h3>
        {isCompleted ? (
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase">
            ✓ Completed
          </span>
        ) : isStarted ? (
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full uppercase">
            In Progress
          </span>
        ) : (
          <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-full uppercase">
            Not Started
          </span>
        )}
      </div>

      <p className="text-sm opacity-70 mb-4">{course.description}</p>

      <div className="mb-6">
        <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
          <span>{percentage}% complete</span>
          <span>{course.progress?.completedCount ?? 0} / {course.progress?.totalCount ?? 0} lessons</span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isCompleted ? "bg-green-500" : "bg-blue-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">
        {isCompleted ? "Review Course" : isStarted ? "Continue Learning" : "Start Course"}
      </button>
      </div>
    </div>
  );
}