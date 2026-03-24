import { Lesson } from "@/types/course";
import Link from "next/link";

interface LessonListProps {
  courseId: number;
  lessons: Lesson[];
}

export default function LessonList({ courseId, lessons }: LessonListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>

      {lessons?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-lg font-black dark:text-white mb-1">No Lessons Yet</h3>
          <p className="text-slate-400 text-sm font-medium">
            This course has no lessons yet. Check back soon!
          </p>
        </div>
      ) : (
        lessons?.map((lesson, index) => (
        <div
          key={lesson.id}
          className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <span className="text-slate-300 font-mono text-lg group-hover:text-blue-500 transition-colors">
              0{index + 1}
            </span>
            <h3 className="font-bold text-lg dark:text-white">{lesson.title}</h3>
          </div>

          <div className="flex items-center gap-3">
            {lesson.lessonProgress?.[0]?.completed ? (
              <Link
                href={`/courses/${courseId}/lesson/${lesson.id}`}
                className="flex items-center gap-2 bg-green-600 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl text-sm font-bold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                Review Lesson
              </Link>
            ) : (
              <Link
                href={`/courses/${courseId}/lesson/${lesson.id}`}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl text-sm font-bold"
              >
                Start Lesson
              </Link>
            )}
          </div>
        </div>
              ))
      )}
    </div>
  );
}