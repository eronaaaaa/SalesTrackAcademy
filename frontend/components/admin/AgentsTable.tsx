import { useState } from "react";
import { AgentsReport, EnrolledCourses } from "@/types/course";
import React from "react";

interface AgentsTableProps {
  reports: AgentsReport[];
  selectedEmails: string[];
  onToggleSelectAll: () => void;
  onToggleSelectAgent: (email: string) => void;
}

export default function AgentsTable({
  reports,
  selectedEmails,
  onToggleSelectAll,
  onToggleSelectAgent,
}: AgentsTableProps) {
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  const toggleAgent = (email: string) => {
    setExpandedAgent(expandedAgent === email ? null : email);
  };

  return (
    <div className="mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <th className="p-6">
              <input
                type="checkbox"
                className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
                checked={selectedEmails.length === reports.length && reports.length > 0}
                onChange={onToggleSelectAll}
              />
            </th>
            <th className="p-6 text-sm font-black uppercase text-slate-400">Agent</th>
            <th className="p-6 text-sm font-black uppercase text-slate-400 text-center">Courses</th>
            <th className="p-6 text-sm font-black uppercase text-slate-400 text-right">Action</th>
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
                      onToggleSelectAgent(agent.agentEmail);
                    }}
                  />
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">
                      {agent.agentEmail[0].toUpperCase()}
                    </div>
                    <span className="font-bold dark:text-white">{agent.agentEmail}</span>
                  </div>
                </td>
                <td className="p-6 text-center">
                  <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-500">
                    {agent.enrolledCourses.length} Enrolled
                  </span>
                </td>
                <td className="p-6 text-right">
                  <span
                    className={`transition-transform inline-block ${
                      expandedAgent === agent.agentEmail ? "rotate-180" : ""
                    }`}
                  >
                    ↓
                  </span>
                </td>
              </tr>

              {expandedAgent === agent.agentEmail && (
                <tr>
                  <td colSpan={4} className="bg-slate-50/50 dark:bg-slate-800/20 p-6">
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      {agent.enrolledCourses.map((course: EnrolledCourses, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800"
                        >
                          <div className="flex-1">
                            <p className="font-bold text-sm dark:text-white">{course.courseTitle}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="w-32 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-600"
                                  style={{ width: course.completionRate }}
                                />
                              </div>
                              <span className="text-[10px] font-bold text-slate-400">
                                {course.completionRate}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              course.status === "GRADUATED"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {course.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}