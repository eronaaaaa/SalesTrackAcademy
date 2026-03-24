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
      {lessons?.map((lesson, index) => (
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
      ))}
    </div>
  );
}