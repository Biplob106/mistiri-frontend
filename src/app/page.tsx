"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicShell } from "@/components/site";

// হোম পেজের সব static data — এক জায়গায়

const categories = [
  { icon: "❄️", name: "AC Repair", desc: "ঠান্ডা হচ্ছে না, লিক করছে?" },
  { icon: "🚿", name: "Plumbing", desc: "কল, পাইপ, বাথরুম" },
  { icon: "⚡", name: "Electrical", desc: "ওয়্যারিং, সুইচ, লোড" },
  { icon: "🔧", name: "Appliance", desc: "ফ্রিজ, ওয়াশার, ওভেন" },
];

const steps = [
  { title: "সমস্যা লিখুন", desc: "নিজের ভাষায় সমস্যাটা লিখুন।" },
  { title: "কারণ ও খরচ", desc: "সম্ভাব্য কারণ ও আনুমানিক খরচ পান।" },
  { title: "মিস্ত্রি বুক", desc: "এলাকা অনুযায়ী উপযুক্ত মিস্ত্রি বাছুন।" },
  { title: "ট্র্যাক ও রিভিউ", desc: "কাজ track করুন, রিভিউ দিন।" },
];

const features = [
  { icon: "🩺", title: "Instant Diagnosis", desc: "লিখলেই সম্ভাব্য কারণ ও সমাধান।" },
  { icon: "✅", title: "Verified Technicians", desc: "যাচাই করা দক্ষ মিস্ত্রি।" },
  { icon: "💸", title: "Transparent Cost", desc: "আগেই আনুমানিক খরচ জানুন।" },
  { icon: "📍", title: "Area Matching", desc: "নিজের এলাকার মিস্ত্রি খুঁজুন।" },
];

const highlights = [
  { big: "4", small: "Service Categories" },
  { big: "3", small: "User Roles" },
  { big: "24/7", small: "Request Anytime" },
  { big: "৳", small: "Upfront Estimates" },
];

const audiences = [
  { label: "গ্রাহক", desc: "সমস্যা জমা দিন, diagnosis নিন, মিস্ত্রি বুক ও রিভিউ দিন।" },
  { label: "মিস্ত্রি", desc: "প্রোফাইল ও দক্ষতা যোগ করুন, কাজ accept ও status আপডেট দিন।" },
  { label: "অ্যাডমিন", desc: "ব্যবহারকারী ও মিস্ত্রি যাচাই করুন, analytics দেখুন।" },
];

const faqs = [
  {
    q: "Mistiri কী?",
    a: "এটি একটি স্মার্ট হোম-মেইনটেন্যান্স প্ল্যাটফর্ম — সমস্যা লিখলে সম্ভাব্য কারণ, আনুমানিক খরচ ও উপযুক্ত মিস্ত্রি খুঁজে দেয়।",
  },
  {
    q: "খরচ কীভাবে জানব?",
    a: "সমস্যা জমা দেওয়ার সঙ্গে সঙ্গেই একটি আনুমানিক খরচের রেঞ্জ দেখানো হয়, যাতে আগে থেকেই ধারণা থাকে।",
  },
  {
    q: "মিস্ত্রিরা কি যাচাই করা?",
    a: "যাচাই করা মিস্ত্রিদের প্রোফাইলে Verified ব্যাজ থাকে। রেটিং ও রিভিউ দেখে আপনি বেছে নিতে পারেন।",
  },
  {
    q: "কীভাবে বুক করব?",
    a: "একটি repair request তৈরি করুন, মানানসই মিস্ত্রি দেখে Book করুন, তারপর কাজের অবস্থা track করুন।",
  },
];

