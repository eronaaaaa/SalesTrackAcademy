"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/services/CourseService";
import { Comment, Lesson, Question } from "@/types/course";
import Link from "next/link";
import QuestionCard from "@/components/QuestionCard";
import { useRouter } from "next/navigation";
import QuizResultModal from "@/components/QuizResultsModal";
import CommentSection from "@/components/CommentSection";

export default function LessonDetailPage() {
  const router = useRouter();
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
  const [comments, setComments] = useState<Comment[]>([]);
  const [isNextLocked, setIsNextLocked] = useState(true);
  const [prevLessonId, setPrevLessonId] = useState<number | null>(null);

  const [commentText, setCommentText] = useState("");

  const fetchComments = async () => {
    try {
      const data = await api.getCommentsByLesson(lessonId as string);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    await api.addComment(lessonId as string, commentText);
    setCommentText("");
    fetchComments();
  };

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
      setCurrentLesson((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          lessonProgress: [{ completed: true, score: result.score }],
        };
      });
      setResultData({
        score: result.score,
        completed: result.courseCompleted,
      });
      setIsNextLocked(false);
      setShowResult(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  const handleCompleteWithoutQuiz = async () => {
    setSubmitting(true);
    try {
      await api.submitQuiz(currentLesson!.id!, {});
      setCurrentLesson((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          lessonProgress: [
            {
              id: 0,
              completed: true,
              score: 100,
              lessonId: prev.id,
              userId: 0,
            },
          ],
        };
      });
      setIsNextLocked(false);
      if (nextLessonId) {
        router.push(`/courses/${id}/lesson/${nextLessonId}`);
      } else {
        router.push(`/courses/${id}`);
      }
    } catch (err) {
      console.error("Failed to mark lesson as complete", err);
      if (nextLessonId) {
        router.push(`/courses/${id}/lesson/${nextLessonId}`);
      } else {
        router.push(`/courses/${id}`);
      }
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await api.getCourseById(id as string);

        const lessons = data?.lessons || [];
        const currentIndex = lessons.findIndex(
          (l: Lesson) => l.id === parseInt(lessonId as string),
        );
        if (currentIndex !== -1) {
          const lessonData = lessons[currentIndex];
          setCurrentLesson(lessonData);
          const currentPassedInDB =
            lessonData.lessonProgress?.[0]?.completed || false;
          const hasNoQuiz =
            !lessonData.questions || lessonData.questions.length === 0;

          if (currentIndex > 0) {
            setPrevLessonId(lessons[currentIndex - 1].id);
          } else {
            setPrevLessonId(null);
          }

          if (currentIndex < lessons.length - 1) {
            setNextLessonId(lessons[currentIndex + 1].id);

            if (currentPassedInDB || hasNoQuiz) {
              setIsNextLocked(false);
            } else {
              setIsNextLocked(true);
            }
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
          <p className="text-slate-500">
            No content available for this lesson.
          </p>
        </div>
      );
    }

    const isYouTube =
      currentLesson.contentUrl.includes("youtube.com") ||
      currentLesson.contentUrl.includes("youtu.be");

    if (isYouTube) {
      const videoId =
        currentLesson.contentUrl.split("v=")[1]?.split("&")[0] ||
        currentLesson.contentUrl.split("/").pop();

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
      case "VIDEO":
        return (
          <video
            src={currentLesson.contentUrl}
            controls
            className="w-full aspect-video bg-black"
          />
        );
      case "AUDIO":
        return (
          <div className="p-12 bg-slate-100 dark:bg-slate-800 flex flex-col items-center">
            <p className="mb-4 font-bold text-slate-500 uppercase tracking-widest text-xs">
              Audio Lesson
            </p>
            <audio src={currentLesson.contentUrl} controls className="w-full" />
          </div>
        );
      case "PDF":
        return (
          <iframe
            src={currentLesson.contentUrl}
            className="w-full h-[700px] border-none"
          />
        );
      default:
        return (
          <div className="p-10 bg-slate-200">Unsupported content type</div>
        );
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse">Loading Content...</div>
    );

  if (!currentLesson)
    return <div className="p-20 text-center">Lesson not found.</div>;

  return (
    <div className="max-w-[1600px] mx-auto p-6 pb-20">
      <header className="mb-8 flex justify-between items-end">
        <div className="flex flex-col">
          <Link
            href={`/courses/${id}`}
            className="text-sm font-bold text-slate-500 hover:text-blue-600 mb-4 block"
          >
            ← Back to Curriculum
          </Link>
          <Link href={`/courses/${id}/lesson/${prevLessonId}`}>
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
        <h1 className="text-3xl font-black dark:text-white">
          {currentLesson.title}
        </h1>

        {nextLessonId ? (
          <Link href={`/courses/${id}/lesson/${nextLessonId}`}>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          <div className="shadow-2xl overflow-hidden rounded-[2.5rem] bg-black aspect-video">
            {renderContent()}
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold mb-4">About this lesson</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {currentLesson?.description ||
                "No description provided for this lesson."}
            </p>
          </div>

          <footer className="hidden lg:flex pt-6 border-t border-slate-100 dark:border-slate-800 justify-end"></footer>
        </div>

        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          {currentLesson?.questions?.length > 0 ? (
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2.5rem] shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="p-2 bg-amber-100 text-amber-600 rounded-lg text-xs">
                  ?
                </span>
                Quick Quiz
              </h2>
              <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {currentLesson.questions.map((q: Question) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    selectedChoiceId={selectedAnswers[q.id] || null}
                    onSelect={(choiceId) => handleSelect(q.id, choiceId)}
                  />
                ))}
              </div>
              <button
                onClick={handleSubmitQuiz}
                disabled={
                  submitting ||
                  currentLesson?.lessonProgress?.[0]?.completed ||
                  resultData.completed
                }
                className={`w-full mt-6 py-4 rounded-2xl font-black text-sm transition-all ${
                  resultData.completed
                    ? "bg-green-100 text-green-700 border border-green-200 cursor-default"
                    : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90"
                }`}
              >
                {submitting ? (
                  "Checking..."
                ) : resultData?.completed ? (
                  <span className="flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
                    ✅ Lesson Mastered (Score:{" "}
                    {resultData?.score ??
                      currentLesson?.lessonProgress?.[0]?.score}
                    %)
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
                    Submit Answers
                  </span>
                )}
              </button>
            </section>
          ) : (
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
                onClick={handleCompleteWithoutQuiz}
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
          )}

          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
            <CommentSection
              commentText={commentText}
              onCommentTextChange={setCommentText}
              handlePostComment={handlePostComment}
              comments={comments}
            />
          </div>
        </div>
      </div>
      {showResult && (
        <QuizResultModal
          score={resultData.score}
          passed={resultData.completed}
          onClose={() => setShowResult(false)}
          courseId={id as string}
          nextLessonId={nextLessonId}
        />
      )}
    </div>
  );
}
