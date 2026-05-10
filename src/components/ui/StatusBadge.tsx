import type { OrderStatus } from "@/lib/types";
import { classNames } from "@/lib/utils";

const STATUS_STYLES: Record<
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

interface StatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const styles = STATUS_STYLES[status];
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1.5 rounded-full tracking-wider uppercase font-body",
        styles.bg,
        styles.text,
        size === "sm" ? "px-3 py-1 text-[10px]" : "px-4 py-1.5 text-xs"
      )}
    >
      <span className={classNames("rounded-full", styles.dot, size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2")} />
      {status}
    </span>
  );
}
