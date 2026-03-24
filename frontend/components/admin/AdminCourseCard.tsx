import { Course } from "@/types/course";

interface AdminCourseCardProps {
  course: Course;
  onEdit: () => void;
}

export default function AdminCourseCard({ course, onEdit }: AdminCourseCardProps) {
  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] flex items-center justify-between hover:border-blue-500/50 transition-all shadow-sm">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl">
          📚
        </div>
        <div>
          <h3 className="text-xl font-bold dark:text-white group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-slate-400 font-medium">
            {course.lessons?.length || 0} Lessons •{" "}
            {course.assignments?.length || 0} Agents Enrolled
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onEdit}
          className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all"
        >
          Edit Content
        </button>
        <button className="p-2.5 text-slate-300 hover:text-red-500 transition-colors">
          🗑️
        </button>
      </div>
    </div>
  );
}