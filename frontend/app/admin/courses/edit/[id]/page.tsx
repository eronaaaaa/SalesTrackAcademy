"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/services/ApiService";
import { Course, Lesson } from "@/types/course";
import QuizBuilder from "@/components/admin/QuizBuilder";
import CourseInfoForm from "@/components/admin/CourseInfoForm";
import LessonModal from "@/components/admin/LessonModal";
import CourseCurriculum from "@/components/admin/CourseCurriculum";

export default function EditCoursePage() {
  const { id } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [activeQuizLessonId, setActiveQuizLessonId] = useState<number | null>(
    null,
  );

  const fetchCourse = async () => {
    try {
      const data = await api.getCourseById(id as string);
      setCourse(data);
    } catch (err) {
      console.error("Failed to fetch course", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const handleUpdateCourse = async (
    title: string,
    description: string,
    thumbnail: string,
  ) => {
    setLoading(true);
    try {
      await api.updateCourse(course!.id, title, description, thumbnail);
      alert("Course details updated!");
    } catch {
      alert("Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLesson = async (lessonForm: {
    title: string;
    description: string;
    contentUrl: string;
    contentType: string;
    passingScore: number;
    order: number;
  }) => {
    try {
      if (editingLesson?.id) {
        await api.updateLesson(
          editingLesson.id,
          lessonForm.title,
          lessonForm.description,
          lessonForm.contentUrl,
          lessonForm.contentType,
          lessonForm.order,
          lessonForm.passingScore,
        );
      } else {
        await api.addLesson(
          course!.id,
          lessonForm.title,
          lessonForm.description,
          lessonForm.contentUrl,
          lessonForm.contentType,
          lessonForm.order,
          lessonForm.passingScore,
        );
      }
      setShowLessonModal(false);
      setEditingLesson(null);
      fetchCourse();
    } catch {
      alert("Failed to save lesson");
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await api.deleteLesson(lessonId);
      fetchCourse();
    } catch {
      alert("Failed to delete lesson");
    }
  };

  const handleOpenAddLesson = () => {
    setEditingLesson(null);
    setShowLessonModal(true);
  };

  const handleOpenEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setShowLessonModal(true);
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse text-slate-500">
        Loading Workspace...
      </div>
    );

  return (
    <main className="max-w-7xl mx-auto p-8">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black dark:text-white">
            Course Builder
          </h1>
          <p className="text-slate-500 font-medium">{course?.title}</p>
        </div>
        <button
          onClick={() => router.push("/admin/courses")}
          className="text-sm font-bold text-slate-400 hover:text-slate-600"
        >
          ← Back to Courses
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <CourseInfoForm
            course={course!}
            loading={loading}
            onSave={handleUpdateCourse}
          />
        </div>

        <div className="lg:col-span-8">
          <CourseCurriculum
            lessons={course?.lessons ?? []}
            onAddLesson={handleOpenAddLesson}
            onEditLesson={handleOpenEditLesson}
            onOpenQuiz={setActiveQuizLessonId}
            onDeleteLesson={handleDeleteLesson}
          />
        </div>
      </div>

      {showLessonModal && (
        <LessonModal
          editingLesson={editingLesson}
          nextOrder={(course?.lessons?.length || 0) + 1}
          onSave={handleSaveLesson}
          onClose={() => {
            setShowLessonModal(false);
            setEditingLesson(null);
          }}
        />
      )}

      {activeQuizLessonId && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <QuizBuilder
              lessonId={activeQuizLessonId}
              onClose={() => setActiveQuizLessonId(null)}
              questions={
                course?.lessons?.find((l) => l.id === activeQuizLessonId)
                  ?.questions || []
              }
              onSaveSuccess={fetchCourse}
            />
          </div>
        </div>
      )}
    </main>
  );
}
