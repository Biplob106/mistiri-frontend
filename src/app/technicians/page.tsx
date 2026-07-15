"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuth";
import {
  DashboardShell,
  LoadingScreen,
  PageTitle,
} from "@/components/dashboard";

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

// diagnosis/repair-এর সাথে মিল রেখে একই category গুলো
const categories = ["AC", "Plumbing", "Electrical", "Appliance"];

// backend-এ skill lowercase-এ রাখা ("ac"), কিন্তু দেখানোর সময় সুন্দর label চাই।
// অজানা skill হলে capitalize class ঠিকঠাক দেখাবে, তাই map-এ না থাকলেও সমস্যা নেই।
const skillLabel: Record<string, string> = {
  ac: "AC",
  plumbing: "Plumbing",
  electrical: "Electrical",
  appliance: "Appliance",
};

export default function TechniciansPage() {
  // যেকোনো logged-in user technician list দেখতে পারে (role লাগে না)
  const { user, checking } = useAuthGuard();

  // filter state — যা বাছাই হবে সেটা query-তে পাঠাব
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");

  // filter বদলালে queryKey বদলায়, তাই TanStack নিজে থেকে আবার fetch করে
  const { data, isLoading, isError } = useQuery({
    queryKey: ["technicians", category, area],
    enabled: !!user,
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (category) params.category = category;
      if (area) params.area = area;
      const res = await api.get("/technicians", { params });
      return res.data.technicians as Technician[];
    },
  });

  if (checking) return <LoadingScreen />;

  return (
    <DashboardShell user={user} width="lg">
      <PageTitle>Find a Technician</PageTitle>

      <div className="space-y-6">
        {/* filter bar — category dropdown + area লেখার box */}
        <div className="flex flex-col gap-3 rounded-xl border border-ink-100 bg-white p-4 shadow-sm sm:flex-row">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-ink-200 p-2.5 text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:w-48"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Area (যেমন: Mirpur)"
            className="w-full rounded-lg border border-ink-200 p-2.5 text-ink-900 placeholder-ink-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {isLoading && <p className="text-ink-500">Loading...</p>}

        {isError && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            Could not load technicians. Please make sure you are logged in.
          </p>
        )}

        {data && data.length === 0 && (
          <div className="rounded-xl border border-ink-100 bg-white p-8 text-center">
            <p className="text-ink-500">
              No technicians found for this filter.
            </p>
          </div>
        )}

        {data && data.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {data.map((tech) => (
              <div
                key={tech._id}
                className="rounded-xl border border-ink-100 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow"
              >
                {/* নাম + verified badge */}
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-ink-900">
                    {tech.user?.name}
                  </h2>
                  {tech.verified && (
                    <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      ✓ Verified
                    </span>
                  )}
                </div>

                {/* rating + অভিজ্ঞতা */}
                <p className="mt-1 text-sm text-ink-500">
                  ⭐ {tech.rating.toFixed(1)} ({tech.totalReviews}) ·{" "}
                  {tech.experience} yrs exp
                </p>

                {/* skill গুলো ছোট chip হিসেবে */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tech.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium capitalize text-brand-700"
                    >
                      {skillLabel[s] ?? s}
                    </span>
                  ))}
                </div>

                {/* এলাকা */}
                <p className="mt-3 text-sm text-ink-700">
                  <span className="text-ink-500">Areas:</span>{" "}
                  <span className="capitalize">
                    {tech.serviceAreas.join(", ")}
                  </span>
                </p>

                {/* রেট ও availability */}
                <div className="mt-3 flex items-center justify-between text-sm">
                  {tech.hourlyRate ? (
                    <span className="font-medium text-ink-900">
                      ৳{tech.hourlyRate}/hr
                    </span>
                  ) : (
                    <span className="text-ink-500">Rate on request</span>
                  )}
                  <span
                    className={
                      tech.available ? "text-green-600" : "text-ink-400"
                    }
                  >
                    {tech.available ? "Available" : "Busy"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
