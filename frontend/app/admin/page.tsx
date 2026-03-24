"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/services/CourseService";
import { AgentsReport, EnrolledCourses } from "@/types/course";
import React from "react";
import InviteAgentModal from "@/components/admin/InviteAgentModal";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalAgents: 0,
    totalCourses: 0,
    totalAssignments: 0,
    averageScore: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const toggleAgent = (email: string) => {
    setExpandedAgent(expandedAgent === email ? null : email);
  };

  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [availableCourses, setAvailableCourses] = useState<
    { id: number; title: string }[]
  >([]);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await api.getCourses();
      setAvailableCourses(data);
    };
    fetchCourses();
  }, []);

  const toggleSelectAll = () => {
    if (selectedEmails.length === reports.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(reports.map((r) => r.agentEmail));
    }
  };

  const toggleSelectAgent = (email: string) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email],
    );
  };

  const handleBulkAssign = async (courseId: string) => {
    if (!courseId) return;
    setIsAssigning(true);
    try {
      await api.bulkAssign(selectedEmails, courseId);
      alert(`Successfully assigned course to ${selectedEmails.length} agents`);
      setSelectedEmails([]);
      const updatedReports = await api.getAgentProgressReport();
      setReports(updatedReports);
    } catch (err) {
      console.error("Bulk assign failed", err);
    } finally {
      setIsAssigning(false);
    }
  };

  const [reports, setReports] = useState<AgentsReport[]>([]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await api.getAgentProgressReport();
        setReports(data);
      } catch (err) {
        console.error("Report fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const res = await api.getGlobalDashboard();
        const data = res.platformOverview;

        setStats({
          totalAgents: data.totalAgents,
          totalCourses: data.totalCourses,
          totalAssignments: data.totalAssignments,
          averageScore: data.averageQuizScore,
          completionRate: data.completionRate,
        });
      } catch (err) {
        console.error("Failed to load global stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGlobalStats();
  }, []);

  return (
    <main className="pt-8 pb-8 max-w-6xl mx-auto">
      <header className="mb-12 flex justify-between">
        <div>
          <h1 className="text-5xl font-black tracking-tight dark:text-white">
            Admin Console
          </h1>
          <p className="text-slate-500 text-lg mt-2 font-medium">
            Manage your academy and track agent performance.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="h-14 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all"
        >
          <span>+</span> Invite New Agent
        </button>
      </header>
      {showModal && (
        <InviteAgentModal showModal={showModal} setShowModal={setShowModal} />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6 pt-6">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8">
            <div className="bg-blue-600 p-4 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/20">
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                Active Agents
              </span>
              <p className="text-4xl font-black mt-2">{stats.totalAgents}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-green-600">
                Completion Rate
              </span>
              <p className="text-4xl font-black mt-2 text-green-600">
                {stats.completionRate}%
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Published Courses
              </span>
              <p className="text-4xl font-black mt-2 dark:text-white">
                {stats.totalCourses}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Total Assignments
              </span>
              <p className="text-4xl font-black mt-2 dark:text-white">
                {stats.totalAssignments}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Avg. Quiz Score
              </span>
              <div className="flex items-end gap-2 mt-2">
                <p className="text-4xl font-black">{stats.averageScore}%</p>
              </div>
              <div className="flex gap-1 mt-4">
                {[1, 2, 3, 4, 5].map((dot) => {
                  const numericScore =
                    typeof stats.averageScore === "string"
                      ? parseInt(stats.averageScore)
                      : stats.averageScore;

                  const isActive = numericScore / 20 >= dot;

                  return (
                    <div
                      key={dot}
                      className={`h-1.5 w-full rounded-full transition-colors duration-500 ${
                        isActive
                          ? "bg-blue-500"
                          : "bg-blue-500/20"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

          </section>

          <section className="">
            <button
              onClick={() => router.push("/admin/courses")}
              className="w-[100%] group text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[3rem] hover:border-blue-500 transition-all hover:shadow-2xl"
            >
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                🛠️
              </div>
              <h2 className="text-2xl font-black dark:text-white mb-2">
                Manage Courses
              </h2>
              <p className="text-slate-500 font-medium">
                Create new training modules, upload videos/PDFs, and reorder
                lessons.
              </p>
              <div className="mt-8 flex items-center gap-2 text-blue-600 font-bold text-sm">
                Open Library <span>→</span>
              </div>
            </button>
          </section>
        </div>
        <div className="lg:col-span-7 space-y-6">
          <div className="mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="p-6">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={
                        selectedEmails.length === reports.length &&
                        reports.length > 0
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="p-6 text-sm font-black uppercase text-slate-400">
                    Agent
                  </th>
                  <th className="p-6 text-sm font-black uppercase text-slate-400 text-center">
                    Courses
                  </th>
                  <th className="p-6 text-sm font-black uppercase text-slate-400 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {reports.map((agent) => (
                  <React.Fragment key={agent.agentEmail}>
                    <tr
                      onClick={() => toggleAgent(agent.agentEmail)}
                      className="cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-6">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedEmails.includes(agent.agentEmail)}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleSelectAgent(agent.agentEmail);
                          }}
                        />
                      </td>

                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">
                            {agent.agentEmail[0].toUpperCase()}
                          </div>
                          <span className="font-bold dark:text-white">
                            {agent.agentEmail}
                          </span>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-500">
                          {agent.enrolledCourses.length} Enrolled
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <span
                          className={`transition-transform inline-block ${expandedAgent === agent.agentEmail ? "rotate-180" : ""}`}
                        >
                          ↓
                        </span>
                      </td>
                    </tr>

                    {expandedAgent === agent.agentEmail && (
                      <tr>
                        <td
                          colSpan={3}
                          className="bg-slate-50/50 dark:bg-slate-800/20 p-6"
                        >
                          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            {agent.enrolledCourses.map(
                              (course: EnrolledCourses, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800"
                                >
                                  <div className="flex-1">
                                    <p className="font-bold text-sm dark:text-white">
                                      {course.courseTitle}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1">
                                      <div className="w-32 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-blue-600"
                                          style={{
                                            width: course.completionRate,
                                          }}
                                        />
                                      </div>
                                      <span className="text-[10px] font-bold text-slate-400">
                                        {course.completionRate}
                                      </span>
                                    </div>
                                  </div>
                                  <span
                                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest
                        ${course.status === "GRADUATED" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                                  >
                                    {course.status}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {selectedEmails.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-8 animate-in slide-in-from-bottom-10 z-50 border border-slate-700/50">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
              Selected
            </span>
            <span className="font-bold">{selectedEmails.length} Agents</span>
          </div>

          <div className="h-8 w-[1px] bg-slate-700 dark:bg-slate-200" />

          <div className="flex items-center gap-4">
            <select
              onChange={(e) => handleBulkAssign(e.target.value)}
              disabled={isAssigning}
              className="bg-slate-800 dark:bg-slate-100 border-none rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Assign to Course...</option>
              {availableCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>

            <button
              onClick={() => setSelectedEmails([])}
              className="text-xs font-bold hover:underline opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
