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

// গ্রাহকের dashboard — শুধু customer role ঢুকতে পারে (অন্যরা নিজের dashboard-এ যায়)
export default function CustomerDashboardPage() {
  const { user, checking } = useAuthGuard("customer");

  // নিজের data-র সারাংশ
  const { data: stats, isLoading } = useQuery({
    queryKey: ["analytics", "me"],
    enabled: !!user,
    queryFn: async () => {
      const res = await api.get("/analytics/me");
      return res.data as Analytics;
    },
  });

  if (checking) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-ink-50 p-8">
      <div className="mx-auto max-w-5xl">
        <DashboardHeader title="Customer Dashboard" user={user} />

        {/* গ্রাহকের দরকারি কাজের শর্টকাট */}
        <QuickLinks
          links={[
            { href: "/repair/my", label: "My Repairs" },
            { href: "/bookings", label: "My Bookings" },
            { href: "/technicians", label: "Find Technicians" },
          ]}
        />

        {isLoading && <p className="text-ink-500">Loading analytics...</p>}

        {stats && (
          <>
            {/* সংখ্যার কার্ড */}
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Total Repairs" value={stats.totalRepairs} />
              <StatCard label="Bookings" value={stats.totalBookings ?? 0} />
              <StatCard
                label="Completed Jobs"
                value={stats.completedJobs ?? 0}
              />
              <StatCard
                label="Est. Cost (৳)"
                value={stats.totalEstimatedCost.toLocaleString()}
              />
            </div>

            <AnalyticsCharts stats={stats} />
          </>
        )}
      </div>
    </div>
  );
}
