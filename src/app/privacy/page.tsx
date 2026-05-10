import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="bg-charcoal min-h-screen py-24">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="text-cream/40 hover:text-gold text-sm font-body mb-8 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-display text-cream mb-8" style={{ fontFamily: "var(--font-display)" }}>
          Privacy Policy
        </h1>
        
        <div className="glass rounded-3xl p-8 space-y-6 text-cream/80 font-body">
          <p>We respect your privacy and are committed to protecting your personal information.</p>
          
          <h2 className="text-xl font-display text-cream pt-4" style={{ fontFamily: "var(--font-display)" }}>
            Information We Collect
          </h2>
          <p>We collect information you provide directly to us, such as when you create an account, place an order, or contact us.</p>
          
          <h2 className="text-xl font-display text-cream pt-4" style={{ fontFamily: "var(--font-display)" }}>
            How We Use Your Information
          </h2>
          <p>We use your information to process orders, communicate with you, and improve our services.</p>
          
          <h2 className="text-xl font-display text-cream pt-4" style={{ fontFamily: "var(--font-display)" }}>
            Data Security
          </h2>
          <p>We implement appropriate security measures to protect your personal information.</p>
          
          <p className="text-cream/40 text-sm pt-4">Last updated: May 2026</p>
        </div>
      </div>
    </div>
  );
}