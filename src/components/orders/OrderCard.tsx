"use client";

import { useState } from "react";
import { StatusTracker } from "./StatusTracker";
import type { Order, OrderStatus } from "@/lib/types";

interface OrderCardProps {
  order: Order;
}

const STATUS_COLORS: Record<
  OrderStatus,
  { bg: string; text: string; dot: string }
> = {
  pending: { bg: "bg-gold/10", text: "text-gold", dot: "bg-gold" },
  confirmed: { bg: "bg-sage/10", text: "text-sage-light", dot: "bg-sage" },
  crafting: { bg: "bg-terracotta/10", text: "text-terracotta-light", dot: "bg-terracotta" },
  shipped: { bg: "bg-gold/10", text: "text-gold-light", dot: "bg-gold-light" },
  delivered: { bg: "bg-sage/10", text: "text-sage", dot: "bg-sage" },
  cancelled: { bg: "bg-cream/5", text: "text-cream/40", dot: "bg-cream/30" },
};

export function OrderCard({ order }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const colors = STATUS_COLORS[order.status];

  return (
    <div className="glass rounded-3xl overflow-hidden hover-lift">
      <div
        className="p-6 sm:p-8 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3
                className="text-lg font-display text-cream"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Order #{order.order_number}
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs tracking-wider uppercase font-body ${colors.bg} ${colors.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                {order.status}
              </span>
            </div>
            <p className="text-cream/40 text-sm font-body">
              Placed on{" "}
              {new Date(order.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span
              className="text-xl font-display text-cream"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ${order.total.toFixed(2)}
            </span>
            <button
              className={`text-cream/40 hover:text-gold transition-colors p-1 ${
                expanded ? "rotate-180" : ""
              }`}
              aria-label={expanded ? "Collapse order" : "Expand order"}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 shrink-0 glass rounded-xl px-4 py-2"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/20 to-terracotta/10 flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-gold/60"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </div>
              <div>
                <p className="text-cream/80 text-sm font-body">{item.name}</p>
                <p className="text-cream/30 text-xs font-body">
                  {item.material} · Qty {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {expanded && (
        <div className="px-6 sm:px-8 pb-8 animate-fade-in">
          <div className="border-t border-cream/10 pt-6">
            <StatusTracker
              currentStatus={order.status}
              estimatedDelivery={order.estimated_delivery ?? ""}
              deliveredAt={order.delivered_at}
            />

            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-cream/40 text-xs tracking-widest uppercase mb-3 font-body">
                  Items
                </h4>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="text-cream/80 text-sm font-body">
                          {item.name}
                          {item.quantity > 1 && (
                            <span className="text-cream/30 ml-1">
                              x{item.quantity}
                            </span>
                          )}
                        </p>
                        <p className="text-cream/30 text-xs font-body">
                          {item.material}
                        </p>
                      </div>
                      <span className="text-cream/60 text-sm font-body">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-cream/10 flex items-center justify-between">
                  <span className="text-cream/60 text-sm font-body">Total</span>
                  <span
                    className="text-lg font-display text-cream"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-cream/40 text-xs tracking-widest uppercase mb-3 font-body">
                    Shipping Address
                  </h4>
                  <p className="text-cream/60 text-sm font-body leading-relaxed">
                    {order.shipping_address}
                  </p>
                </div>

                {order.tracking_number && (
                  <div>
                    <h4 className="text-cream/40 text-xs tracking-widest uppercase mb-3 font-body">
                      Tracking
                    </h4>
                    <p className="text-gold text-sm font-body">
                      {order.tracking_number}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
