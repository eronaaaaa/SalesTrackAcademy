import { useAuth } from "@/hooks/authHook";
import { LogOut } from "lucide-react";
export default function LogOutButton() {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col">
        <span className="text-xs font-black uppercase text-blue-600">
          {user?.role}
        </span>
        <span className="text-sm font-bold dark:text-white truncate max-w-[120px]">
          {user?.email}
        </span>
      </div>
      <button
        onClick={logout}
        className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl transition-all"
        title="Logout"
      >
        <LogOut size={18} />
      </button>
    </div>
  );
}
