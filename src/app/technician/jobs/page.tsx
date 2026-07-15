"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuth";
import {
  DashboardShell,
  LoadingScreen,
  PageTitle,
} from "@/components/dashboard";

// technician-এর কাছে আসা একটা কাজ (booking) দেখতে কেমন
interface Job {
  _id: string;
  status: string;
  createdAt: string;
  repair: {
    _id: string;
    title: string;
    category: string;
    location: string;
    description: string;
  };
  customer: { name: string; phone?: string };
  review?: { rating: number; comment?: string };
}

const statusColor: Record<string, string> = {
  requested: "bg-ink-100 text-ink-700",
  accepted: "bg-brand-100 text-brand-700",
  in_progress: "bg-brand-200 text-brand-800",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

// এখন কোন status, তাই পরের ধাপে কোন button দেখাব
const nextAction: Record<string, { label: string; to: string }> = {
  requested: { label: "Accept", to: "accepted" },
  accepted: { label: "Start job", to: "in_progress" },
  in_progress: { label: "Mark complete", to: "completed" },
};

function JobCard({ job }: { job: Job }) {
  const queryClient = useQueryClient();

  // status এগিয়ে নেওয়ার mutation — সফল হলে list refresh
  const statusMutation = useMutation({
    mutationFn: async (to: string) => {
      const res = await api.patch(`/bookings/${job._id}/status`, {
        status: to,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assigned-jobs"] });
    },
  });

  const action = nextAction[job.status];

  return (
    <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-ink-900">{job.repair?.title}</h2>
          <p className="mt-1 text-sm text-ink-500">
            {job.repair?.category} · {job.repair?.location}
          </p>
          <p className="mt-1 text-sm text-ink-600">
            Customer: {job.customer?.name}
            {job.customer?.phone ? ` · ${job.customer.phone}` : ""}
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

      {job.repair?.description && (
        <p className="mt-3 whitespace-pre-line text-sm text-ink-700">
          {job.repair.description}
        </p>
      )}

      {/* পরের ধাপে নেওয়ার button — শেষ হলে আর button নেই */}
      {action && (
        <button
          onClick={() => statusMutation.mutate(action.to)}
          disabled={statusMutation.isPending}
          className="mt-4 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
        >
          {statusMutation.isPending ? "Updating..." : action.label}
        </button>
      )}

      {/* customer review দিলে সেটা technician-ও দেখে */}
      {job.review && (
        <div className="mt-4 rounded-lg bg-ink-50 p-3">
          <p className="text-sm text-ink-900">
            {"⭐".repeat(job.review.rating)}{" "}
            <span className="text-ink-500">({job.review.rating}/5)</span>
          </p>
          {job.review.comment && (
            <p className="mt-1 text-sm text-ink-700">{job.review.comment}</p>
          )}
        </div>
      )}

      {statusMutation.isError && (
        <p className="mt-2 text-sm text-red-600">Could not update status.</p>
      )}
    </div>
  );
}

export default function TechnicianJobsPage() {
  const { user, checking } = useAuthGuard("technician");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["assigned-jobs"],
    enabled: !!user,
    queryFn: async () => {
      const res = await api.get("/bookings/assigned");
      return res.data.bookings as Job[];
    },
  });

  if (checking) return <LoadingScreen />;

  return (
    <DashboardShell user={user} width="md">
      <PageTitle>My Jobs</PageTitle>

      {isLoading && <p className="text-ink-500">Loading...</p>}

      {isError && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          Could not load your jobs. Please make sure you are logged in as a
          technician.
        </p>
      )}

      {data && data.length === 0 && (
        <div className="rounded-xl border border-ink-100 bg-white p-8 text-center">
          <p className="text-ink-500">No jobs assigned yet.</p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="space-y-3">
          {data.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
