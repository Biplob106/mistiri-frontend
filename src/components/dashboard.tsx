"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { AuthUser, logout } from "@/lib/useAuth";

// customer আর admin — দুই analytics endpoint যে যে ফিল্ড ফেরত দেয়
export interface Analytics {
  totalRepairs: number;
  statusCounts: Record<string, number>;
  categoryDistribution: { category: string; count: number }[];
  monthlyCost: { month: string; cost: number }[];
  totalEstimatedCost: number;
  // customer
  totalBookings?: number;
  completedJobs?: number;
  // admin
  totalUsers?: number;
  totalCustomers?: number;
  totalTechnicians?: number;
  verifiedTechnicians?: number;
}

// চার্টের slice রং — brand amber + কয়েকটা শেড
export const CHART_COLORS = [
  "#f97f0c",
  "#ff9d38",
  "#ea6a02",
  "#ffc071",
  "#c25309",
  "#ffdba8",
];

// ছোট stat card — উপরে সংখ্যা, নিচে label
export function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-sm">
      <p className="text-2xl font-bold text-ink-900">{value}</p>
      <p className="mt-1 text-sm text-ink-500">{label}</p>
    </div>
  );
}

// চার্টের চারপাশের box — শিরোনাম সহ
export function ChartCard({
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

// পুরো screen জুড়ে loading — guard যাচাইয়ের সময় দেখায়
export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50">
      <p className="text-ink-500">Loading...</p>
    </div>
  );
}

// প্রতিটা dashboard-এর উপরের বার — লোগো, শিরোনাম, user, logout
export function DashboardHeader({
  title,
  user,
}: {
  title: string;
  user: AuthUser | null;
}) {
  const router = useRouter();
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <Link
          href="/"
          className="text-sm font-bold text-brand-600 hover:text-brand-700"
        >
          Mistiri
        </Link>
        <h1 className="text-2xl font-bold text-ink-900">{title}</h1>
        {user && (
          <p className="mt-1 text-sm text-ink-500">
            {user.name} · <span className="capitalize">{user.role}</span>
          </p>
        )}
      </div>
      <button
        onClick={() => logout(router)}
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}

// দ্রুত যাওয়ার লিংকগুলো — role অনুযায়ী আলাদা set পাঠানো হয়
export function QuickLinks({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="rounded-lg border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 shadow-sm transition hover:bg-ink-50"
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}

// customer ও admin dashboard-এ একই তিনটা চার্ট লাগে — তাই এক জায়গায়
export function AnalyticsCharts({ stats }: { stats: Analytics }) {
  // status object → chart-এর array (নাম একটু পরিষ্কার করে)
  const statusData = Object.entries(stats.statusCounts).map(
    ([status, count]) => ({ status: status.replace("_", " "), count })
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* category অনুযায়ী ভাগ — pie chart */}
      <ChartCard title="Category Distribution">
        {stats.categoryDistribution.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink-500">No data yet</p>
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
                label={({ name, value }: { name?: string; value?: number }) =>
                  `${name} (${value})`
                }
              >
                {stats.categoryDistribution.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
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
          <p className="py-12 text-center text-sm text-ink-500">No data yet</p>
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
              <Bar dataKey="count" fill="#f97f0c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* মাস অনুযায়ী আনুমানিক খরচ — পুরো প্রস্থ জুড়ে */}
      <div className="lg:col-span-2">
        <ChartCard title="Monthly Estimated Cost (৳)">
          {stats.monthlyCost.length === 0 ? (
            <p className="py-12 text-center text-sm text-ink-500">
              No data yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.monthlyCost}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
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
  );
}
