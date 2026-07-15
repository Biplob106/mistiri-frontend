import Link from "next/link";
import { PublicShell } from "@/components/site";

export const metadata = {
  title: "About — Mistiri",
  description: "Mistiri কী, কীভাবে কাজ করে এবং কারা ব্যবহার করে।",
};

const values = [
  { title: "স্বচ্ছতা", desc: "কাজের আগে আনুমানিক খরচ — কোনো লুকানো চার্জ নয়।" },
  { title: "আস্থা", desc: "যাচাই করা মিস্ত্রি, রেটিং ও রিভিউ ভিত্তিক পছন্দ।" },
  { title: "সরলতা", desc: "সমস্যা লিখুন — বাকিটা Mistiri সহজ করে দেয়।" },
];

export default function AboutPage() {
  return (
    <PublicShell>
      <div className="mx-auto w-full max-w-3xl px-6 py-14">
        <h1 className="text-3xl font-bold text-ink-900">About Mistiri</h1>
        <p className="mt-4 text-lg text-ink-500">
          Mistiri একটি স্মার্ট হোম-মেইনটেন্যান্স প্ল্যাটফর্ম। ঘরের AC, electrical
          বা plumbing সমস্যা লিখলেই এটি সম্ভাব্য কারণ ও আনুমানিক খরচ জানায়,
          এলাকা অনুযায়ী উপযুক্ত মিস্ত্রি খুঁজে দেয় এবং পুরো কাজটা track করতে দেয়।
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ink-900">আমাদের লক্ষ্য</h2>
          <p className="mt-3 text-ink-700">
            ঘরের ছোট-বড় মেরামত নিয়ে দুশ্চিন্তা কমানো — যাতে যে কেউ সহজে,
            স্বচ্ছভাবে ও ন্যায্য খরচে বিশ্বস্ত মিস্ত্রির সেবা পান।
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ink-900">আমরা যা মানি</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-ink-100 bg-white p-5 shadow-sm"
              >
                <h3 className="font-semibold text-brand-600">{v.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ink-900">কারা ব্যবহার করে</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-ink-700">
            <li>
              <span className="font-medium">গ্রাহক</span> — সমস্যা জমা দেন,
              diagnosis নেন, মিস্ত্রি বুক করেন ও রিভিউ দেন।
            </li>
            <li>
              <span className="font-medium">মিস্ত্রি</span> — প্রোফাইল ও দক্ষতা
              যোগ করেন, কাজ accept করেন ও status আপডেট দেন।
            </li>
            <li>
              <span className="font-medium">অ্যাডমিন</span> — ব্যবহারকারী ও
              মিস্ত্রি যাচাই করেন এবং analytics দেখেন।
            </li>
          </ul>
        </section>

        <div className="mt-12 rounded-xl border border-ink-100 bg-ink-50 p-6 text-center">
          <p className="font-medium text-ink-900">শুরু করতে প্রস্তুত?</p>
          <Link
            href="/register"
            className="mt-3 inline-block rounded-lg bg-brand-500 px-6 py-2.5 font-semibold text-white hover:bg-brand-600"
          >
            অ্যাকাউন্ট খুলুন
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
