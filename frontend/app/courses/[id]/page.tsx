"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/services/CourseService";
import { Course, Lesson } from "@/types/course";
import Link from "next/link";

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

  // const { percentage, completedCount, totalCount } = course?.progress;

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse">Loading Lessons...</div>
    );
  if (!course) return <div className="p-20 text-center">Course not found.</div>;

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
        <h1 className="text-5xl font-black mt-2 mb-4 dark:text-white">
          {course.title}
        </h1>
        <p className="text-slate-500 text-xl max-w-2xl">{course.description}</p>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Your Journey
            </span>
            <span className="text-sm font-bold text-slate-400">
              {course.progress.completedCount} / {course.progress.totalCount}
            </span>
          </div>

          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-4xl font-black dark:text-white">{course.progress.percentage}%</span>
            <span className="text-slate-500 font-bold text-sm">Complete</span>
          </div>

          <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-700 ease-out rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              style={{ width: `${course.progress.percentage}%` }}
            />
          </div>
          
          {course.progress.percentage === 100 && (
            <div className="mt-4 flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-bold">
              <span>✨ Course Mastered</span>
            </div>
          )}
        </div>
      </section>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
        {course.lessons?.map((lesson: Lesson, index) => (
          <div
            key={lesson.id}
            className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <span className="text-slate-300 font-mono text-lg group-hover:text-blue-500 transition-colors">
                0{index + 1}
              </span>
              <h3 className="font-bold text-lg dark:text-white">
                {lesson.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {lesson?.lessonProgress[0]?.completed ? (
                <Link
                  key={lesson.lessonProgress[0]?.id}
                  href={`/courses/${course.id}/lesson/${lesson.id}`}
                  className="flex items-center gap-2 bg-green-600 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl text-sm font-bold"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Review Lesson
                </Link>
              ) : (
                <Link
                  key={lesson.lessonProgress[0]?.id}
                  href={`/courses/${course.id}/lesson/${lesson.id}`}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl text-sm font-bold"
                >
                  Start Lesson
                </Link>
              )}
              
              {/* {lesson.lessonProgress.completed ? (
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Passed
                </span>
              ) : (
                <Link
                  href={`/courses/${course.id}/lesson/${lesson.id}`}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl text-sm font-bold"
                >
                  Start Lesson
                </Link>
              )} */}
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
}
