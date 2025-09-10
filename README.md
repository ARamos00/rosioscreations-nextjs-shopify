# Rosio’s Creations — Next.js + Shopify + Supabase Bookings

I forked a Next.js + Shopify starter and added a **booking flow**. Products can be **Services** or **Rentals**, each with its **own calendar**. When a user picks a date, that selection rides through Shopify checkout and lands in **Supabase** on order creation (and is cleaned up on cancellation).

## What’s here

* **Separate calendars** for Services and Rentals.
* **Calendar on product pages** to choose date(s).
* **Cart updated** to carry booking data (line item/cart metadata).
* **Order create route** → inserts a booking row in Supabase.
* **Order cancel route** → releases/updates the booking row.
* **Event décor page/route** as a booking entry point.
* Tech: **Next.js (App Router), TS, Tailwind, Shopify Storefront API, Supabase**.

## How it works

1. User opens a Service or Rental product and picks a date on the **Calendar**.
2. The booking payload is attached to the cart item and survives checkout.
3. On **order creation**, my route writes the booking to **Supabase**.
4. On **order cancellation**, my route updates or frees that booking.

## Setup

```bash
npm install
cp .env.sample .env   # fill these
npm run dev           # http://localhost:3000
```

### Env (minimal)

* `SHOPIFY_STORE_DOMAIN`
* `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
* `SUPABASE_URL`
* `SUPABASE_SERVICE_ROLE_KEY` (server-only)

## Key pieces I added

* **Calendar component** (renders the right calendar by type, validates date).
* **Cart changes** (serialize/deserialize booking data reliably).
* **Routes**

  * **Order creation** route: validate → insert booking in Supabase.
  * **Order cancellation** route: validate → release/update booking.
* **Event décor** page + route for service booking.

## Notes

* Dates are stored in **UTC**; convert for display at the edges.
* Keep `SUPABASE_SERVICE_ROLE_KEY` **server-side only**.
* Shopify remains source of truth for orders; **Supabase** is source of truth for **bookings**.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Starter/refs

* Video the starter came from:
  [![Building Next.js Ecommerce Store](https://img.youtube.com/vi/fJxzVFXGT_E/0.jpg)](https://www.youtube.com/watch?v=fJxzVFXGT_E)
* Next.js docs: [https://nextjs.org/docs](https://nextjs.org/docs)
* Shopify Storefront API: [https://shopify.dev/docs/api/storefront](https://shopify.dev/docs/api/storefront)
* Supabase: [https://supabase.com/docs](https://supabase.com/docs)

---
