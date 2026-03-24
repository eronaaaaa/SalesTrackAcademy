"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const courseToAssign = searchParams.get("courseId");

  const [name, setName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, courseId: courseToAssign }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push(
          data.user.role === "ADMIN" ? "/admin" :
          courseToAssign ? `/courses/${courseToAssign}` : "/"
        );
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="p-10 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl w-[400px] border border-slate-100 dark:border-slate-800">
        <header className="text-center mb-10">
          <h2 className="text-3xl font-black dark:text-white tracking-tight">Join Academy</h2>
          <p className="text-slate-500 mt-2 font-medium">Create your agent account</p>
        </header>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-bold px-4 py-3 rounded-2xl">
              ⚠️ {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            className="w-full p-4 rounded-2xl border-none bg-slate-100 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            className="w-full p-4 rounded-2xl border-none bg-slate-100 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Create Password"
            className="w-full p-4 rounded-2xl border-none bg-slate-100 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Start Learning"}
          </button>
        </form>

        <footer className="mt-8 text-center text-sm">
          <p className="text-slate-500 font-medium">
            Already a member?{" "}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Log In
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
