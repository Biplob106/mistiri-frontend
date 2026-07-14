"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

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

export default function MyRepairsPage() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-repairs"],
    queryFn: async () => {
      const res = await api.get("/repairs/my");
      return res.data.repairs as Repair[];
    },
  });

  return (
    <div className="min-h-screen bg-ink-50 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-ink-900">My Repair Requests</h1>
          <Link
            href="/repair/add"
            className="rounded-lg bg-brand-500 px-4 py-2.5 font-medium text-white transition hover:bg-brand-600"
          >
            + New Request
          </Link>
        </div>

        {isLoading && <p className="text-ink-500">Loading...</p>}

        {isError && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            Could not load your requests. Please make sure you are logged in.
          </p>
        )}

        {data && data.length === 0 && (
          <div className="rounded-xl border border-ink-100 bg-white p-8 text-center">
            <p className="text-ink-500">
              You have no repair requests yet.
            </p>
            <Link
              href="/repair/add"
              className="mt-2 inline-block font-medium text-brand-600 hover:underline"
            >
              Submit your first request
            </Link>
          </div>
        )}

        {data && data.length > 0 && (
          <div className="space-y-3">
            {data.map((repair) => (
              <div
                key={repair._id}
                onClick={() => router.push(`/repair/${repair._id}`)}
                className="cursor-pointer rounded-xl border border-ink-100 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-semibold text-ink-900">
                      {repair.title}
                    </h2>
                    <p className="mt-1 text-sm text-ink-500">
                      {repair.category} · {repair.location}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      statusColor[repair.status] || "bg-ink-100 text-ink-700"
                    }`}
                  >
                    {repair.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}