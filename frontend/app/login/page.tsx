"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (courseId) {
        router.push(`/courses/${courseId}`);
      } else {
        router.push(data.user.role === "ADMIN" ? "/admin" : "/");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="p-10 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl w-[400px] border border-slate-100 dark:border-slate-800">
        <header className="text-center mb-10">
          <h2 className="text-3xl font-black dark:text-white tracking-tight">
            Login to Academy
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            Enter your credentials to access your agent dashboard
          </p>
        </header>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-4 rounded-2xl border-none bg-slate-100 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 rounded-2xl border-none bg-slate-100 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              onChange={(e) => setPassword(e.target.value)}
            />{" "}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
            >
              Enter Academy
            </button>
          </div>
        </form>{" "}
        <footer className="mt-8 text-center text-sm">
          <p className="text-slate-500 font-medium">
            Don`&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-bold hover:underline"
            >
              Register
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
