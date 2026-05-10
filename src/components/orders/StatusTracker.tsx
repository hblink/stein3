"use client";

import {
  STATUS_STEPS,
  STATUS_LABELS,
  STATUS_DESCRIPTIONS,
  type OrderStatus,
} from "@/lib/types";

interface StatusTrackerProps {
  currentStatus: OrderStatus;
  estimatedDelivery: string | null;
  deliveredAt: string | null;
}

export function StatusTracker({
  currentStatus,
  estimatedDelivery,
  deliveredAt,
}: StatusTrackerProps) {
  const currentIndex = STATUS_STEPS.indexOf(currentStatus);

  return (
    <div className="w-full">
      <div className="relative flex justify-between">
        {STATUS_STEPS.map((step, i) => {
          const isCompleted = i <= currentIndex;
          const isCurrent = i === currentIndex;
          const isLast = i === STATUS_STEPS.length - 1;

          return (
            <div key={step} className="flex flex-col items-center flex-1 relative">
              {!isLast && (
                <div
                  className={`absolute top-3 left-1/2 w-full h-0.5 transition-all duration-500 ${
                    i < currentIndex
                      ? "bg-gold"
                      : "bg-cream/10"
                  }`}
                />
              )}

              <div
                className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isCompleted
                    ? "bg-gold text-charcoal"
                    : "bg-cream/10 text-cream/30"
                } ${isCurrent ? "ring-2 ring-gold/40 ring-offset-2 ring-offset-charcoal" : ""}`}
              >
                {isCompleted ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </div>

              <span
                className={`mt-2 text-[10px] tracking-wider uppercase font-body text-center ${
                  isCompleted ? "text-cream/80" : "text-cream/30"
                } ${isCurrent ? "font-semibold" : ""}`}
              >
                {STATUS_LABELS[step]}
              </span>

              {isCurrent && (
                <span className="mt-1 text-[9px] text-gold/70 font-body text-center">
                  {STATUS_DESCRIPTIONS[step]}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-cream/50 text-sm font-body">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        {currentStatus === "delivered" && deliveredAt ? (
          <span>
            Delivered on{" "}
            <span className="text-cream/80">
              {new Date(deliveredAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </span>
        ) : estimatedDelivery ? (
          <span>
            Estimated delivery{" "}
            <span className="text-gold">
              {new Date(estimatedDelivery).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </span>
        ) : (
          <span>Estimating delivery date...</span>
        )}
      </div>
    </div>
  );
}
