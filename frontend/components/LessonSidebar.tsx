import { Lesson, Question } from "@/types/course";
import QuestionCard from "@/components/QuestionCard";

interface LessonSidebarProps {
  lesson: Lesson;
  nextLessonId: number | null;
  submitting: boolean;
  selectedAnswers: Record<string, number>;
  resultData: { score: number; completed: boolean };
  onSelect: (questionId: number, choiceId: number) => void;
  onSubmitQuiz: () => void;
  onCompleteWithoutQuiz: () => void;
}

export default function LessonSidebar({
  lesson,
  nextLessonId,
  submitting,
  selectedAnswers,
  resultData,
  onSelect,
  onSubmitQuiz,
  onCompleteWithoutQuiz,
}: LessonSidebarProps) {
  const isCompleted = lesson.lessonProgress?.[0]?.completed || resultData.completed;

  if (lesson.questions?.length > 0) {
    return (
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2.5rem] shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="p-2 bg-amber-100 text-amber-600 rounded-lg text-xs">?</span>
          Quick Quiz
        </h2>

        <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {lesson.questions.map((q: Question) => (
            <QuestionCard
              key={q.id}
              question={q}
              selectedChoiceId={selectedAnswers[q.id] || null}
              onSelect={(choiceId) => onSelect(q.id, choiceId)}
            />
          ))}
        </div>

        <button
          onClick={onSubmitQuiz}
          disabled={submitting || isCompleted}
          className={`w-full mt-6 py-4 rounded-2xl font-black text-sm transition-all ${
            isCompleted
              ? "bg-green-100 text-green-700 border border-green-200 cursor-default"
              : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90"
          }`}
        >
          {submitting ? (
            "Checking..."
          ) : isCompleted ? (
            <span className="flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
              ✅ Lesson Mastered (Score: {resultData.score ?? lesson.lessonProgress?.[0]?.score}%)
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
              Submit Answers
            </span>
          )}
        </button>
      </section>
    );
  }

  return (
    <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-8 rounded-[2.5rem] text-center">
      <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg shadow-blue-500/30">
        ✓
      </div>
      <h2 className="text-xl font-bold mb-2 dark:text-white">
        {nextLessonId ? "Lesson Complete!" : "Course Complete!"}
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        {nextLessonId
          ? "There is no quiz for this lesson. You can head straight to the next section."
          : "You've reached the end of the course! Click below to finalize your progress."}
      </p>
      <button
        onClick={onCompleteWithoutQuiz}
        disabled={submitting}
        className={`w-full py-4 rounded-2xl font-bold transition-all disabled:opacity-50 ${
          nextLessonId
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {submitting ? (
          "Saving Progress..."
        ) : nextLessonId ? (
          <span className="flex items-center justify-center gap-2">
            Continue to Next Lesson <span className="text-lg">→</span>
          </span>
        ) : (
          "Finish Course & Exit"
        )}
      </button>
    </section>
  );
}