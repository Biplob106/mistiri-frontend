"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuth";
import {
  Analytics,
  AnalyticsCharts,
  DashboardHeader,
  LoadingScreen,
  QuickLinks,
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
    <div className="min-h-screen bg-ink-50 p-8">
      <div className="mx-auto max-w-5xl">
        <DashboardHeader title="Admin Dashboard" user={user} />

        {/* অ্যাডমিনের ব্যবস্থাপনার শর্টকাট */}
        <QuickLinks
          links={[
            { href: "/technicians", label: "All Technicians" },
            { href: "/bookings", label: "Bookings" },
          ]}
        />

        {isLoading && <p className="text-ink-500">Loading analytics...</p>}

        {stats && (
          <>
            {/* platform-জুড়ে সংখ্যা */}
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <StatCard label="Total Users" value={stats.totalUsers ?? 0} />
              <StatCard label="Customers" value={stats.totalCustomers ?? 0} />
              <StatCard
                label="Technicians"
                value={stats.totalTechnicians ?? 0}
              />
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
      </div>
    </div>
  );
}
