"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/services/CourseService";
import { Course, Lesson, Question } from "@/types/course";
import Link from "next/link";
import QuestionCard from "@/components/QuestionCard";
import router from "next/router";
import QuizResultModal from "@/components/QuizResultsModal";

export default function LessonDetailPage() {
  const { id, lessonId } = useParams();
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [nextLessonId, setNextLessonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState({ score: 0, completed: false });

  const handleSelect = (questionId: number, choiceId: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: choiceId,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(selectedAnswers).length < currentLesson!.questions.length) {
      alert("Please answer all questions before submitting!");
      return;
    }

    setSubmitting(true);
    try {
      const result = await api.submitQuiz(currentLesson!.id!, selectedAnswers);
      setResultData({
        score: result.score,
        completed: result.courseCompleted,
      });
      setShowResult(true);
      // window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  const handleNextFromModal = () => {
    setShowResult(false);
    if (nextLessonId) {
      router.push(`/courses/${id}/lesson/${nextLessonId}`);
    } else {
      router.push(`/courses/${id}`);
    }
  };
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await api.getCourseById(id as string);

        const lessons = data?.lessons || [];
        const index = lessons.findIndex(
          (l: Lesson) => l.id === parseInt(lessonId as string),
        );

        if (index !== -1) {
          setCurrentLesson(lessons[index]);
          if (index < lessons.length - 1) {
            setNextLessonId(lessons[index + 1].id);
          } else {
            setNextLessonId(null);
          }
        }
      } catch (err) {
        console.error("Error loading lesson:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, lessonId]);

 const renderContent = () => {
  if (!currentLesson?.contentUrl) {
    return (
      <div className="aspect-video bg-slate-900 flex items-center justify-center">
        <p className="text-slate-500">No content available for this lesson.</p>
      </div>
    );
  }

  const isYouTube = currentLesson.contentUrl.includes("youtube.com") || 
                    currentLesson.contentUrl.includes("youtu.be");

  if (isYouTube) {
    const videoId = currentLesson.contentUrl.split('v=')[1]?.split('&')[0] || 
                    currentLesson.contentUrl.split('/').pop();
    
    return (
      <iframe
        className="w-full aspect-video rounded-3xl border-none shadow-2xl"
        src={`https://www.youtube.com/embed/${videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  switch (currentLesson?.contentType) {
    case 'VIDEO':
      return <video src={currentLesson.contentUrl} controls className="w-full aspect-video bg-black" />;
    case 'AUDIO':
      return (
        <div className="p-12 bg-slate-100 dark:bg-slate-800 flex flex-col items-center">
          <p className="mb-4 font-bold text-slate-500 uppercase tracking-widest text-xs">Audio Lesson</p>
          <audio src={currentLesson.contentUrl} controls className="w-full" />
        </div>
      );
    case 'PDF':
      return <iframe src={currentLesson.contentUrl} className="w-full h-[700px] border-none" />;
    default:
      return <div className="p-10 bg-slate-200">Unsupported content type</div>;
  }
};
  

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse">Loading Content...</div>
    );

  if (!currentLesson)
    return <div className="p-20 text-center">Lesson not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 pb-20">
      <Link
        href={`/courses/${id}`}
        className="mb-8 text-sm font-bold inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
      >
        ← Back to Curriculum
      </Link>

      <header className="mb-10">
        <h1 className="text-4xl font-black mb-4 dark:text-white">
          {currentLesson.title}
        </h1>
        <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
      </header>

      {/* <div className="aspect-video bg-slate-900 rounded-3xl mb-10 flex items-center justify-center border border-slate-800 shadow-2xl">
        <span className="text-slate-500 font-mono italic">
          Video Player Placeholder 
        </span>
      </div> */}

      <div className="mb-10 shadow-2xl overflow-hidden rounded-3xl">
  {renderContent()}
</div>

      <div className="prose dark:prose-invert max-w-none mb-12">
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {currentLesson?.description ||
            "In this lesson, we dive deep into the core concepts of Sales Mastery."}
        </p>
      </div>

      {currentLesson?.questions?.length > 0 && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm mb-10">
          <h2 className="text-2xl font-bold mb-6">Test Your Knowledge</h2>
          {currentLesson.questions.map((q: Question) => (
            <QuestionCard
              key={q.id}
              question={q}
              selectedChoiceId={selectedAnswers[q.id] || null}
              onSelect={(choiceId) => handleSelect(q.id, choiceId)}
            />
          ))}{" "}
          <button
            onClick={handleSubmitQuiz}
            disabled={submitting}
            className="w-full mt-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black hover:opacity-90 transition-all disabled:opacity-50"
          >
            {submitting ? "Checking Answers..." : "Submit Quiz Responses"}
          </button>
        </section>
      )}

      <footer className="pt-10 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        {nextLessonId ? (
          <Link href={`/courses/${id}/lesson/${nextLessonId}`}>
            <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
              Next Lesson <span className="text-xl">→</span>
            </button>
          </Link>
        ) : (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
            Course Completed
          </div>
        )}
      </footer>
      {showResult && (
        <QuizResultModal
          score={resultData.score}
          passed={resultData.completed}
          onClose={() => setShowResult(false)}
          onNext={handleNextFromModal}
        />
      )}
    </div>
  );
}
