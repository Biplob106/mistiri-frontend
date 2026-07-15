"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { dashboardPathFor, logout, useOptionalAuth } from "@/lib/useAuth";

// সব public পেজে একই নেভিগেশন লিংক (logged-out অবস্থায় ≥৩ route)
const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/technicians", label: "Explore" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// পুরো সাইটের উপরের নেভবার — sticky, full-width, auth-aware।
// login করা থাকলে Dashboard + Logout, নাহলে Login + Sign up দেখায়।
export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useOptionalAuth();
  const [open, setOpen] = useState(false); // mobile menu

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="text-brand-600">Mistiri</span>
        </Link>

        {/* desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {PUBLIC_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname === l.href
                  ? "text-brand-600"
                  : "text-ink-700 hover:bg-ink-50"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* desktop auth buttons */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link
                href={dashboardPathFor(user.role)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
              >
                Dashboard
              </Link>
              <button
                onClick={() => logout(router)}
                className="rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-ink-700 hover:bg-ink-50 md:hidden"
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </nav>

      {/* mobile dropdown */}
      {open && (
        <div className="border-t border-ink-100 bg-white px-6 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {PUBLIC_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 border-t border-ink-100 pt-3">
              {user ? (
                <>
                  <Link
                    href={dashboardPathFor(user.role)}
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-lg border border-ink-200 px-4 py-2 text-center text-sm font-medium text-ink-700"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => logout(router)}
                    className="flex-1 rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-lg border border-ink-200 px-4 py-2 text-center text-sm font-medium text-ink-700"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-lg bg-brand-500 px-4 py-2 text-center text-sm font-semibold text-white"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// ছোট সোশ্যাল আইকন লিংক
function Social({ href, label, d }: { href: string; label: string; d: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-ink-700 transition hover:bg-brand-500 hover:text-white"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d={d} />
      </svg>
    </a>
  );
}

// পুরো সাইটের ফুটার — কাজ করা লিংক, যোগাযোগ ও সোশ্যাল
export function SiteFooter() {
  return (
    <footer className="border-t border-ink-100 bg-ink-50">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* brand */}
        <div>
          <p className="text-lg font-bold text-brand-600">Mistiri</p>
          <p className="mt-2 text-sm text-ink-500">
            স্মার্ট হোম-মেইনটেন্যান্স — সমস্যা লিখুন, কারণ ও খরচ জানুন, উপযুক্ত
            মিস্ত্রি বুক করুন।
          </p>
        </div>

        {/* quick links — সব কাজ করা internal route */}
        <div>
          <p className="text-sm font-semibold text-ink-900">Quick Links</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li>
              <Link href="/" className="hover:text-brand-600">
                Home
              </Link>
            </li>
            <li>
              <Link href="/technicians" className="hover:text-brand-600">
                Explore Technicians
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-brand-600">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-brand-600">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* services */}
        <div>
          <p className="text-sm font-semibold text-ink-900">Services</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li>AC Repair</li>
            <li>Plumbing</li>
            <li>Electrical</li>
            <li>Appliance Repair</li>
          </ul>
        </div>

        {/* contact + social */}
        <div>
          <p className="text-sm font-semibold text-ink-900">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li>
              <a
                href="mailto:support@mistiri.app"
                className="hover:text-brand-600"
              >
                support@mistiri.app
              </a>
            </li>
            <li>
              <a href="tel:+8801700000000" className="hover:text-brand-600">
                +880 1700-000000
              </a>
            </li>
            <li>Mirpur, Dhaka, Bangladesh</li>
          </ul>
          <div className="mt-4 flex gap-2">
            <Social
              href="https://facebook.com"
              label="Facebook"
              d="M13 22v-8h3l.5-3H13V9c0-.9.3-1.5 1.6-1.5H17V4.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.2V11H8v3h2.6v8H13z"
            />
            <Social
              href="https://twitter.com"
              label="Twitter"
              d="M22 5.9c-.7.3-1.5.5-2.3.6.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4 4 0 0 0-6.8 3.7A11.3 11.3 0 0 1 3.9 4.6a4 4 0 0 0 1.2 5.3c-.6 0-1.2-.2-1.8-.5v.1c0 1.9 1.4 3.5 3.2 3.9-.6.2-1.3.2-1.9.1a4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 18.6a11.3 11.3 0 0 0 6.1 1.8c7.3 0 11.4-6.1 11.4-11.4v-.5c.8-.6 1.5-1.3 2-2.2z"
            />
            <Social
              href="https://linkedin.com"
              label="LinkedIn"
              d="M6.9 8.5H3.8V21h3.1V8.5zM5.3 3.5a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM21 21v-6.9c0-3.3-1.8-4.8-4.1-4.8-1.9 0-2.7 1-3.2 1.8V8.5H10.6c.1.9 0 12.5 0 12.5h3.1v-7c0-.3 0-.6.1-.8.3-.6.8-1.2 1.7-1.2 1.2 0 1.7.9 1.7 2.3V21H21z"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-ink-100 py-4 text-center text-sm text-ink-500">
        © {"2026"} Mistiri. All rights reserved.
      </div>
    </footer>
  );
}

// public পেজের খোল — sticky header + content + footer
export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
