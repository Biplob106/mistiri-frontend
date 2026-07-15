"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { api } from "@/lib/api";

// একটা booking দেখতে কেমন — repair ও technician populate হয়ে আসে
interface Booking {
  _id: string;
  status: string;
  createdAt: string;
  repair: { _id: string; title: string; category: string; location: string };
  technician: { name: string; phone?: string };
  review?: { rating: number; comment?: string };
}

// booking status অনুযায়ী রঙ
const statusColor: Record<string, string> = {
  requested: "bg-ink-100 text-ink-700",
  accepted: "bg-brand-100 text-brand-700",
  in_progress: "bg-brand-200 text-brand-800",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

// একটা booking card + (কাজ শেষ হলে) review form
function BookingCard({ booking }: { booking: Booking }) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // review পাঠাই — সফল হলে list আবার fetch হয়
  const reviewMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/bookings/${booking._id}/review`, {
        rating,
        comment,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
  });

  return (
    <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-ink-900">{booking.repair?.title}</h2>
          <p className="mt-1 text-sm text-ink-500">
            {booking.repair?.category} · {booking.repair?.location}
          </p>
          <p className="mt-1 text-sm text-ink-600">
            Technician: {booking.technician?.name}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            statusColor[booking.status] || "bg-ink-100 text-ink-700"
          }`}
        >
          {booking.status.replace("_", " ")}
        </span>
      </div>

      {/* ইতিমধ্যে review দেওয়া থাকলে সেটা দেখাই */}
      {booking.review && (
        <div className="mt-4 rounded-lg bg-ink-50 p-3">
          <p className="text-sm text-ink-900">
            {"⭐".repeat(booking.review.rating)}{" "}
            <span className="text-ink-500">({booking.review.rating}/5)</span>
          </p>
          {booking.review.comment && (
            <p className="mt-1 text-sm text-ink-700">{booking.review.comment}</p>
          )}
        </div>
      )}

      {/* কাজ শেষ, কিন্তু এখনো review দেওয়া হয়নি — form দেখাই */}
      {booking.status === "completed" && !booking.review && (
        <div className="mt-4 border-t border-ink-100 pt-4">
          <p className="mb-2 text-sm font-medium text-ink-700">
            Leave a review
          </p>
          {/* তারা বেছে rating দাও */}
          <div className="mb-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={`text-2xl transition ${
                  n <= rating ? "text-brand-500" : "text-ink-200"
                }`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            placeholder="কেমন কাজ হলো লিখুন (optional)..."
            className="w-full rounded-lg border border-ink-200 p-2.5 text-sm text-ink-900 placeholder-ink-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <button
            onClick={() => reviewMutation.mutate()}
            disabled={rating === 0 || reviewMutation.isPending}
            className="mt-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
          >
            {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
          </button>
          {reviewMutation.isError && (
            <p className="mt-2 text-sm text-red-600">
              Could not submit review.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const res = await api.get("/bookings/my");
      return res.data.bookings as Booking[];
    },
  });

  return (
    <div className="min-h-screen bg-ink-50 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-ink-900">My Bookings</h1>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            ← Dashboard
          </Link>
        </div>

        {isLoading && <p className="text-ink-500">Loading...</p>}

        {isError && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            Could not load your bookings. Please make sure you are logged in.
          </p>
        )}

        {data && data.length === 0 && (
          <div className="rounded-xl border border-ink-100 bg-white p-8 text-center">
            <p className="text-ink-500">You have no bookings yet.</p>
            <Link
              href="/repair/my"
              className="mt-2 inline-block font-medium text-brand-600 hover:underline"
            >
              Go to your repair requests
            </Link>
          </div>
        )}

        {data && data.length > 0 && (
          <div className="space-y-3">
            {data.map((b) => (
              <BookingCard key={b._id} booking={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
