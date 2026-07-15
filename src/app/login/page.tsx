"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { dashboardPathFor, Role } from "@/lib/useAuth";

// demo login-এর জন্য আগে থেকে seed করা account (npm run seed:demo)
const DEMO = {
  customer: { email: "customer@mistiri.app", password: "Demo@1234" },
  admin: { email: "admin@mistiri.app", password: "Admin@1234" },
};

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // email/password দিয়ে login — demo button-ও এটাই ব্যবহার করে
  const submit = async (email: string, password: string) => {
    setError("");
    // client-side validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("সঠিক email দিন");
    if (password.length < 6) return setError("password কমপক্ষে ৬ অক্ষর");

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      // role অনুযায়ী নিজের dashboard-এ পাঠাই
      router.push(dashboardPathFor(res.data.user.role as Role));
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ink-50 p-6">
      {/* লোগো — হোমে ফেরে */}
      <Link
        href="/"
        className="text-2xl font-bold tracking-tight text-brand-600 hover:text-brand-700"
      >
        Mistiri
      </Link>

      <div className="w-full max-w-sm rounded-xl border border-ink-100 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-ink-900">Login</h1>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(form.email, form.password);
          }}
          className="space-y-4"
        >
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-ink-200 p-2.5 text-ink-900 placeholder-ink-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-lg border border-ink-200 p-2.5 text-ink-900 placeholder-ink-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-500 p-2.5 font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* demo login — এক ক্লিকে ভরে দিয়ে login */}
        <div className="mt-4">
          <p className="mb-2 text-center text-xs text-ink-500">
            Quick demo login
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => submit(DEMO.customer.email, DEMO.customer.password)}
              disabled={loading}
              className="flex-1 rounded-lg border border-ink-200 px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-50 disabled:opacity-50"
            >
              Customer
            </button>
            <button
              onClick={() => submit(DEMO.admin.email, DEMO.admin.password)}
              disabled={loading}
              className="flex-1 rounded-lg border border-ink-200 px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-50 disabled:opacity-50"
            >
              Admin
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-ink-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-brand-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
