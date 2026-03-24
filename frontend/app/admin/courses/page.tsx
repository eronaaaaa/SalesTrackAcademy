"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/ApiService";
import { Course } from "@/types/course";
import CreateCourseModal from "@/components/admin/CreateCourseModal";
import AdminCourseCard from "@/components/admin/AdminCourseCard";

export default function AdminCourseListPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await api.getCourses();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    } catch (err) {
      console.error("Failed to delete course", err);
    }
  };

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black dark:text-white">
            Course Library
          </h1>
          <p className="text-slate-500">
            Manage your training modules and curriculum.
          </p>
          <button
            onClick={() => router.push("/admin/")}
            className="text-sm font-bold text-slate-400 hover:text-slate-600"
          >
            ← Back to Dashboard
          </button>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-lg transition-all"
        >
          + New Course
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {courses.map((course) => (
          <AdminCourseCard
            key={course.id}
            course={course}
            onEdit={() => router.push(`/admin/courses/edit/${course.id}`)}
            onDelete={() => handleDeleteCourse(course.id)}
          />
        ))}

        {courses.length === 0 && (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 font-bold">Your library is empty.</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateCourseModal onClose={() => setShowCreateModal(false)} />
      )}
    </main>
  );
}
