"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/CourseService";
import { AgentsReport, EnrolledCourses } from "@/types/course";

export default function AdminReportPage() {
  const [reports, setReports] = useState<AgentsReport[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-20 text-center animate-pulse">Generating Report...</div>;

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-black tracking-tight dark:text-white">Management Console</h1>
        <p className="text-slate-500 mt-2">Track agent performance and course completion rates.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">Total Agents</span>
          <p className="text-3xl font-black mt-1 dark:text-white">{reports.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">Active Enrollments</span>
          <p className="text-3xl font-black mt-1 dark:text-white">
            {reports.reduce((acc, r) => acc + r.coursesEnrolled, 0)}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <th className="p-6 text-sm font-black uppercase text-slate-400">Agent</th>
              <th className="p-6 text-sm font-black uppercase text-slate-400">Course</th>
              <th className="p-6 text-sm font-black uppercase text-slate-400">Progress</th>
              <th className="p-6 text-sm font-black uppercase text-slate-400 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {reports.map((agent) => (
              agent.enrolledCourses.map((course: EnrolledCourses, idx: number) => (
                <tr key={`${agent.agentEmail}-${idx}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-6 font-bold dark:text-white">
                    {idx === 0 ? agent.agentEmail : ""} 
                  </td>
                  <td className="p-6 text-slate-600 dark:text-slate-400">{course.courseTitle}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full" 
                          style={{ width: course.completionRate }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-500">{course.completionRate}</span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter
                      ${course.status === 'GRADUATED' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                      {course.status}
                    </span>
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}