"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { api } from "@/services/CourseService";
import { Comment, Lesson } from "@/types/course";
import QuizResultModal from "@/components/QuizResultsModal";
import CommentSection from "@/components/CommentSection";
import LessonContent from "@/components/LessonContent";
import LessonNav from "@/components/LessonNav";
import LessonSidebar from "@/components/LessonSidebar";

export default function LessonDetailPage() {
  const router = useRouter();
  const { id, lessonId } = useParams();

  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [nextLessonId, setNextLessonId] = useState<number | null>(null);
  const [prevLessonId, setPrevLessonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState({ score: 0, completed: false });
  const [comments, setComments] = useState<Comment[]>([]);
  const [isNextLocked, setIsNextLocked] = useState(true);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await api.getCourseById(id as string);
        const lessons = data?.lessons || [];
        const currentIndex = lessons.findIndex(
          (l: Lesson) => l.id === parseInt(lessonId as string)
        );

        if (currentIndex === -1) return;

        const lessonData = lessons[currentIndex];
        setCurrentLesson(lessonData);

        const alreadyPassed = lessonData.lessonProgress?.[0]?.completed || false;
        const hasNoQuiz = !lessonData.questions || lessonData.questions.length === 0;

        setPrevLessonId(currentIndex > 0 ? lessons[currentIndex - 1].id : null);

        if (currentIndex < lessons.length - 1) {
          setNextLessonId(lessons[currentIndex + 1].id);
          setIsNextLocked(!alreadyPassed && !hasNoQuiz);
        } else {
          setNextLessonId(null);
        }
      } catch (err) {
        console.error("Error loading lesson:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, lessonId]);

  const fetchComments = async () => {
    try {
      const data = await api.getCommentsByLesson(lessonId as string);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  const handleSelect = (questionId: number, choiceId: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(selectedAnswers).length < currentLesson!.questions.length) {
      alert("Please answer all questions before submitting!");
      return;
    }
    setSubmitting(true);
    try {
      const result = await api.submitQuiz(currentLesson!.id!, selectedAnswers);
      setCurrentLesson((prev) =>
        prev ? { ...prev, lessonProgress: [{ id: 0, completed: true, score: result.score, lessonId: prev.id, userId: 0 }] } : null
      );
      setResultData({ score: result.score, completed: result.courseCompleted });
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
      setCurrentLesson((prev) =>
        prev ? { ...prev, lessonProgress: [{ id: 0, completed: true, score: 100, lessonId: prev.id, userId: 0 }] } : null
      );
      setIsNextLocked(false);
    } catch (err) {
      console.error("Failed to mark lesson as complete", err);
    } finally {
      setSubmitting(false);
      router.push(nextLessonId ? `/courses/${id}/lesson/${nextLessonId}` : `/courses/${id}`);
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    await api.addComment(lessonId as string, commentText);
    setCommentText("");
    fetchComments();
  };

  if (loading)
    return <div className="p-20 text-center animate-pulse">Loading Content...</div>;
  if (!currentLesson)
    return <div className="p-20 text-center">Lesson not found.</div>;

  return (
    <div className="max-w-[1600px] mx-auto p-6 pb-20">
      <LessonNav
        courseId={id as string}
        title={currentLesson.title}
        prevLessonId={prevLessonId}
        nextLessonId={nextLessonId}
        isNextLocked={isNextLocked}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          <div className="shadow-2xl overflow-hidden rounded-[2.5rem] bg-black aspect-video">
            <LessonContent lesson={currentLesson} />
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold mb-4">About this lesson</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {currentLesson.description || "No description provided for this lesson."}
            </p>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          <LessonSidebar
            lesson={currentLesson}
            nextLessonId={nextLessonId}
            submitting={submitting}
            selectedAnswers={selectedAnswers}
            resultData={resultData}
            onSelect={handleSelect}
            onSubmitQuiz={handleSubmitQuiz}
            onCompleteWithoutQuiz={handleCompleteWithoutQuiz}
          />

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
