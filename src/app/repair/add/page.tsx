"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuth";
import { DashboardShell, LoadingScreen } from "@/components/dashboard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

// diagnosis/technician-এর সাথে মিল রেখে একই category গুলো
const categories = ["AC", "Plumbing", "Electrical", "Appliance"];
const priorities = ["low", "medium", "high"] as const;

export default function AddRepairPage() {
  const router = useRouter();
  // শুধু customer নতুন request দিতে পারে; অন্যরা নিজের dashboard-এ যায়, logged-out login-এ
  const { user, checking } = useAuthGuard("customer");

  // form field গুলো
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState<(typeof priorities)[number]>("medium");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // create — POST /repairs (backend auto-diagnosis চালায়)
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/repairs", {
        title: title.trim(),
        category,
        location: location.trim(),
        priority,
        description: description.trim(),
        // image URL দিলে পাঠাই, না দিলে বাদ
        image: image.trim() || undefined,
      });
      return res.data;
    },
    onSuccess: () => router.push("/repair/my"),
  });

  // client-side validation — submit-এর আগে খালি/ছোট field ধরি
  const validate = () => {
    const e: Record<string, string> = {};
    if (title.trim().length < 3) e.title = "কমপক্ষে ৩ অক্ষরের title দিন";
    if (!category) e.category = "category বাছুন";
    if (location.trim().length < 2) e.location = "এলাকা লিখুন";
    if (description.trim().length < 10)
      e.description = "সমস্যাটা অন্তত ১০ অক্ষরে লিখুন";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) mutation.mutate();
  };

  if (checking) return <LoadingScreen />;

  return (
    <DashboardShell user={user} width="sm">
      <h1 className="mb-1 text-2xl font-bold text-ink-900">New Repair Request</h1>
      <p className="mb-6 text-sm text-ink-500">
        সমস্যাটা লিখুন — সঙ্গে সঙ্গে সম্ভাব্য কারণ ও আনুমানিক খরচ পাবেন।
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-ink-100 bg-white p-6 shadow-sm"
      >
        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium text-ink-700">
            Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="যেমন: AC ঠান্ডা হচ্ছে না"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Category + Priority পাশাপাশি */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink-700">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-ink-200 p-2.5 text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">Select...</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-ink-700">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as (typeof priorities)[number])
              }
              className="w-full rounded-lg border border-ink-200 p-2.5 capitalize text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {priorities.map((p) => (
                <option key={p} value={p} className="capitalize">
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="mb-2 block text-sm font-medium text-ink-700">
            Location
          </label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="যেমন: Mirpur, Dhaka"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
        </div>

        {/* Description (full) */}
        <div>
          <label className="mb-2 block text-sm font-medium text-ink-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="সমস্যাটা বিস্তারিত লিখুন — কী হচ্ছে, কবে থেকে..."
            className="w-full rounded-lg border border-ink-200 p-2.5 text-ink-900 placeholder-ink-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Optional image URL */}
        <div>
          <label className="mb-2 block text-sm font-medium text-ink-700">
            Image URL (optional)
          </label>
          <Input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
          />
        </div>

        {mutation.isError && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            Could not create the request. Please try again.
          </p>
        )}

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </DashboardShell>
  );
}
