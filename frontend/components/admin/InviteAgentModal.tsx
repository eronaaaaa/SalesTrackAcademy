"use client";
import { useState, useEffect } from "react";
import { api } from "@/services/CourseService";
import { Course } from "@/types/course";

export default function InviteAgentModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  useEffect(() => {
    api.getCourses().then(setCourses).catch(console.error);
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const data = await api.inviteAgent(email, courseId);

      setStatus({ type: "success", msg: data.message });
      setEmail("");
      setCourseId("");
    } catch (err) {
      setStatus({ type: "error", msg: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700 w-full max-w-md">
        <h3 className="text-2xl font-black mb-2">Invite Agent</h3>
        <p className="text-slate-500 text-sm mb-6">
          Assign a course and notify them via email.
        </p>

        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-2">
              Agent Email
            </label>
            <input
              type="email"
              placeholder="agent@example.com"
              required
              className="w-full p-4 mt-1 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-2">
              Select Course
            </label>
            <select
              required
              className="w-full p-4 mt-1 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              <option value="">Choose a course...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {status && (
            <div
              className={`p-4 rounded-xl text-sm font-bold ${status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {status.msg}
            </div>
          )}
          <div className="flex-col justify-between items-center space-y-2">
            <button
              disabled={loading}
              onClick={handleInvite}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-black transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Sending Invitation..." : "Send Enrollment Email"}
            </button>
            <button
              disabled={loading}
              onClick={() => setShowModal(false)}
              className="w-full bg-slate-400 hover:bg-slate-500 text-white p-4 rounded-2xl font-black transition-all active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
