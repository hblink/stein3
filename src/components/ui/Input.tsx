"use client";

import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export function Input({
  label,
  error,
  helper,
  className = "",
  id,
  ...props
}: InputProps) {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="text-cream/50 text-xs tracking-widest uppercase mb-2 block font-body"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-3 rounded-xl bg-cream/5 border text-cream font-body placeholder:text-cream/20 focus:outline-none transition-colors ${
          error
            ? "border-terracotta focus:border-terracotta"
            : "border-cream/10 focus:border-gold/40"
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-terracotta-light text-xs font-body">{error}</p>
      )}
      {helper && !error && (
        <p className="mt-1 text-cream/30 text-xs font-body">{helper}</p>
      )}
    </div>
  );
}
