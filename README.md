# Mistiri — Frontend

Web client for **Mistiri**, a smart home-maintenance platform. Customers describe a repair problem, get an instant rule-based diagnosis with an estimated cost, browse and book verified technicians, then track the job — with separate dashboards for customers, technicians, and admins.

**Live site:** https://mistiri-frontend.vercel.app
**Backend repo:** https://github.com/Biplob106/mistiri-backend
**Live API:** https://mistiri-backend.vercel.app/api

---

## 🏠 প্রজেক্ট পরিচিতি (Bangla)

**Mistiri** একটি স্মার্ট হোম-মেইনটেন্যান্স প্ল্যাটফর্ম। ব্যবহারকারী ঘরের কোনো সমস্যা
(AC, electrical বা plumbing) নিজের ভাষায় লেখেন → সঙ্গে সঙ্গে সম্ভাব্য কারণ ও
আনুমানিক খরচের ধারণা পান → এলাকা ও দক্ষতা অনুযায়ী উপযুক্ত মিস্ত্রি খুঁজে booking
দেন → কাজের অবস্থা track করেন → শেষে রিভিউ দেন।

এই repo-টি হলো **frontend** — Next.js + TypeScript + Tailwind CSS দিয়ে তৈরি।
এতে আছে একটি landing page, technician explore ও details page, এবং **গ্রাহক**,
**মিস্ত্রি** ও **অ্যাডমিন** — তিন role-এর আলাদা dashboard। সমস্যা জমা দেওয়া,
মিস্ত্রি booking, কাজ track ও রিভিউ — পুরো অভিজ্ঞতা এখান থেকেই ব্যবহার করা যায়।
পুরো UI সব device-এ responsive এবং amber-slate একটি ধারাবাহিক থিমে সাজানো।

---

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (custom `brand` amber + `ink` slate theme)
- **TanStack Query** for data fetching, **Axios** API client
- **Recharts** for dashboard analytics
- **Google Identity Services** for social login
- Deployed on **Vercel**

---

## Getting Started

```bash
# 1. install
npm install

# 2. create .env.local (see below)

# 3. run in dev
npm run dev            # http://localhost:3000

# 4. production build
npm run build
npm start
```

### Environment variables

Copy `.env.example` to `.env.local`:

```env
# Backend API base URL (must include /api)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Google Sign-In (optional) — leave blank to hide the button
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<xxxxx.apps.googleusercontent.com>
```

> `NEXT_PUBLIC_*` values are baked in at **build time**. On Vercel they're set in
> Project → Settings → Environment Variables, then the project is redeployed.
> For Google login, add your site to **Authorized JavaScript origins** in Google Cloud Console.

### Demo login

The login page has one-click **Customer** / **Admin** demo buttons (seed the backend with `npm run seed:demo` first):

| Role | Email | Password |
|------|-------|----------|
| Customer | `customer@mistiri.app` | `Demo@1234` |
| Admin | `admin@mistiri.app` | `Admin@1234` |

---

## Routes

**Public**
| Route | Page |
|-------|------|
| `/` | Landing (hero, categories, how-it-works, features, FAQ, footer) |
| `/technicians` | Explore — search, category/area filters, sorting, pagination |
| `/technicians/[id]` | Technician details (public) |
| `/about`, `/contact` | About & Contact |
| `/login`, `/register` | Auth (validation, demo login, Google Sign-In) |

**Customer** (login-gated)
| Route | Page |
|-------|------|
| `/dashboard` | Customer dashboard (stats + charts) |
| `/repair/add` | New repair request *(alias: `/items/add`)* |
| `/repair/my` | Manage requests — View / Delete *(alias: `/items/manage`)* |
| `/repair/[id]` | Request details + diagnosis + book a technician |
| `/bookings` | My bookings + reviews |

**Technician**
| Route | Page |
|-------|------|
| `/technician/dashboard` | Job summary + profile status |
| `/technician/jobs` | Assigned jobs, advance status |
| `/technicians/setup` | Create / edit profile |

**Admin**
| Route | Page |
|-------|------|
| `/admin/dashboard` | Platform analytics + action cards |
| `/admin/technicians` | Verify / unverify technicians |
| `/admin/users` | Manage / delete users |
| `/admin/bookings` | All bookings |

Role-based routing is enforced with a `useAuthGuard(role)` hook — wrong-role users are redirected to their own dashboard, logged-out users to `/login`.

---

## Project Structure

```
src/
  app/                 # App Router pages (see Routes above)
  components/
    dashboard.tsx      # NavBar, DashboardShell, StatCard, charts, skeletons
    site.tsx           # public sticky header + footer (SiteHeader/SiteFooter)
    GoogleLoginButton.tsx
    ui/                # Input, Button
  lib/
    api.ts             # axios instance (baseURL + token interceptor)
    useAuth.ts         # useAuthGuard, useOptionalAuth, role → path map, logout
  app/globals.css      # Tailwind theme (@theme brand + ink tokens)
```

## Design System

- **brand** = amber scale (`bg-brand-500`, `text-brand-600`, …) — primary
- **ink** = slate scale (`text-ink-900`, `border-ink-100`, …) — neutral
- green / red used only for status (verified, completed, delete)
- Cards: `rounded-xl border border-ink-100 bg-white shadow-sm`
- Fully responsive (mobile hamburger nav, `sm`/`lg` breakpoints)

## Features

- Sticky, responsive, auth-aware navigation + full footer (contact + social) on every page
- Explore listing with 4-per-row cards, search, filters, sorting, pagination, skeleton loaders
- Public technician details pages
- Role-based dashboards with Recharts analytics
- Protected add/manage flows with client-side validation
- Email/password + demo + Google login
