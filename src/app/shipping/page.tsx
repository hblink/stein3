import Link from "next/link";

export default function ShippingPage() {
  return (
    <div className="bg-charcoal min-h-screen py-24">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="text-cream/40 hover:text-gold text-sm font-body mb-8 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-display text-cream mb-8" style={{ fontFamily: "var(--font-display)" }}>
          Shipping Information
        </h1>
        
        <div className="glass rounded-3xl p-8 space-y-6 text-cream/80 font-body">
          <h2 className="text-xl font-display text-cream" style={{ fontFamily: "var(--font-display)" }}>
            Processing Time
          </h2>
          <p>All pieces are handcrafted to order. Please allow 1-2 weeks for creation before shipping.</p>
          
          <h2 className="text-xl font-display text-cream pt-4" style={{ fontFamily: "var(--font-display)" }}>
            Shipping Methods
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Standard Shipping (5-7 business days) - $8</li>
            <li>Express Shipping (2-3 business days) - $15</li>
            <li>Carbon-neutral shipping on all orders</li>
          </ul>
          
          <h2 className="text-xl font-display text-cream pt-4" style={{ fontFamily: "var(--font-display)" }}>
            International Shipping
          </h2>
          <p>We ship worldwide. International orders may be subject to customs fees.</p>
          
          <h2 className="text-xl font-display text-cream pt-4" style={{ fontFamily: "var(--font-display)" }}>
            Tracking
          </h2>
          <p>All orders include tracking. You&apos;ll receive an email with your tracking number when your order ships.</p>
        </div>
      </div>
    </div>
  );
}