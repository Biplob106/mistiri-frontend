"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { api } from "@/lib/api";
import { PublicShell } from "@/components/site";
import { SkeletonGrid } from "@/components/dashboard";

// list-এ একেকটা technician দেখতে কেমন — user populate হয়ে আসে
interface Technician {
  _id: string;
  skills: string[];
  serviceAreas: string[];
  experience: number;
  hourlyRate?: number;
  available: boolean;
  verified: boolean;
  rating: number;
  totalReviews: number;
  user: { name: string; email: string; phone?: string };
}

const categories = ["AC", "Plumbing", "Electrical", "Appliance"];
const skillLabel: Record<string, string> = {
  ac: "AC",
  plumbing: "Plumbing",
  electrical: "Electrical",
  appliance: "Appliance",
};

// sorting-এর অপশন
const sortOptions = [
  { value: "rating", label: "Top rated" },
  { value: "experience", label: "Most experienced" },
  { value: "name", label: "Name (A–Z)" },
];

const PAGE_SIZE = 8; // desktop-এ ৪ কলাম × ২ সারি

// initials দিয়ে avatar image (dummy নয় — নামভিত্তিক genarated)
const avatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "Mistiri"
  )}&background=f97f0c&color=fff&bold=true&size=160`;

export default function TechniciansPage() {
  // filter + search + sort + page — সব client state
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("rating");
  const [page, setPage] = useState(1);

  // category/area বদলালে server থেকে আবার fetch (backend এই দুটো filter করে)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["technicians", category, area],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (category) params.category = category;
      if (area) params.area = area;
      const res = await api.get("/technicians", { params });
      return res.data.technicians as Technician[];
    },
  });

  // নাম দিয়ে search + sort — client-side। filter বদলালে page ১-এ ফিরি।
  const list = useMemo(() => {
    let items = data ?? [];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter((t) => t.user?.name?.toLowerCase().includes(q));
    }
    items = [...items].sort((a, b) => {
      if (sort === "experience") return b.experience - a.experience;
      if (sort === "name")
        return (a.user?.name || "").localeCompare(b.user?.name || "");
      return b.rating - a.rating; // default: rating
    });
    return items;
  }, [data, search, sort]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = list.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <PublicShell>
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold text-ink-900">Explore Technicians</h1>
        <p className="mt-2 text-ink-500">
          দক্ষতা ও এলাকা অনুযায়ী যাচাই করা মিস্ত্রি খুঁজুন।
        </p>

        {/* search + filters + sort bar */}
        <div className="mt-6 grid grid-cols-1 gap-3 rounded-xl border border-ink-100 bg-white p-4 shadow-sm md:grid-cols-4">
          {/* search bar */}
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="নাম দিয়ে খুঁজুন..."
            className="w-full rounded-lg border border-ink-200 p-2.5 text-ink-900 placeholder-ink-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          {/* filter 1: category */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-ink-200 p-2.5 text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {/* filter 2: area */}
          <input
            value={area}
            onChange={(e) => {
              setArea(e.target.value);
              setPage(1);
            }}
            placeholder="Area (যেমন: Mirpur)"
            className="w-full rounded-lg border border-ink-200 p-2.5 text-ink-900 placeholder-ink-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          {/* sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full rounded-lg border border-ink-200 p-2.5 text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* loading → skeleton */}
        {isLoading && (
          <div className="mt-8">
            <SkeletonGrid count={8} />
          </div>
        )}

        {isError && (
          <p className="mt-8 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            Could not load technicians. Please try again.
          </p>
        )}

        {data && list.length === 0 && (
          <div className="mt-8 rounded-xl border border-ink-100 bg-white p-10 text-center">
            <p className="text-ink-500">No technicians match your search.</p>
          </div>
        )}

        {/* cards — desktop-এ ৪ কলাম */}
        {pageItems.length > 0 && (
          <>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {pageItems.map((tech) => (
                <div
                  key={tech._id}
                  className="flex h-full flex-col rounded-xl border border-ink-100 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow"
                >
                  {/* image (avatar) */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarUrl(tech.user?.name)}
                    alt={tech.user?.name}
                    className="mx-auto h-20 w-20 rounded-full"
                  />
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <h2 className="font-semibold text-ink-900">
                      {tech.user?.name}
                    </h2>
                    {tech.verified && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        ✓
                      </span>
                    )}
                  </div>

                  {/* meta: rating + experience */}
                  <p className="mt-1 text-center text-sm text-ink-500">
                    ⭐ {tech.rating.toFixed(1)} ({tech.totalReviews}) ·{" "}
                    {tech.experience} yrs
                  </p>

                  {/* short description: skills */}
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {tech.skills.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700"
                      >
                        {skillLabel[s] ?? s}
                      </span>
                    ))}
                  </div>

                  {/* meta: location + price */}
                  <p className="mt-3 text-center text-sm capitalize text-ink-700">
                    {tech.serviceAreas.slice(0, 2).join(", ")}
                  </p>
                  <p className="mt-1 text-center text-sm font-medium text-ink-900">
                    {tech.hourlyRate ? `৳${tech.hourlyRate}/hr` : "Rate on request"}
                  </p>

                  {/* View Details */}
                  <Link
                    href={`/technicians/${tech._id}`}
                    className="mt-4 block rounded-lg bg-brand-500 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-brand-600"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>

            {/* pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={current === 1}
                  className="rounded-lg border border-ink-200 px-3 py-2 text-sm font-medium text-ink-700 disabled:opacity-40"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`h-9 w-9 rounded-lg text-sm font-medium ${
                      current === i + 1
                        ? "bg-brand-500 text-white"
                        : "border border-ink-200 text-ink-700 hover:bg-ink-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={current === totalPages}
                  className="rounded-lg border border-ink-200 px-3 py-2 text-sm font-medium text-ink-700 disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </PublicShell>
  );
}
