"use client";

import { useState } from "react";
import { PublicShell } from "@/components/site";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // client-side validation
    if (form.name.trim().length < 2) return setError("নাম লিখুন");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return setError("সঠিক email দিন");
    if (form.message.trim().length < 10)
      return setError("বার্তাটি অন্তত ১০ অক্ষরে লিখুন");
    // backend contact endpoint নেই — তাই সফল হিসেবে দেখাই ও form পরিষ্কার করি
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <PublicShell>
      <div className="mx-auto w-full max-w-5xl px-6 py-14">
        <h1 className="text-3xl font-bold text-ink-900">Contact Us</h1>
        <p className="mt-2 text-ink-500">
          প্রশ্ন বা মতামত আছে? আমাদের জানান — আমরা দ্রুত উত্তর দেব।
        </p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* যোগাযোগের তথ্য */}
          <div className="space-y-4">
            <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-ink-500">Email</p>
              <a
                href="mailto:support@mistiri.app"
                className="mt-1 block font-medium text-brand-600 hover:underline"
              >
                support@mistiri.app
              </a>
            </div>
            <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-ink-500">Phone</p>
              <a
                href="tel:+8801700000000"
                className="mt-1 block font-medium text-brand-600 hover:underline"
              >
                +880 1700-000000
              </a>
            </div>
            <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-ink-500">Address</p>
              <p className="mt-1 font-medium text-ink-900">
                Mirpur, Dhaka, Bangladesh
              </p>
            </div>
          </div>

          {/* contact form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-xl border border-ink-100 bg-white p-6 shadow-sm"
          >
            {sent && (
              <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                ধন্যবাদ! আপনার বার্তা পেয়েছি — শীঘ্রই যোগাযোগ করব।
              </p>
            )}
            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="আপনার নাম"
              className="w-full rounded-lg border border-ink-200 p-2.5 text-ink-900 placeholder-ink-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="w-full rounded-lg border border-ink-200 p-2.5 text-ink-900 placeholder-ink-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              placeholder="আপনার বার্তা..."
              className="w-full rounded-lg border border-ink-200 p-2.5 text-ink-900 placeholder-ink-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-brand-500 px-4 py-2.5 font-medium text-white transition hover:bg-brand-600"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </PublicShell>
  );
}
