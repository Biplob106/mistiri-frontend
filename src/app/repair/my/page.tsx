"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuth";
import {
  DashboardShell,
  LoadingScreen,
  SkeletonGrid,
} from "@/components/dashboard";

// একটা repair দেখতে কেমন — TypeScript-এর জন্য
interface Repair {
  _id: string;
  title: string;
  category: string;
  location: string;
  priority: "low" | "medium" | "high";
  status: string;
  createdAt: string;
}

// status অনুযায়ী রঙের badge
const statusColor: Record<string, string> = {
  pending: "bg-ink-100 text-ink-700",
  diagnosed: "bg-brand-100 text-brand-700",
  assigned: "bg-brand-100 text-brand-700",
  in_progress: "bg-brand-200 text-brand-800",
  completed: "bg-green-100 text-green-700",
  reviewed: "bg-green-100 text-green-700",
};

// একটা request card — View আর Delete action সহ
function RepairCard({ repair }: { repair: Repair }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // delete — সফল হলে list আবার fetch
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/repairs/${repair._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-repairs"] });
    },
  });

  return (
    <div className="flex h-full flex-col rounded-xl border border-ink-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold text-ink-900">{repair.title}</h2>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            statusColor[repair.status] || "bg-ink-100 text-ink-700"
          }`}
        >
          {repair.status.replace("_", " ")}
        </span>
      </div>
      <p className="mt-1 text-sm text-ink-500">
        {repair.category} · {repair.location} ·{" "}
        <span className="capitalize">{repair.priority}</span>
      </p>

      {/* action button — View আর Delete */}
      <div className="mt-4 flex gap-2 pt-2">
        <button
          onClick={() => router.push(`/repair/${repair._id}`)}
          className="flex-1 rounded-lg border border-ink-200 px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
        >
          View Details
        </button>
        <button
          onClick={() => {
            if (confirm("এই request মুছে ফেলবেন?")) deleteMutation.mutate();
          }}
          disabled={deleteMutation.isPending}
          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        >
          {deleteMutation.isPending ? "..." : "Delete"}
        </button>
      </div>
    </div>
  );
}

export default function MyRepairsPage() {
  const { user, checking } = useAuthGuard("customer");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-repairs"],
    enabled: !!user,
    queryFn: async () => {
      const res = await api.get("/repairs/my");
      return res.data.repairs as Repair[];
    },
  });

  if (checking) return <LoadingScreen />;

  return (
    <DashboardShell user={user} width="xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink-900">Manage Repair Requests</h1>
        <Link
          href="/repair/add"
          className="rounded-lg bg-brand-500 px-4 py-2.5 font-medium text-white transition hover:bg-brand-600"
        >
          + New Request
        </Link>
      </div>

      {/* loading অবস্থায় skeleton grid */}
      {isLoading && <SkeletonGrid count={8} />}

      {isError && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          Could not load your requests. Please make sure you are logged in.
        </p>
      )}

      {data && data.length === 0 && (
        <div className="rounded-xl border border-ink-100 bg-white p-8 text-center">
          <p className="text-ink-500">You have no repair requests yet.</p>
          <Link
            href="/repair/add"
            className="mt-2 inline-block font-medium text-brand-600 hover:underline"
          >
            Submit your first request
          </Link>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((repair) => (
            <RepairCard key={repair._id} repair={repair} />
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
