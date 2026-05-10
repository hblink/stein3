"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-client";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Search } from "lucide-react";
import type { Order } from "@/lib/types";

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  async function fetchData() {
    const supabase = createClient();
    const { data } = await supabase
      .from("orders")
      .select("*, customer:profiles!inner(email)")
      .order("created_at", { ascending: false });
    setOrders((data as any) || []);
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      try {
        await fetchData();
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display text-cream mb-2" style={{ fontFamily: "var(--font-display)" }}>
          Orders
        </h1>
        <p className="text-cream/40 font-body">
          Manage customer orders and update statuses
        </p>
      </div>

      <div className="glass rounded-3xl p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30" size={18} />
            <input
              type="text"
              placeholder="Search orders by number or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-cream/5 border border-cream/10 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/30 font-body"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 rounded-xl bg-cream/5 border border-cream/10 text-cream font-body min-w-[180px] focus:outline-none focus:border-gold/30"
          >
            <option value="">All Statuses</option>
            <option value="pending">Order Placed</option>
            <option value="confirmed">Confirmed</option>
            <option value="crafting">Handcrafting</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="glass rounded-3xl p-8 text-center text-cream/40 font-body">
          Loading orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="glass rounded-3xl p-8 text-center">
          <p className="text-cream/40 font-body">
            {searchQuery || selectedStatus ? "No orders match your filters" : "No orders yet"}
          </p>
        </div>
      ) : (
        <div className="glass rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-cream/10">
                <tr className="text-left">
                  <th className="px-6 py-4 text-xs tracking-widest text-cream/40 uppercase font-body">Order</th>
                  <th className="px-6 py-4 text-xs tracking-widest text-cream/40 uppercase font-body">Customer</th>
                  <th className="px-6 py-4 text-xs tracking-widest text-cream/40 uppercase font-body">Date</th>
                  <th className="px-6 py-4 text-xs tracking-widest text-cream/40 uppercase font-body">Status</th>
                  <th className="px-6 py-4 text-xs tracking-widest text-cream/40 uppercase font-body">Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-cream/5 last:border-0 hover:bg-cream/2">
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order.id}`}>
                        <span className="text-gold hover:text-gold-light font-body">#{order.order_number}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-cream/60 font-body">
                      {order.customer?.email || "Guest"}
                    </td>
                    <td className="px-6 py-4 text-cream/60 font-body">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-cream/90 font-body">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}