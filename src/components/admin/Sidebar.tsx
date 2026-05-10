"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Heart,
} from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderOpen },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full border border-gold/60 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-gold/80" />
        </div>
        <div>
          <span
            className="font-display text-lg tracking-widest text-cream uppercase block"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Lumière
          </span>
          <span className="text-cream/30 text-[10px] tracking-widest uppercase font-body">
            Admin Panel
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body transition-all ${
                isActive
                  ? "bg-gold/10 text-gold"
                  : "text-cream/40 hover:text-cream/70 hover:bg-cream/5"
              }`}
            >
              <Icon size={18} />
              <span className="tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body text-cream/40 hover:text-cream/70 hover:bg-cream/5 transition-all"
        >
          <Heart size={18} />
          <span className="tracking-wider">View Store</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body text-cream/40 hover:text-terracotta hover:bg-terracotta/5 transition-all"
        >
          <LogOut size={18} />
          <span className="tracking-wider">Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl glass flex items-center justify-center text-cream/60"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-charcoal/80"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-charcoal-light border-r border-cream/5 transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
      </aside>
    </>
  );
}
