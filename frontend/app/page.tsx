"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/ApiService";
import { Course } from "@/types/course";
import CourseCard from "@/components/CourseCard";
import Link from "next/link";
import LogOutButton from "@/components/buttons/LogOutButton";
import { useAuth } from "@/hooks/authHook";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getCourses();
        setCourses(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center font-black animate-pulse">
        Verifying Access...
      </div>
    );

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <header className="mb-10 flex justify-between gap-10">
        <div>
          <h1 className="text-4xl font-black">
            Welcome back,{" "}
            <span className="text-blue-600">{user?.name || "Agent"}</span>
          </h1>
          <p className="text-slate-500 mt-2">Ready to close some deals today?</p>
        </div>
        <LogOutButton />
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] animate-pulse"
            />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="p-10 flex flex-col items-center justify-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-xl font-black dark:text-white mb-2">No Courses Assigned</h3>
          <p className="text-slate-400 font-medium text-sm text-center max-w-sm">
            You haven&apos;t been enrolled in any courses yet. Contact your admin to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link href={`/courses/${course.id}`} key={course.id}>
              <CourseCard course={course} />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
