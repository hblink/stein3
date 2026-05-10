"use client";

import { AdminSidebar } from "@/components/admin/Sidebar";
import { Toaster } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-charcoal flex">
      <AdminSidebar />
      <main className="flex-1 min-h-screen overflow-auto">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8 lg:py-10 pt-16 lg:pt-10">
          {children}
        </div>
      </main>
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(61, 61, 61, 0.9)",
            border: "1px solid rgba(201, 169, 110, 0.2)",
            color: "#FAF6F1",
            fontFamily: "var(--font-body)",
          },
        }}
      />
    </div>
  );
}
