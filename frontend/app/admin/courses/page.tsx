"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/CourseService";
import { Course } from "@/types/course";

export default function AdminCourseListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await api.getCourses();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black dark:text-white">Course Library</h1>
          <p className="text-slate-500">Manage your training modules and curriculum.</p>
                  <button onClick={() => router.push('/admin/')} className="text-sm font-bold text-slate-400 hover:text-slate-600">
          ← Back to Dashboard
        </button>
        </div>
        <button 
          onClick={() => router.push('/admin/courses/new')}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-lg transition-all"
        >
          + Create New Course
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {courses.map((course) => (
          <div 
            key={course.id} 
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] flex items-center justify-between hover:border-blue-500/50 transition-all shadow-sm"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl">
                📚
              </div>
              <div>
                <h3 className="text-xl font-bold dark:text-white group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-400 font-medium">
                  {course.lessons?.length || 0} Lessons • {course.assignments.length || 0} Agents Enrolled
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => router.push(`/admin/courses/edit/${course.id}`)}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all"
              >
                Edit Content
              </button>
              <button className="p-2.5 text-slate-300 hover:text-red-500 transition-colors">
                🗑️
              </button>
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 font-bold">Your library is empty.</p>
          </div>
        )}
      </div>
    </main>
  );
}