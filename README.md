# Lumière Jewellery

A beautiful online store for handmade sustainable jewellery. Built with care for both customers and store owners.

## What is this?

This is the Lumière e-commerce platform - a complete online shop where customers can browse and purchase handmade necklaces, bracelets, earrings, and rings. The admin panel (for store owners) lets you easily add new products, manage orders, and track customer purchases.

## Tech Stack

| Technology   | Version | Purpose                |
| ------------ | ------- | -------------------- |
| Next.js      | 16.x    | React framework        |
| React        | 19.x    | UI library           |
| TypeScript   | 5.x     | Type-safe JavaScript   |
| Tailwind CSS | 4.x     | Styling                |
| Bun          | Latest  | Package manager        |
| Supabase     | Latest  | Database & Auth        |

## Getting Started

### 1. Install dependencies
```bash
bun install
```

### 2. Set up environment variables
Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Run the development server
```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Commands

- `bun dev` - Start development server
- `bun build` - Build for production  
- `bun lint` - Check code quality
- `bun typecheck` - Run TypeScript checks

## Project Structure

```
src/
├── app/
│   ├── admin/           # Admin panel (products, orders, customers)
│   ├── shop/            # Customer product listing
│   ├── product/[slug]/  # Product detail pages
│   ├── cart/            # Shopping cart
│   ├── login/           # Login page
│   ├── signup/          # Signup page
│   └── page.tsx         # Home page
├── components/
│   ├── ui/             # Reusable components
│   └── admin/          # Admin-specific components
├── lib/
│   ├── supabase.ts     # Supabase client
│   ├── types.ts        # TypeScript types
│   └── validation.ts   # Form validation
└── styles/
    └── globals.css     # Global styles
```

## Deployment

Deploy easily to Vercel or any platform that supports Next.js.

```bash
bun build
```