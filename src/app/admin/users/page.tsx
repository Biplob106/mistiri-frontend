"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuth";
import {
  DashboardShell,
  LoadingScreen,
  PageTitle,
} from "@/components/dashboard";

interface AppUser {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "technician" | "admin";
  createdAt: string;
}

// role অনুযায়ী badge রঙ
const roleColor: Record<string, string> = {
  customer: "bg-ink-100 text-ink-700",
  technician: "bg-brand-100 text-brand-700",
  admin: "bg-green-100 text-green-700",
};

export default function AdminUsersPage() {
  const { user, checking } = useAuthGuard("admin");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-users"],
    enabled: !!user,
    queryFn: async () => {
      const res = await api.get("/admin/users");
      return res.data.users as AppUser[];
    },
  });

  // user delete — সফল হলে list refresh
  const del = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/users/${id}`);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  if (checking) return <LoadingScreen />;

  return (
    <DashboardShell user={user} width="xl">
      <PageTitle>Manage Users</PageTitle>

      {isLoading && <p className="text-ink-500">Loading...</p>}
      {isError && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          Could not load users.
        </p>
      )}

      {data && (
        <div className="overflow-x-auto rounded-xl border border-ink-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink-100 text-ink-500">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((u) => (
                <tr key={u._id} className="border-b border-ink-50 last:border-0">
                  <td className="px-5 py-3 font-medium text-ink-900">
                    {u.name}
                  </td>
                  <td className="px-5 py-3 text-ink-700">{u.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        roleColor[u.role] || "bg-ink-100 text-ink-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {/* নিজেকে মোছা যাবে না */}
                    {u._id === user?._id ? (
                      <span className="text-xs text-ink-400">You</span>
                    ) : (
                      <button
                        onClick={() => {
                          if (confirm(`${u.name}-কে মুছে ফেলবেন?`))
                            del.mutate(u._id);
                        }}
                        disabled={del.isPending}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    )}
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
