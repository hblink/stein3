import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="bg-charcoal min-h-screen py-24">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="text-cream/40 hover:text-gold text-sm font-body mb-8 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-display text-cream mb-8" style={{ fontFamily: "var(--font-display)" }}>
          Terms of Service
        </h1>
        
        <div className="glass rounded-3xl p-8 space-y-6 text-cream/80 font-body">
          <p>Welcome to Lumière. By using our website, you agree to these terms.</p>
          
          <h2 className="text-xl font-display text-cream pt-4" style={{ fontFamily: "var(--font-display)" }}>
            Products and Orders
          </h2>
          <p>All products are handcrafted with sustainable materials. Due to the handmade nature, slight variations may occur.</p>
          
          <h2 className="text-xl font-display text-cream pt-4" style={{ fontFamily: "var(--font-display)" }}>
            Shipping and Delivery
          </h2>
          <p>We ship worldwide with carbon-neutral shipping. Estimated delivery: 2-3 weeks for handcrafted pieces.</p>
          
          <h2 className="text-xl font-display text-cream pt-4" style={{ fontFamily: "var(--font-display)" }}>
            Returns and Exchanges
          </h2>
          <p>We accept returns within 30 days of delivery. Custom pieces are final sale.</p>
          
          <p className="text-cream/40 text-sm pt-4">Last updated: May 2026</p>
        </div>
      </div>
    </div>
  );
}