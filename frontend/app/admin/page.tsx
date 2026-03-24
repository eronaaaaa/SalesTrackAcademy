"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/ApiService";
import { AgentsReport } from "@/types/course";
import InviteAgentModal from "@/components/admin/InviteAgentModal";
import StatsGrid from "@/components/admin/StatsGrid";
import AgentsTable from "@/components/admin/AgentsTable";
import BulkAssignBar from "@/components/admin/BulkAssignBar";
import LogOutButton from "@/components/buttons/LogOutButton";

interface Stats {
  totalAgents: number;
  totalCourses: number;
  totalAssignments: number;
  averageScore: number;
  completionRate: number;
  totalComments: number;
}

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState<Stats>({
    totalAgents: 0,
    totalCourses: 0,
    totalAssignments: 0,
    averageScore: 0,
    completionRate: 0,
    totalComments: 0,
  });
  const [reports, setReports] = useState<AgentsReport[]>([]);
  const [availableCourses, setAvailableCourses] = useState<
    { id: number; title: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [reportData, globalData, coursesData] = await Promise.all([
          api.getAgentProgressReport(),
          api.getGlobalDashboard(),
          api.getCourses(),
        ]);
        setReports(reportData);
        setAvailableCourses(coursesData);
        const d = globalData.platformOverview;
        setStats({
          totalAgents: d.totalAgents,
          totalCourses: d.totalCourses,
          totalAssignments: d.totalAssignments,
          averageScore: d.averageQuizScore,
          completionRate: d.completionRate,
          totalComments: d.totalComments,
        });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const toggleSelectAll = () => {
    setSelectedEmails(
      selectedEmails.length === reports.length
        ? []
        : reports.map((r) => r.agentEmail),
    );
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
      const updated = await api.getAgentProgressReport();
      setReports(updated);
    } catch (err) {
      console.error("Bulk assign failed", err);
    } finally {
      setIsAssigning(false);
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse text-slate-500">
        Loading Dashboard...
      </div>
    );

  return (
    <main className="max-w-6xl mx-auto">
      <header className="mb-12 flex justify-between">
        <div>
          <h1 className="text-5xl font-black tracking-tight dark:text-white">
            Admin Console
          </h1>
          <p className="text-slate-500 text-lg mt-2 font-medium">
            Manage your academy and track agent performance.
          </p>
        </div>
        <div className="flex items-center gap-4"> 
        <button
          onClick={() => setShowModal(true)}
          className="h-14 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all"
        >
          <span>+</span> Agent
        </button><LogOutButton /></div>
       
      </header>

      {showModal && (
        <InviteAgentModal showModal={showModal} setShowModal={setShowModal} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6 pt-6">
          <StatsGrid stats={stats} />

          <section>
            <button
              onClick={() => router.push("/admin/courses")}
              className="w-full group text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[3rem] hover:border-blue-500 transition-all hover:shadow-2xl"
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
          <AgentsTable
            reports={reports}
            selectedEmails={selectedEmails}
            onToggleSelectAll={toggleSelectAll}
            onToggleSelectAgent={toggleSelectAgent}
            onRefresh={async () =>
              setReports(await api.getAgentProgressReport())
            }
          />
        </div>
      </div>

      {selectedEmails.length > 0 && (
        <BulkAssignBar
          selectedCount={selectedEmails.length}
          availableCourses={availableCourses}
          isAssigning={isAssigning}
          onAssign={handleBulkAssign}
          onCancel={() => setSelectedEmails([])}
        />
      )}
    </main>
  );
}
