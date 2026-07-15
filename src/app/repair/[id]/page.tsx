"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

// match করে আসা technician দেখতে কেমন
interface MatchTech {
  _id: string;
  skills: string[];
  serviceAreas: string[];
  experience: number;
  hourlyRate?: number;
  rating: number;
  totalReviews: number;
  verified: boolean;
  user: { _id: string; name: string; phone?: string };
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

// backend skill lowercase-এ রাখে, তাই দেখানোর সুন্দর label
const skillLabel: Record<string, string> = {
  ac: "AC",
  plumbing: "Plumbing",
  electrical: "Electrical",
  appliance: "Appliance",
};

export default function RepairDetailsPage() {
  // URL থেকে repair-এর id নাও (/repair/[id])
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();

  // TanStack Query দিয়ে GET /repairs/:id call করো
  const { data, isLoading, isError } = useQuery({
    queryKey: ["repair", id],
    queryFn: async () => {
      const res = await api.get(`/repairs/${id}`);
      return res.data.repair as RepairDetails;
    },
    enabled: !!id,
  });

  // এখনো technician নেওয়া হয়নি এমন অবস্থায় (pending/diagnosed) match দেখাই
  const canBook = data?.status === "pending" || data?.status === "diagnosed";

  // এই repair-এর জন্য মানানসই technician খুঁজি (canBook হলে)
  const { data: matches } = useQuery({
    queryKey: ["match", id],
    queryFn: async () => {
      const res = await api.get(`/technicians/match/${id}`);
      return res.data.technicians as MatchTech[];
    },
    enabled: !!id && canBook,
  });

  // Book করলে booking তৈরি হয়, তারপর repair আবার fetch হয় (status বদলাবে)
  const bookMutation = useMutation({
    mutationFn: async (technicianId: string) => {
      const res = await api.post("/bookings", { repairId: id, technicianId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repair", id] });
    },
  });

  return (
    <div className="min-h-screen bg-ink-50 p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/repair/my"
          className="mb-6 inline-block text-sm font-medium text-brand-600 hover:underline"
        >
          ← Back
        </Link>

        {isLoading && <p className="text-ink-500">Loading...</p>}

        {isError && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            Could not load this repair request. Please make sure you are logged
            in and that it belongs to you.
          </p>
        )}

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

            {/* description */}
            <div className="mt-5 border-t border-ink-100 pt-5">
              <h2 className="text-xs font-medium uppercase text-ink-500">
                Description
              </h2>
              <p className="mt-1 whitespace-pre-line text-ink-900">
                {data.description}
              </p>
            </div>

            {/* diagnosis ও estimatedCost */}
            <div className="mt-5 border-t border-ink-100 pt-5">
              <h2 className="text-xs font-medium uppercase text-ink-500">
                Diagnosis
              </h2>
              {data.diagnosis || data.estimatedCost ? (
                <div className="mt-1 space-y-1">
                  {data.diagnosis && (
                    <p className="whitespace-pre-line text-ink-900">
                      {data.diagnosis}
                    </p>
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

            {/* Booking অংশ — এখনো technician নেওয়া হয়নি হলে match দেখাই */}
            <div className="mt-5 border-t border-ink-100 pt-5">
              <h2 className="text-xs font-medium uppercase text-ink-500">
                Book a Technician
              </h2>

              {!canBook ? (
                // ইতিমধ্যে technician নেওয়া হয়ে গেছে
                <p className="mt-2 text-sm text-ink-600">
                  A technician has been booked for this request.{" "}
                  <Link
                    href="/bookings"
                    className="font-medium text-brand-600 hover:underline"
                  >
                    Track in My Bookings →
                  </Link>
                </p>
              ) : matches && matches.length > 0 ? (
                <div className="mt-3 space-y-3">
                  {matches.map((tech) => (
                    <div
                      key={tech._id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-ink-100 p-3"
                    >
                      <div>
                        <p className="font-medium text-ink-900">
                          {tech.user?.name}
                          {tech.verified && (
                            <span className="ml-2 text-xs text-green-600">
                              ✓ Verified
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-ink-500">
                          ⭐ {tech.rating.toFixed(1)} ({tech.totalReviews}) ·{" "}
                          {tech.experience} yrs ·{" "}
                          {tech.skills
                            .map((s) => skillLabel[s] ?? s)
                            .join(", ")}
                          {tech.hourlyRate ? ` · ৳${tech.hourlyRate}/hr` : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => bookMutation.mutate(tech.user._id)}
                        disabled={bookMutation.isPending}
                        className="shrink-0 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
                      >
                        {bookMutation.isPending ? "Booking..." : "Book"}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-ink-500">
                  No matching technicians found for this category/area yet.
                </p>
              )}

              {bookMutation.isError && (
                <p className="mt-2 text-sm text-red-600">
                  Could not book. Please try again.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
