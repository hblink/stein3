"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { signupSchema, type SignupFormData } from "@/lib/validation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<SignupFormData>({
    email: "",
    password: "",
    full_name: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const result = signupSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    if (!supabase) {
      setError("Unable to connect to authentication service");
      setLoading(false);
      return;
    }
    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.full_name },
      },
    });

    if (authError) {
      setError(
        authError.message.includes("already registered")
          ? "This email is already registered. Try signing in instead."
          : authError.message
      );
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <main className="min-h-screen bg-charcoal flex items-center justify-center px-6">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gold/3 blur-[150px]" />
        </div>
        <div className="absolute inset-0 grain-overlay" />

        <div className="relative z-10 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sage">
              <path d="M5 12l5 5L20 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-display text-cream mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Check Your Email
          </h1>
          <p className="text-cream/50 font-body mb-8">
            We&apos;ve sent a confirmation link to <span className="text-gold">{form.email}</span>.
            Click the link to verify your account, then sign in.
          </p>
          <Link
            href="/login"
            className="inline-flex px-8 py-3.5 rounded-full bg-gold text-charcoal font-semibold tracking-wider uppercase text-sm hover:bg-gold-light transition-all"
          >
            Go to Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-charcoal flex items-center justify-center px-6">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gold/3 blur-[150px]" />
      </div>
      <div className="absolute inset-0 grain-overlay" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full border border-gold/60 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gold/80" />
            </div>
            <span className="font-display text-xl tracking-widest text-cream uppercase" style={{ fontFamily: "var(--font-display)" }}>
              Lumière
            </span>
          </Link>
          <h1 className="text-3xl font-display text-cream mb-2" style={{ fontFamily: "var(--font-display)" }}>
            Create Account
          </h1>
          <p className="text-cream/50 font-body text-sm">
            Join us to track orders and build your collection
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-5">
          {error && (
            <div className="bg-terracotta/10 border border-terracotta/30 rounded-xl px-4 py-3 text-terracotta-light text-sm font-body">
              {error}
            </div>
          )}

          <div>
            <label className="text-cream/50 text-xs tracking-widest uppercase mb-2 block font-body">
              Full Name
            </label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-cream/5 border border-cream/10 text-cream font-body placeholder:text-cream/20 focus:outline-none focus:border-gold/40 transition-colors"
              placeholder="Your name"
              autoComplete="name"
            />
          </div>

          <div>
            <label className="text-cream/50 text-xs tracking-widest uppercase mb-2 block font-body">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-cream/5 border border-cream/10 text-cream font-body placeholder:text-cream/20 focus:outline-none focus:border-gold/40 transition-colors"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-cream/50 text-xs tracking-widest uppercase mb-2 block font-body">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-cream/5 border border-cream/10 text-cream font-body placeholder:text-cream/20 focus:outline-none focus:border-gold/40 transition-colors pr-12"
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/60 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-gold text-charcoal font-semibold tracking-wider uppercase text-sm hover:bg-gold-light transition-all hover:shadow-[0_0_30px_rgba(201,169,110,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? "Creating account..." : "Create Account"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="text-center text-cream/40 font-body text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-gold hover:text-gold-light transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
