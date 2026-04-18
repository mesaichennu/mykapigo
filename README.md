# MyKapiGo

Sell India to the World. A full-stack e-commerce and concierge platform built with Next.js 16, Supabase, and PhonePe.

## Features

- **Public Storefront** — Home, Shop (with category filters), product detail pages, About, FAQ, Shipping, Contact.
- **Buy From India** — Concierge service request form for diaspora and international customers.
- **Cart & Checkout** — Client-side cart with PhonePe payment (sandbox-ready, graceful demo fallback when credentials are absent).
- **Order Tracking** — Public order lookup by order number, with a visible shipping timeline.
- **Admin Dashboard** — Auth-protected admin area for managing products, orders (status, shipping updates), service requests, and contact messages.

## Tech Stack

- Next.js 16 (App Router) + React 19
- Supabase (Postgres, Auth, RLS)
- Tailwind CSS v4 + shadcn/ui
- PhonePe payment gateway (sandbox)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# PhonePe (optional — demo-success flow runs if omitted)
PHONEPE_MERCHANT_ID=
PHONEPE_SALT_KEY=
PHONEPE_SALT_INDEX=1
PHONEPE_ENV=SANDBOX
\`\`\`

## Database Setup

Run the scripts in `/scripts` (in order) against your Supabase project, or execute the migrations shipped with this project:

1. `001_create_tables.sql` — tables, RLS policies, `is_admin()` helper, profile trigger.
2. `002_seed_data.sql` — sample categories and products.
3. `003_track_order_rpcs.sql` — public RPCs for order tracking.

## Creating an Admin User

1. Visit `/admin/login` and create an account with your email and password.
2. In your Supabase SQL editor, run:

   \`\`\`sql
   update public.profiles set is_admin = true where email = 'you@example.com';
   \`\`\`

3. Sign in at `/admin/login`. You will now see the admin dashboard.

## Running Locally

\`\`\`
pnpm install
pnpm dev
\`\`\`

## Notes

- International shipping is a manual process — admins add tracking updates from `/admin/orders`.
- PhonePe integration is wired for sandbox; without credentials it falls through to a demo success flow so the app runs out-of-the-box.
- The cart is stored in `localStorage`. Orders are created in Postgres at checkout.
