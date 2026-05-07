# Next.js Starter Template

A minimal Next.js starter template designed for AI-assisted development. Provides a clean foundation that can be extended to build any type of web application.

## Tech Stack

| Technology   | Version | Purpose                         |
| ------------ | ------- | ------------------------------- |
| Next.js      | 16.x    | React framework with App Router |
| React        | 19.x    | UI library                      |
| TypeScript   | 5.9.x   | Type-safe JavaScript            |
| Tailwind CSS | 4.x     | Utility-first CSS               |
| Bun          | Latest  | Package manager & runtime       |

## Prerequisites

- [Bun](https://bun.sh) installed (`curl -fsSL https://bun.sh/install | bash`)
- Node.js 20+

## Setup

```bash
bun install
bun dev
```

The dev server starts at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command            | Purpose                      |
| ------------------ | ---------------------------- |
| `bun install`      | Install dependencies         |
| `bun dev`          | Start dev server             |
| `bun build`        | Production build             |
| `bun start`        | Start production server      |
| `bun lint`         | Run ESLint                   |
| `bun typecheck`    | Run TypeScript type checking |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout + metadata
│   ├── page.tsx        # Home page
│   ├── globals.css     # Tailwind imports + global styles
│   └── favicon.ico     # Site icon
└── (expand as needed)
    ├── components/     # React components
    ├── lib/            # Utilities and helpers
    └── db/             # Database files (add via recipe)
```

## Adding Features

### New Page

Create a file at `src/app/[route]/page.tsx`:

```tsx
export default function NewPage() {
  return <div>New page content</div>;
}
```

### New Component

```tsx
export function Button({ children }: { children: React.ReactNode }) {
  return <button className="px-4 py-2 bg-blue-600 text-white rounded">{children}</button>;
}
```

### API Route

Create `src/app/api/[route]/route.ts`:

```tsx
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello" });
}
```

### Database

Follow `.kilocode/recipes/add-database.md` to add Drizzle + SQLite.

## Conventions

- **Server Components by default** — add `"use client"` only when needed
- **Styling** — Tailwind utility classes directly on elements
- **Path aliases** — `@/*` maps to `src/*`
- **File naming** — Components: PascalCase, utilities: camelCase, pages: lowercase
- **Environment variables** — use `.env.local` for local development

## Deployment

```bash
bun build
bun start
```

Supports server-rendered pages by default. Can be configured for static export in `next.config.ts`.
