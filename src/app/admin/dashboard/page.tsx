"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuth";
import {
  Analytics,
  AnalyticsCharts,
  DashboardShell,
  LoadingScreen,
  PageTitle,
  StatCard,
} from "@/components/dashboard";

// অ্যাডমিনের dashboard — শুধু admin role ঢুকতে পারে; পুরো platform-এর সারাংশ
export default function AdminDashboardPage() {
  const { user, checking } = useAuthGuard("admin");

  // পুরো platform-এর analytics
  const { data: stats, isLoading } = useQuery({
    queryKey: ["analytics", "admin"],
    enabled: !!user,
    queryFn: async () => {
      const res = await api.get("/analytics/admin");
      return res.data as Analytics;
    },
  });

  if (checking) return <LoadingScreen />;

  return (
    <DashboardShell user={user}>
      <PageTitle>Admin Dashboard</PageTitle>

      {/* management actions — এখান থেকেই verify/manage-এ যাওয়া যায় */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/admin/technicians"
          className="flex items-center justify-between rounded-xl border border-ink-100 bg-white p-5 shadow-sm transition hover:border-brand-300"
        >
          <div>
            <p className="font-semibold text-ink-900">Manage Technicians</p>
            <p className="mt-1 text-sm text-ink-500">যাচাই (verify) ও তালিকা</p>
          </div>
          <span className="text-brand-600">→</span>
        </Link>
        <Link
          href="/admin/users"
          className="flex items-center justify-between rounded-xl border border-ink-100 bg-white p-5 shadow-sm transition hover:border-brand-300"
        >
          <div>
            <p className="font-semibold text-ink-900">Manage Users</p>
            <p className="mt-1 text-sm text-ink-500">তালিকা ও মুছে ফেলা</p>
          </div>
          <span className="text-brand-600">→</span>
        </Link>
        <Link
          href="/admin/bookings"
          className="flex items-center justify-between rounded-xl border border-ink-100 bg-white p-5 shadow-sm transition hover:border-brand-300"
        >
          <div>
            <p className="font-semibold text-ink-900">All Bookings</p>
            <p className="mt-1 text-sm text-ink-500">পুরো platform-এর booking</p>
          </div>
          <span className="text-brand-600">→</span>
        </Link>
      </div>

      {isLoading && <p className="text-ink-500">Loading analytics...</p>}

      {stats && (
        <>
          {/* platform-জুড়ে সংখ্যা */}
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard label="Total Users" value={stats.totalUsers ?? 0} />
            <StatCard label="Customers" value={stats.totalCustomers ?? 0} />
            <StatCard label="Technicians" value={stats.totalTechnicians ?? 0} />
            <StatCard
              label="Verified Tech."
              value={stats.verifiedTechnicians ?? 0}
            />
            <StatCard label="Repairs" value={stats.totalRepairs} />
            <StatCard label="Bookings" value={stats.totalBookings ?? 0} />
          </div>

          <AnalyticsCharts stats={stats} />
        </>
      )}
    </DashboardShell>
  );
}
