"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

// রেজিস্ট্রেশনে role বাছা যায় — customer বা technician
const roles = [
  { value: "customer", label: "গ্রাহক (Customer)" },
  { value: "technician", label: "মিস্ত্রি (Technician)" },
];

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // client-side validation — খালি/ভুল field submit-এর আগে ধরি
  const validate = () => {
    if (form.name.trim().length < 2) return "নাম কমপক্ষে ২ অক্ষর";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "সঠিক email দিন";
    if (form.password.length < 6) return "password কমপক্ষে ৬ অক্ষর";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);

    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });
      // সফল হলে login page-এ পাঠাই
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ink-50 p-6">
      <Link
        href="/"
        className="text-2xl font-bold tracking-tight text-brand-600 hover:text-brand-700"
      >
        Mistiri
      </Link>

      <div className="w-full max-w-sm rounded-xl border border-ink-100 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-ink-900">Register</h1>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-ink-200 p-2.5 text-ink-900 placeholder-ink-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
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
            placeholder="Password (min 6 chars)"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-lg border border-ink-200 p-2.5 text-ink-900 placeholder-ink-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          {/* role select */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full rounded-lg border border-ink-200 p-2.5 text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-500 p-2.5 font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
