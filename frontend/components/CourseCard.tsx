import { Course } from "@/types/course";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="bg-[var(--card)] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold font-sans">{course.title}</h3>
        {course.status === 'COMPLETED' && (
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase">
            Graduated
          </span>
        )}
      </div>
      <p className="text-sm opacity-70 mb-6">{course.description}</p>
      
      <button className="py-3 bg-brand-accent text-blue-500 rounded-xl font-semibold hover:opacity-90 transition-opacity">
        {course.status === 'COMPLETED' ? 'Review Course' : 'Continue Learning'}
      </button>
    </div>
  );
}