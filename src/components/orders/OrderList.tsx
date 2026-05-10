"use client";

import { useState } from "react";
import { OrderCard } from "./OrderCard";
import type { Order, OrderStatus } from "@/lib/types";

interface OrderListProps {
  orders: Order[];
}

const FILTER_OPTIONS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All Orders", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Crafting", value: "crafting" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
];

export function OrderList({ orders }: OrderListProps) {
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  const filtered =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status === filter);

  const statusCounts = orders.reduce(
    (acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTER_OPTIONS.map((opt) => {
          const count =
            opt.value === "all"
              ? orders.length
              : statusCounts[opt.value] || 0;
          return (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-4 py-2 rounded-full text-sm tracking-wider uppercase transition-all font-body ${
                filter === opt.value
                  ? "bg-gold text-charcoal shadow-lg shadow-gold/20"
                  : "border border-cream/15 text-cream/50 hover:border-gold/40 hover:text-cream/70"
              }`}
            >
              {opt.label}
              {count > 0 && (
                <span
                  className={`ml-2 text-xs ${
                    filter === opt.value ? "text-charcoal/60" : "text-cream/30"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-cream/5 flex items-center justify-center mx-auto mb-6">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-cream/20"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </div>
          <p className="text-cream/40 font-body">
            No orders found with this filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
