"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-client";
import { formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { STATUS_LABELS, STATUS_DESCRIPTIONS } from "@/lib/types";
import type { Order } from "@/lib/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });
        setOrders((data as Order[]) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="bg-charcoal min-h-screen flex items-center justify-center">
        <div className="text-cream/40 font-body">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="bg-charcoal min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-cream/40 hover:text-gold transition-colors text-sm font-body mb-8"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <h1
            className="text-4xl md:text-5xl font-display text-cream mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your Orders
          </h1>

          <p className="text-cream/50 font-body max-w-lg">
            Track your handcrafted pieces from our studio to your doorstep. Every
            order carries the care of our artisans.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-24 glass rounded-3xl">
            <div className="w-24 h-24 rounded-full bg-cream/5 flex items-center justify-center mx-auto mb-8">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-cream/15"
              >
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </div>
            <h2
              className="text-2xl font-display text-cream/60 mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              No Orders Yet
            </h2>
            <p className="text-cream/30 font-body mb-8 max-w-sm mx-auto">
              Your handcrafted journey begins here. Explore our collection or
              design your own piece.
            </p>
            <Link
              href="/#collection"
              className="inline-flex px-8 py-3.5 rounded-full bg-gold text-charcoal font-semibold tracking-wider uppercase text-sm hover:bg-gold-light transition-all hover:shadow-[0_0_30px_rgba(201,169,110,0.4)]"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="glass rounded-3xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-cream/40 text-sm font-body">Order #{order.order_number}</p>
                    <p className="text-cream/60 text-sm font-body">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <p className="text-cream/80 font-body mb-2">
                  {STATUS_DESCRIPTIONS[order.status as keyof typeof STATUS_DESCRIPTIONS]}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-cream/10">
                  <span className="text-cream/40 text-sm font-body">{order.items?.length || 0} items</span>
                  <span className="text-lg font-display text-gold" style={{ fontFamily: "var(--font-display)" }}>
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}