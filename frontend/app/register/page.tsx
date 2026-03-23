"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const courseToAssign = searchParams.get("courseId");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          courseId: courseToAssign,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.role === "ADMIN") {
          router.push("/admin");
        } else if (courseToAssign) {
          router.push(`/courses/${courseToAssign}`);
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("Something went wrong. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="p-10 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl w-[400px] border border-slate-100 dark:border-slate-800">
        <header className="text-center mb-10">
          <h2 className="text-3xl font-black dark:text-white tracking-tight">
            Join Academy
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            Create your agent account
          </p>
        </header>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full p-4 rounded-2xl border-none bg-slate-100 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full p-4 rounded-2xl border-none bg-slate-100 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Create Password"
            required
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
            <Link
              href="/login"
              className="text-blue-600 font-bold hover:underline"
            >
              Log In
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
