"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { PublicShell } from "@/components/site";
import { useOptionalAuth } from "@/lib/useAuth";

// details page-এ একজন technician-এর পুরো তথ্য
interface TechnicianDetails {
  _id: string;
  skills: string[];
  serviceAreas: string[];
  experience: number;
  bio?: string;
  hourlyRate?: number;
  available: boolean;
  verified: boolean;
  rating: number;
  totalReviews: number;
  user: { name: string; email: string; phone?: string };
}

const skillLabel: Record<string, string> = {
  ac: "AC",
  plumbing: "Plumbing",
  electrical: "Electrical",
  appliance: "Appliance",
};

const avatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "Mistiri"
  )}&background=f97f0c&color=fff&bold=true&size=200`;

// একটা তথ্যের সারি (spec)
function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink-100 bg-white p-4">
      <dt className="text-xs font-medium uppercase text-ink-500">{label}</dt>
      <dd className="mt-1 font-medium text-ink-900">{value}</dd>
    </div>
  );
}

export default function TechnicianDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useOptionalAuth(); // public পেজ — login বাধ্যতামূলক নয়

  const { data: tech, isLoading, isError } = useQuery({
    queryKey: ["technician", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await api.get(`/technicians/${id}`);
      return res.data.technician as TechnicianDetails;
    },
  });

  // related — অন্য কয়েকজন technician (নিজেকে বাদ দিয়ে ৪ জন)
  const { data: related } = useQuery({
    queryKey: ["technicians", "related"],
    queryFn: async () => {
      const res = await api.get("/technicians");
      return res.data.technicians as TechnicianDetails[];
    },
  });

  return (
    <PublicShell>
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <Link
          href="/technicians"
          className="mb-6 inline-block text-sm font-medium text-brand-600 hover:underline"
        >
          ← Back to Explore
        </Link>

        {isLoading && <p className="text-ink-500">Loading...</p>}

        {isError && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            Could not load this technician.
          </p>
        )}

        {tech && (
          <div className="space-y-8">
            {/* header — image + নাম + booking CTA */}
            <div className="flex flex-col items-center gap-5 rounded-xl border border-ink-100 bg-white p-6 shadow-sm sm:flex-row sm:items-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl(tech.user?.name)}
                alt={tech.user?.name}
                className="h-28 w-28 rounded-full"
              />
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <h1 className="text-2xl font-bold text-ink-900">
                    {tech.user?.name}
                  </h1>
                  {tech.verified && (
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="mt-1 text-ink-500">
                  ⭐ {tech.rating.toFixed(1)} ({tech.totalReviews} reviews) ·{" "}
                  {tech.experience} yrs experience
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-1.5 sm:justify-start">
                  {tech.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700"
                    >
                      {skillLabel[s] ?? s}
                    </span>
                  ))}
                </div>
                {/* booking CTA — role অনুযায়ী */}
                <div className="mt-4">
                  {user?.role === "customer" ? (
                    <Link
                      href="/repair/add"
                      className="inline-block rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
                    >
                      Book via a repair request
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="inline-block rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
                    >
                      Login to book
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Overview / bio */}
            <section>
              <h2 className="text-lg font-semibold text-ink-900">Overview</h2>
              <p className="mt-2 whitespace-pre-line text-ink-700">
                {tech.bio || "এই মিস্ত্রি এখনো নিজের সম্পর্কে কিছু লেখেননি।"}
              </p>
            </section>

            {/* Key information / specifications */}
            <section>
              <h2 className="mb-3 text-lg font-semibold text-ink-900">
                Key Information
              </h2>
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Spec label="Experience" value={`${tech.experience} yrs`} />
                <Spec
                  label="Rate"
                  value={tech.hourlyRate ? `৳${tech.hourlyRate}/hr` : "On request"}
                />
                <Spec
                  label="Availability"
                  value={tech.available ? "Available" : "Busy"}
                />
                <Spec
                  label="Areas"
                  value={tech.serviceAreas.join(", ")}
                />
              </dl>
            </section>

            {/* Reviews / ratings */}
            <section>
              <h2 className="mb-3 text-lg font-semibold text-ink-900">
                Reviews & Ratings
              </h2>
              <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-ink-900">
                    {tech.rating.toFixed(1)}
                  </span>
                  <span className="text-ink-500">
                    {"⭐".repeat(Math.round(tech.rating)) || "—"}
                    <br />
                    <span className="text-sm">
                      {tech.totalReviews} review
                      {tech.totalReviews === 1 ? "" : "s"}
                    </span>
                  </span>
                </div>
                {tech.totalReviews === 0 && (
                  <p className="mt-3 text-sm text-ink-500">
                    এখনো কোনো রিভিউ নেই — কাজ শেষে গ্রাহকরা রেটিং দেবেন।
                  </p>
                )}
              </div>
            </section>

            {/* Related technicians */}
            {related && related.filter((t) => t._id !== tech._id).length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-semibold text-ink-900">
                  Related Technicians
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {related
                    .filter((t) => t._id !== tech._id)
                    .slice(0, 4)
                    .map((t) => (
                      <Link
                        key={t._id}
                        href={`/technicians/${t._id}`}
                        className="rounded-xl border border-ink-100 bg-white p-4 text-center shadow-sm transition hover:border-brand-300"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={avatarUrl(t.user?.name)}
                          alt={t.user?.name}
                          className="mx-auto h-14 w-14 rounded-full"
                        />
                        <p className="mt-2 truncate text-sm font-medium text-ink-900">
                          {t.user?.name}
                        </p>
                        <p className="text-xs text-ink-500">
                          ⭐ {t.rating.toFixed(1)}
                        </p>
                      </Link>
                    ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </PublicShell>
  );
}
