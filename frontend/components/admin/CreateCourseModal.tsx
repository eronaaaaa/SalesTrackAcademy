"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/ApiService";

interface CreateCourseModalProps {
  onClose: () => void;
}

export default function CreateCourseModal({ onClose }: CreateCourseModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({ title: "", description: "", thumbnail: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.createCourse(formData.title, formData.description, formData.thumbnail);
      router.push(`/admin/courses/edit/${res.course.id}`);
    } catch (err) {
      console.error("Creation failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-start mb-8">
          <h2 className="text-3xl font-black dark:text-white">New Course</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">
              Course Title
            </label>
            <input
              required
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-600 dark:text-white"
              placeholder="e.g., Advanced Closing Techniques"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-600 dark:text-white"
              placeholder="Describe what the agents will learn..."
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create & Add Lessons →"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl font-bold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}