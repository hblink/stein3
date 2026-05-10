# Active Context: Next.js Starter Template

## Current State

**Template Status**: ✅ Ready for development

The template is a Lumière handmade jewellery brand site with Next.js 16, TypeScript, and Tailwind CSS 4. It now includes a customer-facing order history page integrated with Supabase.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] Customer-facing order history page with Supabase integration
- [x] Order status tracker component (pending → confirmed → crafting → shipped → delivered)
- [x] Order list with filter by status
- [x] Estimated delivery dates and delivered-at display
- [x] "Orders" link added to main navigation

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home page | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `src/app/orders/page.tsx` | Order history page | ✅ Ready |
| `src/components/orders/` | Order components | ✅ Ready |
| `src/lib/supabase.ts` | Supabase client | ✅ Ready |
| `src/lib/types.ts` | Order types & status definitions | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Supabase Setup

The orders page requires a `orders` table in Supabase with columns:
- `id` (uuid, primary key)
- `order_number` (text)
- `status` (text: pending|confirmed|crafting|shipped|delivered)
- `items` (jsonb: array of {name, quantity, price, material, image_url?})
- `total` (numeric)
- `created_at` (timestamptz)
- `estimated_delivery` (timestamptz)
- `delivered_at` (timestamptz, nullable)
- `customer_id` (text)
- `tracking_number` (text, nullable)
- `shipping_address` (text)

Environment variables needed: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-05-10 | Added order history page with Supabase integration, status tracking, and delivery dates |
