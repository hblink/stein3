"use client";

import { type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { classNames } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-body tracking-wider uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gold text-charcoal hover:bg-gold-light hover:shadow-[0_0_30px_rgba(201,169,110,0.4)]",
    secondary:
      "border border-cream/15 text-cream/70 hover:border-gold/40 hover:text-cream",
    danger:
      "bg-terracotta text-cream hover:bg-terracotta-light",
    ghost:
      "text-cream/50 hover:text-cream hover:bg-cream/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-sm",
  };

  return (
    <button
      className={classNames(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
