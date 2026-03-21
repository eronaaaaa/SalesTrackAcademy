"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/services/CourseService";
import { ContentType, Course, Lesson } from "@/types/course";
import QuizBuilder from "@/components/admin/QuizBuilder";

export default function EditCoursePage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState(
    "",
  );
  const [courseThumbnail, setCourseThumbnail] = useState(
    "",
  );

  useEffect(() => {
    if (course) {
      setCourseTitle(course.title);
      setCourseDescription(course.description ?? "");
      setCourseThumbnail(course.thumbnail ?? '')
    }
  }, [course]);

  const [showLessonModal, setShowLessonModal] = useState(false);
  const [activeQuizLessonId, setActiveQuizLessonId] = useState<number | null>(
    null,
  );
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const [lessonForm, setLessonForm] = useState({
    title: editingLesson?.title ?? "",
    contentUrl: editingLesson?.contentUrl ?? "",
    contentType: editingLesson?.contentType ?? "VIDEO",
    passingScore: editingLesson?.passingScore ?? 70,
    order: editingLesson?.order ?? 1,
  });

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const handleUpdateCourse = async () => {
    setLoading(true);
    try {
      await api.updateCourse(
        course!.id,
        courseTitle,
        courseDescription,
        courseThumbnail,
      );
      alert("Course details updated!");
    } catch (err) {
      alert("Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourse = async () => {
    try {
      const data = await api.getCourseById(id as string);
      setCourse(data);
      setLessonForm((prev) => ({
        ...prev,
        order: (data.lessons?.length || 0) + 1,
      }));
    } catch (err) {
      console.error("Failed to fetch course", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLesson = async () => {
    try {
      if (editingLesson?.id) {
        await api.updateLesson(
          editingLesson.id,
          lessonForm.title,
          lessonForm.contentUrl,
          lessonForm.contentType,
          lessonForm.order,
          lessonForm.passingScore,
        );
      } else {
        await api.addLesson(
          course!.id,
          lessonForm.title,
          lessonForm.contentUrl,
          lessonForm.contentType,
          lessonForm.order,
          lessonForm.passingScore,
        );
      }
      setShowLessonModal(false);
      setEditingLesson(null);
      fetchCourse();
    } catch (err) {
      alert("Failed to save lesson");
    }
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
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-xl font-bold mb-6 dark:text-white">
              Course Info
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1 block">
                  Title
                </label>
                <input
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                  value={courseTitle ?? course?.title}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="Course Title"
                />
              </div>{" "}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1 block">
                  Description
                </label>
                <textarea
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                  rows={4}
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  placeholder="What is this course about?"
                />
              </div>
              <button
                onClick={handleUpdateCourse}
                disabled={loading}
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Details"}
              </button>{" "}
            </div>
          </div>

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
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold dark:text-white">Curriculum</h2>
              <button
                onClick={() => {
                  setEditingLesson(null);
                  setShowLessonModal(true);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm"
              >
                + Add Lesson
              </button>
            </div>

            <div className="space-y-3">
              {course?.lessons?.map((lesson: Lesson, index: number) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-slate-400 w-6">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-bold dark:text-white">
                        {lesson.title}
                      </p>
                      <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">
                        {lesson.contentType}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveQuizLessonId(lesson.id)}
                      className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-[10px] font-black rounded-lg uppercase hover:bg-blue-600 hover:text-white transition-all"
                    >
                      + Quiz
                    </button>
                    <button
                      className="p-2 text-slate-400 hover:text-blue-500"
                      onClick={() => {
                        setEditingLesson(lesson);
                        setShowLessonModal(true);
                      }}
                    >
                      ✎
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-500">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showLessonModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl">
            <h2 className="text-2xl font-black mb-6 dark:text-white">
              {editingLesson?.id ? "Edit" : "New"} Lesson
            </h2>
            <div className="space-y-4">
              <input
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
                placeholder="Title"
                defaultValue={editingLesson?.title}
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, title: e.target.value })
                }
              />
              <select
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
                defaultValue={editingLesson?.contentType}
                onChange={(e) =>
                  setLessonForm({
                    ...lessonForm,
                    contentType: e.target.value as ContentType,
                  })
                }
              >
                <option value="VIDEO">Video</option>
                <option value="AUDIO">Audio</option>
                <option value="PDF">PDF</option>
              </select>
              <input
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
                defaultValue={editingLesson?.contentUrl}
                placeholder="URL"
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, contentUrl: e.target.value })
                }
              />
              <input
                type="number"
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
                placeholder="Passing Score"
                defaultValue={editingLesson?.passingScore}
                onChange={(e) =>
                  setLessonForm({
                    ...lessonForm,
                    passingScore: parseInt(e.target.value),
                  })
                }
              />
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveLesson}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowLessonModal(false)}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
