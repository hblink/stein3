"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-client";
import { formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import {
  Package,
  ClipboardList,
  Users,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import type { Order, Profile } from "@/lib/types";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const results = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase
          .from("orders")
          .select("*, customer:profiles!inner(email)")
          .order("created_at", { ascending: false })
          .limit(10),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("total"),
      ]);

      const productResult = results[0];
      const ordersResult = results[1];
      const customersResult = results[2];
      const revenueResult = results[3];

      const allOrders = revenueResult.data as { total: number }[] | null;
      const recentOrders = ordersResult.data as Order[] | null;

      const revenue =
        allOrders?.reduce((sum, o) => sum + Number(o.total), 0) || 0;
      const pendingCount =
        recentOrders?.filter((o) => o.status === "pending").length || 0;

      setStats({
        totalProducts: productResult.count || 0,
        pendingOrders: pendingCount,
        totalRevenue: revenue,
        totalCustomers: customersResult.count || 0,
      });
      setOrders(recentOrders || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-3xl font-display text-cream mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Dashboard
        </h1>
        <p className="text-cream/40 font-body">
          Overview of your store performance
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="glass rounded-3xl p-6 hover-glow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center">
              <Package size={24} className="text-gold" />
            </div>
            <div>
              <p
                className="text-3xl font-display text-cream"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {stats.totalProducts}
              </p>
              <p className="text-cream/40 text-xs tracking-widest uppercase font-body">
                Products
              </p>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 hover-glow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-terracotta/10 flex items-center justify-center">
              <ClipboardList size={24} className="text-terracotta-light" />
            </div>
            <div>
              <p
                className="text-3xl font-display text-cream"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {stats.pendingOrders}
              </p>
              <p className="text-cream/40 text-xs tracking-widest uppercase font-body">
                Pending Orders
              </p>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 hover-glow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center">
              <DollarSign size={24} className="text-sage-light" />
            </div>
            <div>
              <p
                className="text-3xl font-display text-cream"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {formatPrice(stats.totalRevenue)}
              </p>
              <p className="text-cream/40 text-xs tracking-widest uppercase font-body">
                Total Revenue
              </p>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 hover-glow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cream/5 flex items-center justify-center">
              <Users size={24} className="text-cream/60" />
            </div>
            <div>
              <p
                className="text-3xl font-display text-cream"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {stats.totalCustomers}
              </p>
              <p className="text-cream/40 text-xs tracking-widest uppercase font-body">
                Customers
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-cream/10 flex items-center justify-between">
          <h2
            className="text-lg font-display text-cream"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Recent Orders
          </h2>
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-cream/40 font-body">
            Loading...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-cream/40 font-body">
            No orders yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-cream/10">
                <tr className="text-left">
                  <th className="px-6 py-3 text-xs tracking-widest text-cream/40 uppercase font-body">
                    Order
                  </th>
                  <th className="px-6 py-3 text-xs tracking-widest text-cream/40 uppercase font-body">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-xs tracking-widest text-cream/40 uppercase font-body">
                    Date
                  </th>
                  <th className="px-6 py-3 text-xs tracking-widest text-cream/40 uppercase font-body">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs tracking-widest text-cream/40 uppercase font-body">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-cream/5 last:border-0"
                  >
                    <td className="px-6 py-4 text-cream/80 font-body">
                      #{order.order_number}
                    </td>
                    <td className="px-6 py-4 text-cream/60 font-body">
                      {order.customer?.email?.split("@")[0] || "Guest"}
                    </td>
                    <td className="px-6 py-4 text-cream/60 font-body">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-cream/80 font-body">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Link href="/admin/products/new">
          <button className="w-full py-8 rounded-3xl bg-gold text-charcoal font-semibold tracking-wider uppercase text-lg hover:bg-gold-light transition-all hover:shadow-[0_0_30px_rgba(201,169,110,0.4)] flex items-center justify-center gap-3">
            <Package size={24} />
            Add New Product
          </button>
        </Link>
        <Link href="/admin/orders">
          <button className="w-full py-8 rounded-3xl border border-cream/15 text-cream/80 font-semibold tracking-wider uppercase text-lg hover:border-gold/40 hover:text-cream transition-all flex items-center justify-center gap-3">
            <ClipboardList size={24} />
            Process Orders
          </button>
        </Link>
      </div>
    </div>
  );
}
