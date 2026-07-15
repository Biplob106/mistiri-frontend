"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuth";
import {
  DashboardShell,
  LoadingScreen,
  PageTitle,
  StatCard,
} from "@/components/dashboard";

// technician-এর কাছে আসা একটা কাজ (booking)
interface Job {
  _id: string;
  status: string;
  createdAt: string;
  repair: { title: string; category: string; location: string };
  customer: { name: string };
}

// technician নিজের profile
interface TechProfile {
  skills: string[];
  serviceAreas: string[];
  available: boolean;
  verified: boolean;
}

const statusColor: Record<string, string> = {
  requested: "bg-ink-100 text-ink-700",
  accepted: "bg-brand-100 text-brand-700",
  in_progress: "bg-brand-200 text-brand-800",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function TechnicianDashboardPage() {
  const { user, checking } = useAuthGuard("technician");

  // নিজের সব assigned কাজ
  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["assigned-jobs"],
    enabled: !!user,
    queryFn: async () => {
      const res = await api.get("/bookings/assigned");
      return res.data.bookings as Job[];
    },
  });

  // নিজের profile — না বানালে backend 404 দেয়, তাই retry বন্ধ রাখি
  const { data: profile, isError: noProfile } = useQuery({
    queryKey: ["my-tech-profile"],
    enabled: !!user,
    retry: false,
    queryFn: async () => {
      const res = await api.get("/technicians/me");
      return res.data.technician as TechProfile;
    },
  });

  if (checking) return <LoadingScreen />;

  // কাজগুলোকে status অনুযায়ী গুনি
  const list = jobs ?? [];
  const countBy = (s: string) => list.filter((j) => j.status === s).length;
  const activeCount = countBy("accepted") + countBy("in_progress");

  // সাম্প্রতিক কয়েকটা কাজ (নতুন আগে)
  const recent = [...list]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <DashboardShell user={user}>
      <PageTitle>Technician Dashboard</PageTitle>

      {/* profile না থাকলে আগে বানাতে বলি */}
      {noProfile && (
        <div className="mb-6 rounded-xl border border-brand-200 bg-brand-50 p-5">
          <p className="text-sm text-ink-700">
            এখনো profile বানানো হয়নি — skill ও এলাকা যোগ করলে গ্রাহক আপনাকে খুঁজে
            পাবে।
          </p>
          <Link
            href="/technicians/setup"
            className="mt-3 inline-block rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            Complete Profile
          </Link>
        </div>
      )}

      {/* profile থাকলে সংক্ষিপ্ত অবস্থা */}
      {profile && (
        <div className="mb-6 rounded-xl border border-ink-100 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                profile.verified
                  ? "bg-green-100 text-green-700"
                  : "bg-ink-100 text-ink-700"
              }`}
            >
              {profile.verified ? "Verified" : "Not verified"}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                profile.available
                  ? "bg-brand-100 text-brand-700"
                  : "bg-ink-100 text-ink-500"
              }`}
            >
              {profile.available ? "Available" : "Unavailable"}
            </span>
          </div>
          <p className="mt-3 text-sm text-ink-500">
            Skills:{" "}
            <span className="text-ink-700">{profile.skills.join(", ")}</span>
          </p>
          <p className="mt-1 text-sm text-ink-500">
            Areas:{" "}
            <span className="text-ink-700">
              {profile.serviceAreas.join(", ")}
            </span>
          </p>
        </div>
      )}

      {/* কাজের সংখ্যা */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Jobs" value={list.length} />
        <StatCard label="New Requests" value={countBy("requested")} />
        <StatCard label="Active" value={activeCount} />
        <StatCard label="Completed" value={countBy("completed")} />
      </div>

      {/* সাম্প্রতিক কাজ */}
      <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-ink-900">Recent Jobs</h2>
          <Link
            href="/technician/jobs"
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            View all →
          </Link>
        </div>

        {jobsLoading && <p className="text-sm text-ink-500">Loading...</p>}

        {!jobsLoading && recent.length === 0 && (
          <p className="py-6 text-center text-sm text-ink-500">
            No jobs assigned yet.
          </p>
        )}

        <div className="space-y-3">
          {recent.map((job) => (
            <div
              key={job._id}
              className="flex items-center justify-between gap-3 rounded-lg border border-ink-100 p-3"
            >
              <div>
                <p className="font-medium text-ink-900">{job.repair?.title}</p>
                <p className="mt-0.5 text-sm text-ink-500">
                  {job.repair?.category} · {job.repair?.location} ·{" "}
                  {job.customer?.name}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                  statusColor[job.status] || "bg-ink-100 text-ink-700"
                }`}
              >
                {job.status.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
