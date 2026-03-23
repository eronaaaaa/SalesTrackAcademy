"use client";
import { useAuth } from "@/hooks/authHook";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth("ADMIN");

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">
          Authenticating Admin...
        </p>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950">
      <main className="flex-1 p-8 lg:p-12 max-w-[1400px] mx-auto">
        {children}
      </main>
    </div>
  );
}