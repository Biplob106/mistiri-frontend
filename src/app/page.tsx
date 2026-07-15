import Link from "next/link";

// হোম পেজে যে ধাপগুলো দেখাবো — Mistiri কীভাবে কাজ করে
const steps = [
  {
    title: "সমস্যা লিখুন",
    desc: "AC, electrical বা plumbing — যে সমস্যাই হোক, নিজের ভাষায় লিখুন।",
  },
  {
    title: "কারণ ও খরচ জানুন",
    desc: "সম্ভাব্য কারণ আর আনুমানিক খরচের ধারণা সঙ্গে সঙ্গে পেয়ে যান।",
  },
  {
    title: "মিস্ত্রি বুক করুন",
    desc: "এলাকা ও কাজ অনুযায়ী উপযুক্ত মিস্ত্রি খুঁজে booking দিন।",
  },
  {
    title: "ট্র্যাক ও রিভিউ",
    desc: "কাজের অবস্থা track করুন, শেষে অভিজ্ঞতার রিভিউ দিন।",
  },
];

// তিন ধরনের ব্যবহারকারী — কার জন্য কী
const audiences = [
  {
    label: "গ্রাহক",
    desc: "সমস্যা জমা দিন, diagnosis নিন, মিস্ত্রি বুক করুন ও রিভিউ দিন।",
  },
  {
    label: "মিস্ত্রি",
    desc: "প্রোফাইল ও দক্ষতা যোগ করুন, কাজ accept করে status আপডেট দিন।",
  },
  {
    label: "অ্যাডমিন",
    desc: "ব্যবহারকারী ও মিস্ত্রি যাচাই করুন, analytics দেখুন।",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white text-ink-900">
      {/* ===== উপরের নেভিগেশন — লোগো + লগইন/সাইন আপ লিংক ===== */}
      <header className="border-b border-ink-100">
        <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-brand-600">Mistiri</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
            >
              লগ ইন
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
            >
              সাইন আপ
            </Link>
          </div>
        </nav>
      </header>

      {/* ===== হিরো — মূল পরিচিতি ও দুই CTA বাটন ===== */}
      <section className="mx-auto w-full max-w-5xl px-6 py-20 text-center sm:py-28">
        <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-700">
          স্মার্ট হোম-মেইনটেন্যান্স
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          ঘরের মেরামত এখন সহজ — কারণ, খরচ আর মিস্ত্রি{" "}
          <span className="text-brand-600">এক জায়গায়</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-500">
          সমস্যাটা শুধু লিখুন। Mistiri সম্ভাব্য কারণ ও আনুমানিক খরচ জানাবে, উপযুক্ত
          মিস্ত্রি খুঁজে দেবে, আর পুরো কাজটা track করতে দেবে।
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="w-full rounded-lg bg-brand-500 px-6 py-3 text-center font-semibold text-white hover:bg-brand-600 sm:w-auto"
          >
            শুরু করুন
          </Link>
          <Link
            href="/login"
            className="w-full rounded-lg border border-ink-200 px-6 py-3 text-center font-semibold text-ink-700 hover:bg-ink-50 sm:w-auto"
          >
            লগ ইন
          </Link>
        </div>
      </section>

      {/* ===== কীভাবে কাজ করে — চারটি ধাপ ===== */}
      <section className="border-t border-ink-100 bg-ink-50">
        <div className="mx-auto w-full max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            কীভাবে কাজ করে
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="rounded-xl border border-ink-100 bg-white p-5 shadow-sm"
              >
                {/* ধাপের নম্বর — brand রঙের ব্যাজ */}
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

      {/* ===== কার জন্য — তিন ধরনের ব্যবহারকারী ===== */}
      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">কার জন্য</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
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

      {/* ===== শেষ CTA — সাইন আপে টেনে আনা ===== */}
      <section className="border-t border-ink-100">
        <div className="mx-auto w-full max-w-5xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
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
        </div>
      </section>

      {/* ===== ফুটার ===== */}
      <footer className="mt-auto border-t border-ink-100">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-ink-500 sm:flex-row">
          <span>
            <span className="font-semibold text-brand-600">Mistiri</span> — স্মার্ট
            হোম-মেইনটেন্যান্স
          </span>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-ink-900">
              লগ ইন
            </Link>
            <Link href="/register" className="hover:text-ink-900">
              সাইন আপ
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
