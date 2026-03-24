"use client";
import { useAuth } from "@/hooks/authHook";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AgentGuardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth("AGENT");
  const router = useRouter();

  // useEffect(() => {
  //   if (!isLoading && (!user || user.role !== "AGENT")) {
  //     router.push("/login");
  //   }
  // }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">
          Authenticating Agent...
        </p>
      </div>
    );
  }

  return user?.role === "AGENT" ? <>{children}</> : null;
}