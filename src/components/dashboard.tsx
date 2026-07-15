"use client";

import { useRouter, usePathname } from "next/navigation";
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
import { AuthUser, Role, logout } from "@/lib/useAuth";

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

// নেভবারের link — role অনুযায়ী আলাদা। এক role-এর link অন্য role দেখে না,
// কারণ শুধু নিজের role-এর set-টাই render হয় (protected link গোপন থাকে)।
const NAV_LINKS: Record<Role, { href: string; label: string }[]> = {
  customer: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/repair/my", label: "My Repairs" },
    { href: "/bookings", label: "My Bookings" },
    { href: "/technicians", label: "Find Technicians" },
  ],
  technician: [
    { href: "/technician/dashboard", label: "Dashboard" },
    { href: "/technician/jobs", label: "My Jobs" },
    { href: "/technicians/setup", label: "Edit Profile" },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/technicians", label: "Technicians" },
    { href: "/bookings", label: "Bookings" },
  ],
};

// সব dashboard-এ একই navbar। লোগো + শুধু চলতি role-এর link + user + logout।
export function NavBar({ user }: { user: AuthUser | null }) {
  const router = useRouter();
  const pathname = usePathname();
  // user না থাকলে কোনো protected link দেখাই না
  const links = user ? NAV_LINKS[user.role] : [];

  return (
    <header className="border-b border-ink-100 bg-white">
      <nav className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-3">
        <div className="flex flex-wrap items-center gap-1">
          <Link
            href="/"
            className="mr-3 text-lg font-bold text-brand-600 hover:text-brand-700"
          >
            Mistiri
          </Link>
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-brand-100 text-brand-700"
                    : "text-ink-700 hover:bg-ink-50"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden text-sm text-ink-500 sm:inline">
              {user.name} · <span className="capitalize">{user.role}</span>
            </span>
          )}
          <button
            onClick={() => logout(router)}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}

// সব dashboard-এ একই footer
export function Footer() {
  return (
    <footer className="mt-auto border-t border-ink-100 bg-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-2 px-6 py-5 text-sm text-ink-500 sm:flex-row">
        <span>
          <span className="font-semibold text-brand-600">Mistiri</span> — স্মার্ট
          হোম-মেইনটেন্যান্স
        </span>
        <Link href="/" className="hover:text-ink-900">
          Home
        </Link>
      </div>
    </footer>
  );
}

// dashboard পেজের সাধারণ খোল — navbar + মাঝের content + footer।
// এতে প্রতিটা পেজে একই navbar/footer বসানো সহজ হয়।
export function DashboardShell({
  user,
  children,
}: {
  user: AuthUser | null;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-ink-50">
      <NavBar user={user} />
      <main className="mx-auto w-full max-w-5xl flex-1 p-6 sm:p-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}

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

// পেজের শিরোনাম — navbar-এর নিচে
export function PageTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="mb-6 text-2xl font-bold text-ink-900">{children}</h1>;
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
