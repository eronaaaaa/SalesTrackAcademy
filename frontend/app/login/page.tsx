"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

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
      router.push("/");
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <form onSubmit={handleLogin} className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">SalesTrack Login</h2>
        <input 
          type="email" placeholder="Email" 
          className="w-full p-3 mb-4 rounded-lg border dark:bg-slate-700 dark:border-slate-600"
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" placeholder="Password" 
          className="w-full p-3 mb-6 rounded-lg border dark:bg-slate-700 dark:border-slate-600"
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700">
          Enter Academy
        </button>
      </form>
    </div>
  );
}