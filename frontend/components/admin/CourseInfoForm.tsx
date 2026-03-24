import { useEffect, useState } from "react";
import { Course } from "@/types/course";

interface CourseInfoFormProps {
  course: Course;
  loading: boolean;
  onSave: (title: string, description: string, thumbnail: string) => void;
}

export default function CourseInfoForm({ course, loading, onSave }: CourseInfoFormProps) {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description ?? "");
  const [thumbnail, setThumbnail] = useState(course.thumbnail ?? "");

  useEffect(() => {
    setTitle(course.title);
    setDescription(course.description ?? "");
    setThumbnail(course.thumbnail ?? "");
  }, [course]);

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
      <h2 className="text-xl font-bold mb-6 dark:text-white">Course Info</h2>
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1 block">
            Title
          </label>
          <input
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Course Title"
          />
        </div>

        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1 block">
            Description
          </label>
          <textarea
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this course about?"
          />
        </div>

        <button
          onClick={() => onSave(title, description, thumbnail)}
          disabled={loading}
          className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Details"}
        </button>
      </div>
    </div>
  );
}