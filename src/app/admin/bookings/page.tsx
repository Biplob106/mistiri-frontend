"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuth";
import {
  DashboardShell,
  LoadingScreen,
  PageTitle,
} from "@/components/dashboard";

interface AdminBooking {
  _id: string;
  status: string;
  createdAt: string;
  repair?: { title: string; category: string; location: string };
  customer?: { name: string; email: string };
  technician?: { name: string; email: string };
  review?: { rating: number };
}

const statusColor: Record<string, string> = {
  requested: "bg-ink-100 text-ink-700",
  accepted: "bg-brand-100 text-brand-700",
  in_progress: "bg-brand-200 text-brand-800",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminBookingsPage() {
  const { user, checking } = useAuthGuard("admin");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-bookings"],
    enabled: !!user,
    queryFn: async () => {
      const res = await api.get("/admin/bookings");
      return res.data.bookings as AdminBooking[];
    },
  });

  if (checking) return <LoadingScreen />;

  return (
    <DashboardShell user={user} width="xl">
      <PageTitle>All Bookings</PageTitle>

      {isLoading && <p className="text-ink-500">Loading...</p>}
      {isError && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          Could not load bookings.
        </p>
      )}

      {data && data.length === 0 && (
        <div className="rounded-xl border border-ink-100 bg-white p-8 text-center">
          <p className="text-ink-500">No bookings yet.</p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-ink-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink-100 text-ink-500">
              <tr>
                <th className="px-5 py-3 font-medium">Repair</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Technician</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Rating</th>
              </tr>
            </thead>
            <tbody>
              {data.map((b) => (
                <tr key={b._id} className="border-b border-ink-50 last:border-0">
                  <td className="px-5 py-3">
                    <p className="font-medium text-ink-900">
                      {b.repair?.title ?? "—"}
                    </p>
                    <p className="text-xs text-ink-500">
                      {b.repair?.category} · {b.repair?.location}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-ink-700">
                    {b.customer?.name ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-ink-700">
                    {b.technician?.name ?? "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        statusColor[b.status] || "bg-ink-100 text-ink-700"
                      }`}
                    >
                      {b.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-ink-700">
                    {b.review ? `⭐ ${b.review.rating}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}
