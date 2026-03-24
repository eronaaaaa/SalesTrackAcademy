import { Lesson } from "@/types/course";

interface CourseCurriculumProps {
  lessons: Lesson[];
  onAddLesson: () => void;
  onEditLesson: (lesson: Lesson) => void;
  onOpenQuiz: (lessonId: number) => void;
}

export default function CourseCurriculum({
  lessons,
  onAddLesson,
  onEditLesson,
  onOpenQuiz,
}: CourseCurriculumProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold dark:text-white">Curriculum</h2>
        <button
          onClick={onAddLesson}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm"
        >
          + Add Lesson
        </button>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700"
          >
            <div className="flex items-center gap-4">
              <span className="text-xs font-black text-slate-400 w-6">{index + 1}</span>
              <div>
                <p className="font-bold dark:text-white">{lesson.title}</p>
                <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">
                  {lesson.contentType}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onOpenQuiz(lesson.id)}
                className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-[10px] font-black rounded-lg uppercase hover:bg-blue-600 hover:text-white transition-all"
              >
                + Quiz
              </button>
              <button
                onClick={() => onEditLesson(lesson)}
                className="p-2 text-slate-400 hover:text-blue-500"
              >
                ✎
              </button>
              <button className="p-2 text-slate-400 hover:text-red-500">✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}