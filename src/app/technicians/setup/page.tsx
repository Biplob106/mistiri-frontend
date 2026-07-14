"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

// repair/diagnosis-এর সাথে মিল রেখে একই category গুলো — এগুলোই skill
const categories = ["AC", "Plumbing", "Electrical", "Appliance"];

export default function TechnicianSetupPage() {
  const router = useRouter();

  // form-এর সব field আলাদা state-এ রাখি
  const [skills, setSkills] = useState<string[]>([]);
  const [serviceAreas, setServiceAreas] = useState(""); // comma দিয়ে লেখা এলাকা
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [available, setAvailable] = useState(true);
  const [message, setMessage] = useState("");

  // আগের profile থাকলে টেনে এনে form-এ বসাই (edit করার জন্য)।
  // profile না থাকলে backend 404 দেয় — সেটা স্বাভাবিক, তাই retry বন্ধ।
  const { data: existing } = useQuery({
    queryKey: ["my-technician-profile"],
    queryFn: async () => {
      const res = await api.get("/technicians/me");
      return res.data.technician;
    },
    retry: false,
  });

  // profile এলে form field গুলো prefill করি
  useEffect(() => {
    if (!existing) return;
    // backend skill lowercase-এ রাখে ("ac"), কিন্তু button গুলো "AC" ব্যবহার করে।
    // তাই stored skill-কে ফিরিয়ে canonical label-এ মেলাই, নাহলে selected দেখাবে না।
    setSkills(
      (existing.skills ?? []).map(
        (s: string) =>
          categories.find((c) => c.toLowerCase() === s.toLowerCase()) ?? s
      )
    );
    setServiceAreas((existing.serviceAreas ?? []).join(", "));
    setExperience(String(existing.experience ?? ""));
    setBio(existing.bio ?? "");
    setHourlyRate(existing.hourlyRate ? String(existing.hourlyRate) : "");
    setAvailable(existing.available ?? true);
  }, [existing]);

  // checkbox toggle — skill list-এ যোগ/বাদ দেই
  const toggleSkill = (c: string) => {
    setSkills((prev) =>
      prev.includes(c) ? prev.filter((s) => s !== c) : [...prev, c]
    );
  };

  // save — POST /technicians (backend upsert করে)
  const mutation = useMutation({
    mutationFn: async () => {
      // "Mirpur, Dhanmondi" → ["Mirpur","Dhanmondi"], খালি অংশ বাদ
      const areas = serviceAreas
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);

      const res = await api.post("/technicians", {
        skills,
        serviceAreas: areas,
        experience: Number(experience) || 0,
        bio,
        hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
        available,
      });
      return res.data;
    },
    onSuccess: () => {
      setMessage("Profile saved ✓");
      // একটু পরে technician list-এ নিয়ে যাই
      setTimeout(() => router.push("/technicians"), 800);
    },
    onError: (err: any) => {
      setMessage(err?.response?.data?.message || "Could not save profile");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    // অন্তত একটা skill আর একটা এলাকা লাগবে
    if (skills.length === 0 || serviceAreas.trim() === "") {
      setMessage("Please pick at least one skill and one area");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="min-h-screen bg-ink-50 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-ink-900">My Technician Profile</h1>
          <Link
            href="/technicians"
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            View list →
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border border-ink-100 bg-white p-6 shadow-sm"
        >
          {/* skills — category গুলো checkbox হিসেবে */}
          <div>
            <label className="mb-2 block text-sm font-medium text-ink-700">
              Skills (কোন কাজ পারো)
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => toggleSkill(c)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    skills.includes(c)
                      ? "border-brand-500 bg-brand-100 text-brand-700"
                      : "border-ink-200 text-ink-600 hover:bg-ink-50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* এলাকা — comma দিয়ে আলাদা */}
          <div>
            <label className="mb-2 block text-sm font-medium text-ink-700">
              Service Areas (comma দিয়ে আলাদা করো)
            </label>
            <Input
              value={serviceAreas}
              onChange={(e) => setServiceAreas(e.target.value)}
              placeholder="Mirpur, Dhanmondi, Uttara"
            />
          </div>

          {/* অভিজ্ঞতা + রেট পাশাপাশি */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-ink-700">
                Experience (years)
              </label>
              <Input
                type="number"
                min="0"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-ink-700">
                Hourly Rate (৳, optional)
              </label>
              <Input
                type="number"
                min="0"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="500"
              />
            </div>
          </div>

          {/* নিজের সম্পর্কে ছোট বর্ণনা */}
          <div>
            <label className="mb-2 block text-sm font-medium text-ink-700">
              Bio (optional)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="তোমার কাজ সম্পর্কে দু-এক লাইন..."
              className="w-full rounded-lg border border-ink-200 p-2.5 text-ink-900 placeholder-ink-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* এখন কাজ নিচ্ছে কিনা */}
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="h-4 w-4 accent-brand-500"
            />
            আমি এখন নতুন কাজ নিচ্ছি (available)
          </label>

          {/* সফল/ব্যর্থ message */}
          {message && (
            <p
              className={`rounded-lg p-3 text-sm ${
                message.includes("✓")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
}
