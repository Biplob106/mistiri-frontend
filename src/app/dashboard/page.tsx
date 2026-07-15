"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { api } from "@/lib/api";

// backend analytics endpoint যা যা ফেরত দেয়
interface Analytics {
  totalRepairs: number;
  statusCounts: Record<string, number>;
  categoryDistribution: { category: string; count: number }[];
  monthlyCost: { month: string; cost: number }[];
  totalEstimatedCost: number;
  // customer-এর জন্য
  totalBookings?: number;
  completedJobs?: number;
  // admin-এর জন্য
  totalUsers?: number;
  totalCustomers?: number;
  totalTechnicians?: number;
  verifiedTechnicians?: number;
}

interface User {
  name: string;
  email: string;
  role: "customer" | "technician" | "admin";
}

// pie chart-এর slice রং — brand amber + কয়েকটা সহায়ক রং
const CHART_COLORS = [
  "#f97f0c",
  "#ff9d38",
  "#ea6a02",
  "#ffc071",
  "#c25309",
  "#ffdba8",
];

// ছোট stat card — উপরে সংখ্যা, নিচে label
function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-sm">
      <p className="text-2xl font-bold text-ink-900">{value}</p>
      <p className="mt-1 text-sm text-ink-500">{label}</p>
    </div>
  );
}

// চার্টের চারপাশের box — শিরোনাম সহ
function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-semibold text-ink-900">{title}</h2>
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  // প্রথমে token যাচাই করি — কে logged in, কোন role
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
        setChecking(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      });
  }, [router]);

  // role বুঝে সঠিক analytics endpoint বাছি (admin আলাদা, customer আলাদা)
  const isAdmin = user?.role === "admin";
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["analytics", user?.role],
    // শুধু customer/admin হলেই analytics আনি (technician-এর আলাদা page আছে)
    enabled: !!user && (user.role === "customer" || user.role === "admin"),
    queryFn: async () => {
      const url = isAdmin ? "/analytics/admin" : "/analytics/me";
      const res = await api.get(url);
      return res.data as Analytics;
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50">
        <p className="text-ink-500">Loading...</p>
      </div>
    );
  }

  // status object → chart-এর জন্য array (নাম একটু পরিষ্কার করে)
  const statusData = stats
    ? Object.entries(stats.statusCounts).map(([status, count]) => ({
        status: status.replace("_", " "),
        count,
      }))
    : [];

  return (
    <div className="min-h-screen bg-ink-50 p-8">
      <div className="mx-auto max-w-5xl">
        {/* উপরের বার — শিরোনাম, ভূমিকা, logout */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink-900">
              {isAdmin ? "Admin Dashboard" : "Dashboard"}
            </h1>
            {user && (
              <p className="mt-1 text-sm text-ink-500">
                {user.name} · <span className="capitalize">{user.role}</span>
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* technician-এর জন্য এখানে chart নেই — নিজের কাজের page-এ পাঠাই */}
        {user?.role === "technician" && (
          <div className="rounded-xl border border-ink-100 bg-white p-8 text-center shadow-sm">
            <p className="text-ink-500">
              Technician analytics এখানে নেই। নিজের কাজ দেখতে যান —
            </p>
            <Link
              href="/technician/jobs"
              className="mt-2 inline-block font-medium text-brand-600 hover:underline"
            >
              My Jobs →
            </Link>
          </div>
        )}

        {statsLoading && (
          <p className="text-ink-500">Loading analytics...</p>
        )}

        {stats && (
          <>
            {/* সংখ্যার কার্ডগুলো — role অনুযায়ী আলাদা */}
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {isAdmin ? (
                <>
                  <StatCard label="Total Users" value={stats.totalUsers ?? 0} />
                  <StatCard
                    label="Technicians"
                    value={stats.totalTechnicians ?? 0}
                  />
                  <StatCard label="Total Repairs" value={stats.totalRepairs} />
                  <StatCard
                    label="Total Bookings"
                    value={stats.totalBookings ?? 0}
                  />
                </>
              ) : (
                <>
                  <StatCard label="Total Repairs" value={stats.totalRepairs} />
                  <StatCard
                    label="Bookings"
                    value={stats.totalBookings ?? 0}
                  />
                  <StatCard
                    label="Completed Jobs"
                    value={stats.completedJobs ?? 0}
                  />
                  <StatCard
                    label="Est. Cost (৳)"
                    value={stats.totalEstimatedCost.toLocaleString()}
                  />
                </>
              )}
            </div>

            {/* চার্টগুলো */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* category অনুযায়ী ভাগ — pie chart */}
              <ChartCard title="Category Distribution">
                {stats.categoryDistribution.length === 0 ? (
                  <p className="py-12 text-center text-sm text-ink-500">
                    No data yet
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={stats.categoryDistribution}
                        dataKey="count"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label={({
                          name,
                          value,
                        }: {
                          name?: string;
                          value?: number;
                        }) => `${name} (${value})`}
                      >
                        {stats.categoryDistribution.map((_, i) => (
                          <Cell
                            key={i}
                            fill={CHART_COLORS[i % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>

              {/* status অনুযায়ী কয়টা — bar chart */}
              <ChartCard title="Repairs by Status">
                {statusData.length === 0 ? (
                  <p className="py-12 text-center text-sm text-ink-500">
                    No data yet
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="status"
                        tick={{ fontSize: 12, fill: "#64748b" }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                      />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        fill="#f97f0c"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>

              {/* মাস অনুযায়ী আনুমানিক খরচ — পুরো প্রস্থ জুড়ে bar chart */}
              <div className="lg:col-span-2">
                <ChartCard title="Monthly Estimated Cost (৳)">
                  {stats.monthlyCost.length === 0 ? (
                    <p className="py-12 text-center text-sm text-ink-500">
                      No data yet
                    </p>
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={stats.monthlyCost}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1f5f9"
                        />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 12, fill: "#64748b" }}
                        />
                        <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="cost"
                          name="Estimated Cost"
                          fill="#ea6a02"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