// FAQ-র একেকটা আইটেম — খোলা/বন্ধ toggle (interactive)
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-ink-100 bg-white shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-ink-900"
      >
        {q}
        <span className="text-brand-600">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="px-5 pb-4 text-sm text-ink-500">{a}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <PublicShell>
      {/* ===== ১. HERO — screen-এর ~65% উঁচু ===== */}
      <section className="flex min-h-[65vh] items-center bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 text-center">
          <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-700">
            স্মার্ট হোম-মেইনটেন্যান্স
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-ink-900 sm:text-5xl">
            ঘরের মেরামত এখন সহজ — কারণ, খরচ আর মিস্ত্রি{" "}
            <span className="text-brand-600">এক জায়গায়</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-500">
            সমস্যাটা শুধু লিখুন। Mistiri সম্ভাব্য কারণ ও আনুমানিক খরচ জানাবে,
            উপযুক্ত মিস্ত্রি খুঁজে দেবে, আর পুরো কাজটা track করতে দেবে।
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="w-full rounded-lg bg-brand-500 px-6 py-3 text-center font-semibold text-white hover:bg-brand-600 sm:w-auto"
            >
              শুরু করুন
            </Link>
            <Link
              href="/technicians"
              className="w-full rounded-lg border border-ink-200 bg-white px-6 py-3 text-center font-semibold text-ink-700 hover:bg-ink-50 sm:w-auto"
            >
              মিস্ত্রি দেখুন
            </Link>
          </div>
          {/* scroll indicator — subtle animation */}
          <div className="mt-12 animate-bounce text-2xl text-brand-500">↓</div>
        </div>
      </section>

      {/* ===== ২. CATEGORIES ===== */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold text-ink-900 sm:text-3xl">
          কোন কাজে সাহায্য দরকার?
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.name}
              href="/technicians"
              className="rounded-xl border border-ink-100 bg-white p-6 text-center shadow-sm transition hover:border-brand-300 hover:shadow"
            >
              <div className="text-4xl">{c.icon}</div>
              <h3 className="mt-3 font-semibold text-ink-900">{c.name}</h3>
              <p className="mt-1 text-sm text-ink-500">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== ৩. HOW IT WORKS ===== */}
      <section className="border-t border-ink-100 bg-ink-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold text-ink-900 sm:text-3xl">
            কীভাবে কাজ করে
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="rounded-xl border border-ink-100 bg-white p-5 shadow-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700">
                  {i + 1}
                </div>
                <h3 className="mt-4 font-semibold text-ink-900">{step.title}</h3>
                <p className="mt-1 text-sm text-ink-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ৪. FEATURES ===== */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold text-ink-900 sm:text-3xl">
          কেন Mistiri
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-ink-100 bg-white p-6 shadow-sm"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-3 font-semibold text-ink-900">{f.title}</h3>
              <p className="mt-1 text-sm text-ink-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ৫. HIGHLIGHTS ===== */}
      <section className="bg-brand-500">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 px-6 py-14 text-center sm:grid-cols-4">
          {highlights.map((h) => (
            <div key={h.small}>
              <p className="text-4xl font-bold text-white">{h.big}</p>
              <p className="mt-1 text-sm text-brand-100">{h.small}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ৬. FOR WHOM ===== */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold text-ink-900 sm:text-3xl">
          কার জন্য
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {audiences.map((a) => (
            <div
              key={a.label}
              className="rounded-xl border border-ink-100 bg-white p-6 shadow-sm"
            >
              <h3 className="font-semibold text-brand-600">{a.label}</h3>
              <p className="mt-2 text-sm text-ink-500">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ৭. FAQ (interactive accordion) ===== */}
      <section className="border-t border-ink-100 bg-ink-50">
        <div className="mx-auto w-full max-w-3xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold text-ink-900 sm:text-3xl">
            সাধারণ জিজ্ঞাসা
          </h2>
          <div className="mt-8 space-y-3">
            {faqs.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== ৮. FINAL CTA ===== */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
          আজই শুরু করুন Mistiri দিয়ে
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-500">
          অ্যাকাউন্ট খুলে প্রথম সমস্যাটা জমা দিন — কয়েক মিনিটেই সমাধানের পথে।
        </p>
        <Link
          href="/register"
          className="mt-7 inline-block rounded-lg bg-brand-500 px-6 py-3 font-semibold text-white hover:bg-brand-600"
        >
          বিনামূল্যে অ্যাকাউন্ট খুলুন
        </Link>
      </section>
    </PublicShell>
  );
}
