"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/services/CourseService";
import { Course, Lesson } from "@/types/course";

export default function EditCoursePage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: "",
    contentUrl: "",
    contentType: "VIDEO",
    order: 1
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await api.getCourseById(id as string);
        setCourse(data);
        setNewLesson(prev => ({ ...prev, order: (data.lessons?.length || 0) + 1 }));
      } catch (err) {
        console.error("Failed to fetch course", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleAddLesson = async () => {
    try {
      await api.addLesson(course!.id,newLesson.title, newLesson.contentUrl, newLesson.contentType, newLesson.order);
      window.location.reload();
    } catch (err) {
      alert("Failed to add lesson");
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-500">Loading Workspace...</div>;

  return (
    <main className="max-w-7xl mx-auto p-8">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black dark:text-white">Edit Course</h1>
          <p className="text-slate-500 font-medium">Manage curriculum and course settings.</p>
        </div>
        <button onClick={() => router.push('/admin/dashboard')} className="text-sm font-bold text-slate-400 hover:text-slate-600">
          ← Back to Dashboard
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-xl font-bold mb-6 dark:text-white">Course Info</h2>
            <div className="space-y-4">
              <input 
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none" 
                value={course?.title} 
                placeholder="Course Title"
              />
              <textarea 
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none" 
                rows={4} 
                value={course?.description ?? undefined}
                placeholder="Description"
              />
              <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm">
                Update Metadata
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold dark:text-white">Curriculum</h2>
              <button 
                onClick={() => setShowLessonModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all"
              >
                + Add Lesson
              </button>
            </div>

            <div className="space-y-3">
              {course?.lessons?.map((lesson: Lesson, index: number) => (
                <div key={lesson.id} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
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
                    <button className="p-2 text-slate-400 hover:text-blue-500">✎</button>
                    <button className="p-2 text-slate-400 hover:text-red-500">✕</button>
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
            <h2 className="text-2xl font-black mb-6 dark:text-white">New Lesson</h2>
            <div className="space-y-4">
              <input 
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none" 
                placeholder="Lesson Title"
                onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
              />
              <select 
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
                onChange={(e) => setNewLesson({...newLesson, contentType: e.target.value})}
              >
                <option value="VIDEO">Video Content</option>
                <option value="AUDIO">Audio Content</option>
                <option value="PDF">PDF Document</option>
              </select>
              <input 
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none" 
                placeholder="Content URL (YouTube, MP3, or PDF link)"
                onChange={(e) => setNewLesson({...newLesson, contentUrl: e.target.value})}
              />
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={handleAddLesson}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black"
                >
                  Save Lesson
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