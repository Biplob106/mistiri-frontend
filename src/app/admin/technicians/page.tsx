"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuth";
import {
  DashboardShell,
  LoadingScreen,
  PageTitle,
} from "@/components/dashboard";

interface AdminTech {
  _id: string;
  skills: string[];
  serviceAreas: string[];
  experience: number;
  verified: boolean;
  rating: number;
  user: { name: string; email: string };
}

export default function AdminTechniciansPage() {
  const { user, checking } = useAuthGuard("admin");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-technicians"],
    enabled: !!user,
    queryFn: async () => {
      const res = await api.get("/admin/technicians");
      return res.data.technicians as AdminTech[];
    },
  });

  // verify/unverify toggle
  const toggle = useMutation({
    mutationFn: async ({ id, verified }: { id: string; verified: boolean }) => {
      await api.patch(`/admin/technicians/${id}/verify`, { verified });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-technicians"] }),
  });

  if (checking) return <LoadingScreen />;

  return (
    <DashboardShell user={user} width="xl">
      <PageTitle>Manage Technicians</PageTitle>

      {isLoading && <p className="text-ink-500">Loading...</p>}
      {isError && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          Could not load technicians.
        </p>
      )}

      {data && (
        <div className="overflow-x-auto rounded-xl border border-ink-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink-100 text-ink-500">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Skills</th>
                <th className="px-5 py-3 font-medium">Exp.</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((t) => (
                <tr key={t._id} className="border-b border-ink-50 last:border-0">
                  <td className="px-5 py-3">
                    <p className="font-medium text-ink-900">{t.user?.name}</p>
                    <p className="text-xs text-ink-500">{t.user?.email}</p>
                  </td>
                  <td className="px-5 py-3 capitalize text-ink-700">
                    {t.skills.join(", ")}
                  </td>
                  <td className="px-5 py-3 text-ink-700">{t.experience} yrs</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        t.verified
                          ? "bg-green-100 text-green-700"
                          : "bg-ink-100 text-ink-700"
                      }`}
                    >
                      {t.verified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() =>
                        toggle.mutate({ id: t._id, verified: !t.verified })
                      }
                      disabled={toggle.isPending}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
                        t.verified
                          ? "border border-ink-200 text-ink-700 hover:bg-ink-50"
                          : "bg-brand-500 text-white hover:bg-brand-600"
                      }`}
                    >
                      {t.verified ? "Unverify" : "Verify"}
                    </button>
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
