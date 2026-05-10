"use client";

import { useState, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative ${maxWidth} w-full glass rounded-3xl p-8 animate-scale-in`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-xl font-display text-cream"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-cream/30 hover:text-cream/60 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  danger?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  loading,
  danger,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-cream/60 font-body mb-8 leading-relaxed">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-6 py-2.5 rounded-full border border-cream/15 text-cream/70 text-sm tracking-wider uppercase font-body hover:border-cream/30 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`px-6 py-2.5 rounded-full text-sm tracking-wider uppercase font-body transition-all disabled:opacity-50 ${
            danger
              ? "bg-terracotta text-cream hover:bg-terracotta-light"
              : "bg-gold text-charcoal hover:bg-gold-light"
          }`}
        >
          {loading ? "Processing..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
