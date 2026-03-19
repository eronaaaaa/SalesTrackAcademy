"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/CourseService";

export default function CreateCoursePage() {
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
    <main className="max-w-3xl mx-auto p-12">
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl">
        <h1 className="text-4xl font-black mb-8 dark:text-white">Create New Course</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Course Title</label>
            <input 
              required
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-600"
              placeholder="e.g., Advanced Closing Techniques"
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Description</label>
            <textarea 
              rows={4}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-600"
              placeholder="Describe what the agents will learn..."
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <button 
            disabled={loading}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            {loading ? "Initializing..." : "Create Course & Add Lessons →"}
          </button>
        </form>
      </div>
    </main>
  );
}