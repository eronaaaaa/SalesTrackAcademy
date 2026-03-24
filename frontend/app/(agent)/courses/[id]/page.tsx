"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/services/CourseService";
import { Course } from "@/types/course";
import Link from "next/link";
import CourseProgressCard from "@/components/CourseProgressCard";
import LessonList from "@/components/LessonList";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await api.getCourseById(id as string);
        setCourse(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading)
    return <div className="p-20 text-center animate-pulse">Loading Lessons...</div>;
  if (!course)
    return <div className="p-20 text-center">Course not found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-12">
        <Link
          href="/"
          className="mb-1 text-sm font-bold flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
        >
          ← Go back
        </Link>
        <br />
        <span className="text-blue-600 font-bold tracking-widest text-xs uppercase">
          Course Module
        </span>
        <h1 className="text-5xl font-black mt-2 mb-4 dark:text-white">{course.title}</h1>
        <p className="text-slate-500 text-xl max-w-2xl">{course.description}</p>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <CourseProgressCard progress={course.progress} />
      </section>

      <LessonList courseId={course.id} lessons={course.lessons} />
    </div>
  );
}