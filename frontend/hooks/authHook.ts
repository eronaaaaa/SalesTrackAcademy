import { User } from "@/types/course";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useAuth = (requiredRole?: "ADMIN" | "AGENT") => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      setIsLoading(false);
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      if (requiredRole && parsedUser.role !== requiredRole) {
        const redirectPath = parsedUser.role === "ADMIN" ? "/admin/dashboard" : "/";
        router.push(redirectPath);
      }
    } catch (err) {
      localStorage.clear();
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [requiredRole, router]);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  console.log(user?.name)

  return { user, logout, isLoading };
};