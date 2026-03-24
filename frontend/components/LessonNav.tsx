import Link from "next/link";

interface LessonNavProps {
  courseId: string;
  title: string;
  prevLessonId: number | null;
  nextLessonId: number | null;
  isNextLocked: boolean;
}

export default function LessonNav({
  courseId,
  title,
  prevLessonId,
  nextLessonId,
  isNextLocked,
}: LessonNavProps) {
  return (
    <header className="mb-8 flex justify-between items-end">
      <div className="flex flex-col">
        <Link
          href={`/courses/${courseId}`}
          className="text-sm font-bold text-slate-500 hover:text-blue-600 mb-4 block"
        >
          ← Back to Curriculum
        </Link>
        <Link href={prevLessonId ? `/courses/${courseId}/lesson/${prevLessonId}` : "#"}>
          <button
            disabled={!prevLessonId}
            className={`${
              prevLessonId ? "bg-blue-500" : "bg-slate-400"
            } px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest transition-all`}
          >
            <span className="text-xs">←</span> Previous lesson
          </button>
        </Link>
      </div>

      <h1 className="text-3xl font-black dark:text-white">{title}</h1>

      {nextLessonId ? (
        <Link href={`/courses/${courseId}/lesson/${nextLessonId}`}>
          <button
            disabled={isNextLocked}
            className={`${
              isNextLocked ? "bg-slate-400" : "bg-blue-500"
            } px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest transition-all`}
          >
            Next Lesson <span className="text-l">→</span>
          </button>
        </Link>
      ) : (
        <div className="bg-green-500 dark:bg-slate-800 px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
          Course Completed
        </div>
      )}
    </header>
  );
}