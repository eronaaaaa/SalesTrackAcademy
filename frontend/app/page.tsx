"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/CourseService";
import { Course } from "@/types/course";
import CourseCard from "@/components/CourseCard";
import Link from "next/link";

export default function DashboardPage() {
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

  if (loading)
    return <div className="p-10 text-center">Loading Academy...</div>;

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <header className="mb-10">
          <h1 className="text-4xl font-black tracking-tight hover:text-blue-600 transition-colors cursor-pointer">
            SalesTrack Academy
          </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Your path to Sales Mastery starts here.
        </p>
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
