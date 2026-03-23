"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/CourseService";
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

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center font-black animate-pulse">
        Verifying Access...
      </div>
    );
  }

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <header className="mb-10 flex justify-between">
        <div>
          <h1 className="text-4xl font-black">
            Welcome back,{" "}
            <span className="text-blue-600">{user?.name || "Agent"}</span>
          </h1>
          <p className="text-slate-500 mt-2">
            Ready to close some deals today?
          </p>
        </div>

        <LogOutButton />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link href={`/courses/${course.id}`} key={course.id}>
            <CourseCard key={course.id} course={course} />
          </Link>
        ))}
      </div>
    </main>
  );
}
