"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Save, Package } from "lucide-react";
import type { Order, OrderStatus } from "@/lib/types";

const STATUS_STEPS: OrderStatus[] = [
  "pending",
  "confirmed",
  "crafting",
  "shipped",
  "delivered",
];

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data } = await supabase
        .from("orders")
        .select("*, customer:profiles!inner(email)")
        .eq("id", params.id);
      if (data && data.length > 0) {
        setOrder(data[0] as any);
        setTrackingNumber((data[0] as any).tracking_number || "");
        setNotes((data[0] as any).notes || "");
      }
      setLoading(false);
    }
    fetchData();
  }, [params.id]);

  async function updateStatus(status: OrderStatus) {
    if (!order) return;
    setUpdating(true);
    const supabase = createClient() as any;
    const { error } = await supabase.from("orders").update({ status }).eq("id", order.id);
    if (!error) {
      setOrder({ ...order, status });
    }
    setUpdating(false);
  }

  async function saveTracking() {
    if (!order) return;
    setUpdating(true);
    const supabase = createClient() as any;
    await supabase.from("orders").update({
      tracking_number: trackingNumber,
      notes: notes || null,
    }).eq("id", order.id);
    setOrder({ ...order, tracking_number: trackingNumber, notes: notes || null });
    setUpdating(false);
  }

  if (loading) {
    return (
      <div className="glass rounded-3xl p-8 text-center text-cream/40 font-body">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="glass rounded-3xl p-8 text-center">
        <p className="text-cream/40 font-body">Order not found</p>
        <Link href="/admin/orders">
          <Button className="mt-4">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/orders")}
          className="p-2 rounded-xl glass hover-glow"
        >
          <ArrowLeft size={20} className="text-cream/60" />
        </button>
        <div>
          <h1 className="text-3xl font-display text-cream" style={{ fontFamily: "var(--font-display)" }}>
            Order #{order.order_number}
          </h1>
          <p className="text-cream/40 font-body">View and manage order details</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-3xl p-6">
            <h2 className="text-lg font-display text-cream mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Order Items
            </h2>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-cream/5">
                  <div className="w-12 h-12 rounded-xl bg-cream/10 flex items-center justify-center">
                    <Package size={20} className="text-cream/40" />
                  </div>
                  <div className="flex-1">
                    <p className="text-cream/90 font-body font-medium">{item.name}</p>
                    <p className="text-cream/40 text-sm font-body">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-cream/90 font-body">{formatPrice(item.price)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-cream/10 flex justify-between">
              <span className="text-cream/60 font-body">Total</span>
              <span className="text-xl font-display text-cream" style={{ fontFamily: "var(--font-display)" }}>
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <h2 className="text-lg font-display text-cream mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Shipping Information
            </h2>
            <p className="text-cream/80 font-body whitespace-pre-wrap">
              {order.shipping_address || "No shipping address provided"}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-3xl p-6">
            <h2 className="text-lg font-display text-cream mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Status
            </h2>
            <div className="mb-4">
              <StatusBadge status={order.status} />
            </div>
            <div className="space-y-2">
              {STATUS_STEPS.map((status) => {
                const currentIndex = STATUS_STEPS.indexOf(order.status);
                const thisIndex = STATUS_STEPS.indexOf(status);
                const canUpdate = thisIndex >= currentIndex && thisIndex <= currentIndex + 1;

                return (
                  <button
                    key={status}
                    onClick={() => canUpdate && updateStatus(status)}
                    disabled={updating || !canUpdate}
                    className={`w-full py-2 px-3 rounded-lg text-sm font-body transition-all ${
                      order.status === status
                        ? "bg-gold/20 text-gold"
                        : canUpdate
                        ? "bg-cream/5 hover:bg-cream/10 text-cream/70"
                        : "opacity-30 cursor-not-allowed text-cream/40"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <h2 className="text-lg font-display text-cream mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Tracking
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-cream/60 text-sm font-body mb-2">Tracking Number</label>
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                />
              </div>
              <div>
                <label className="block text-cream/60 text-sm font-body mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl bg-cream/5 border border-cream/10 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/30 font-body resize-none"
                />
              </div>
              <Button size="sm" onClick={saveTracking} disabled={updating}>
                <Save size={14} />
                Save Tracking
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}