"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { dashboardPathFor, Role } from "@/lib/useAuth";

// public client id — Google Cloud Console থেকে পাওয়া, Vercel env-এ সেট করা
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

// Google Identity Services-এর যতটুকু দরকার, ততটুকুর টাইপ
interface GoogleId {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (r: { credential: string }) => void;
      }) => void;
      renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void;
    };
  };
}

export function GoogleLoginButton() {
  const router = useRouter();
  const btnRef = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);
  const [error, setError] = useState("");

  // Google থেকে আসা credential (ID token) backend-এ পাঠাই
  const handleCredential = useCallback(
    async (response: { credential: string }) => {
      try {
        const res = await api.post("/auth/google", {
          credential: response.credential,
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        router.push(dashboardPathFor(res.data.user.role as Role));
      } catch {
        setError("Google login failed. Please try again.");
      }
    },
    [router]
  );

  // GSI লোড হলে button render করি (একবারই)
  const renderBtn = useCallback(() => {
    if (rendered.current || !CLIENT_ID || !btnRef.current) return;
    const g = (window as unknown as { google?: GoogleId }).google;
    if (!g?.accounts?.id) return;
    g.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredential,
    });
    g.accounts.id.renderButton(btnRef.current, {
      theme: "outline",
      size: "large",
      width: 320,
      text: "continue_with",
    });
    rendered.current = true;
  }, [handleCredential]);

  // script আগেই লোড থাকলে (page navigation) এখানেই render হবে
  useEffect(() => {
    renderBtn();
  }, [renderBtn]);

  // client id সেট না থাকলে কিছুই দেখাই না (কনফিগার হওয়ার আগে যাতে না ভাঙে)
  if (!CLIENT_ID) return null;

  return (
    <div className="mt-5">
      <div className="mb-4 flex items-center gap-3 text-xs text-ink-500">
        <span className="h-px flex-1 bg-ink-100" />
        or
        <span className="h-px flex-1 bg-ink-100" />
      </div>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={renderBtn}
      />
      <div ref={btnRef} className="flex justify-center" />
      {error && (
        <p className="mt-2 text-center text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
