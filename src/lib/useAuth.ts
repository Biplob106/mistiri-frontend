"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "./api";

export type Role = "customer" | "technician" | "admin";

export interface AuthUser {
  name: string;
  email: string;
  role: Role;
}

// কোন role কোন dashboard-এ যাবে — এক জায়গায় রাখলাম যাতে login ও guard একই নিয়ম মানে
export const dashboardPathFor = (role: Role): string =>
  role === "admin"
    ? "/admin/dashboard"
    : role === "technician"
    ? "/technician/dashboard"
    : "/dashboard";

// টোকেন যাচাই করে logged-in user আনে।
// allowedRole দিলে সেই role ছাড়া অন্য কেউ এলে তাকে তার নিজের dashboard-এ পাঠায়,
// আর token না থাকলে/অকেজো হলে login page-এ ফেরত পাঠায়।
export function useAuthGuard(allowedRole?: Role) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    api
      .get("/auth/me")
      .then((res) => {
        const me: AuthUser = res.data.user;

        // ভুল role হলে নিজের সঠিক dashboard-এ পাঠাই (checking true-ই থাকে, redirect চলে)
        if (allowedRole && me.role !== allowedRole) {
          router.replace(dashboardPathFor(me.role));
          return;
        }

        setUser(me);
        setChecking(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/login");
      });
  }, [router, allowedRole]);

  return { user, checking };
}

// logout — browser থেকে token/user মুছে login-এ পাঠায়
export function logout(router: ReturnType<typeof useRouter>) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.replace("/login");
}
