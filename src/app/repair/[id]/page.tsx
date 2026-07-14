"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

// একটা repair details দেখতে কেমন — customer populate হয়ে আসে,
// diagnosis ও estimatedCost optional (থাকতে পারে, নাও পারে)
interface RepairDetails {
  _id: string;
  title: string;
  category: string;
  location: string;
  priority: "low" | "medium" | "high";
  status: string;
  description: string;
  diagnosis?: string;
  estimatedCost?: string;
  customer: { name: string; email: string };
}

// status অনুযায়ী রঙের badge — list page-এর সাথে একই রকম
const statusColor: Record<string, string> = {
  pending: "bg-ink-100 text-ink-700",
  diagnosed: "bg-brand-100 text-brand-700",
  assigned: "bg-brand-100 text-brand-700",
  in_progress: "bg-brand-200 text-brand-800",
  completed: "bg-green-100 text-green-700",
  reviewed: "bg-green-100 text-green-700",
};

export default function RepairDetailsPage() {
  // URL থেকে repair-এর id নাও (/repair/[id])
  const params = useParams();
  const id = params.id as string;

  // TanStack Query দিয়ে GET /repairs/:id call করো
  const { data, isLoading, isError } = useQuery({
    queryKey: ["repair", id],
    queryFn: async () => {
      const res = await api.get(`/repairs/${id}`);
      return res.data.repair as RepairDetails;
    },
    enabled: !!id, // id না থাকলে call কোরো না
  });

  return (
    <div className="min-h-screen bg-ink-50 p-8">
      <div className="mx-auto max-w-3xl">
        {/* উপরে My Repairs list-এ ফেরার link */}
        <Link
          href="/repair/my"
          className="mb-6 inline-block text-sm font-medium text-brand-600 hover:underline"
        >
          ← Back
        </Link>

        {/* loading অবস্থা */}
        {isLoading && <p className="text-ink-500">Loading...</p>}

        {/* error অবস্থা — লাল box-এ friendly message */}
        {isError && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            Could not load this repair request. Please make sure you are logged
            in and that it belongs to you.
          </p>
        )}

        {/* data এলে card-এ পুরো details দেখাও */}
        {data && (
          <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-sm">
            {/* title (বড় heading) + status badge */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-ink-900">{data.title}</h1>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                  statusColor[data.status] || "bg-ink-100 text-ink-700"
                }`}
              >
                {data.status.replace("_", " ")}
              </span>
            </div>

            {/* মূল তথ্যগুলো — category, location, priority, customer */}
            <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase text-ink-500">
                  Category
                </dt>
                <dd className="mt-1 text-ink-900">{data.category}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-ink-500">
                  Location
                </dt>
                <dd className="mt-1 text-ink-900">{data.location}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-ink-500">
                  Priority
                </dt>
                <dd className="mt-1 capitalize text-ink-900">
                  {data.priority}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-ink-500">
                  Customer
                </dt>
                <dd className="mt-1 text-ink-900">{data.customer?.name}</dd>
              </div>
            </dl>

            {/* description — আলাদা অংশে */}
            <div className="mt-5 border-t border-ink-100 pt-5">
              <h2 className="text-xs font-medium uppercase text-ink-500">
                Description
              </h2>
              <p className="mt-1 whitespace-pre-line text-ink-900">
                {data.description}
              </p>
            </div>

            {/* diagnosis ও estimatedCost — থাকলে দেখাও, নাহলে "Not diagnosed yet" */}
            <div className="mt-5 border-t border-ink-100 pt-5">
              <h2 className="text-xs font-medium uppercase text-ink-500">
                Diagnosis
              </h2>
              {data.diagnosis || data.estimatedCost ? (
                <div className="mt-1 space-y-1">
                  {data.diagnosis && (
                    <p className="text-ink-900">{data.diagnosis}</p>
                  )}
                  {data.estimatedCost && (
                    <p className="text-ink-900">
                      <span className="font-medium">Estimated cost:</span>{" "}
                      {data.estimatedCost}
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-1 text-ink-500">Not diagnosed yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
