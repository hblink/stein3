import Link from "next/link";

export default function ReturnsPage() {
  return (
    <div className="bg-charcoal min-h-screen py-24">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="text-cream/40 hover:text-gold text-sm font-body mb-8 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-display text-cream mb-8" style={{ fontFamily: "var(--font-display)" }}>
          Returns Policy
        </h1>
        
        <div className="glass rounded-3xl p-8 space-y-6 text-cream/80 font-body">
          <h2 className="text-xl font-display text-cream" style={{ fontFamily: "var(--font-display)" }}>
            Return Window
          </h2>
          <p>We accept returns within 30 days of delivery for a full refund.</p>
          
          <h2 className="text-xl font-display text-cream pt-4" style={{ fontFamily: "var(--font-display)" }}>
            Condition
          </h2>
          <p>Items must be unworn and in original packaging. Custom or personalized pieces are final sale.</p>
          
          <h2 className="text-xl font-display text-cream pt-4" style={{ fontFamily: "var(--font-display)" }}>
            Return Process
          </h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Contact us at returns@lumiere.example.com to initiate a return</li>
            <li>Package your item securely in original packaging</li>
            <li>Use the provided shipping label</li>
            <li>Refund will be processed once we receive the item</li>
          </ol>
          
          <h2 className="text-xl font-display text-cream pt-4" style={{ fontFamily: "var(--font-display)" }}>
            Damaged Items
          </h2>
          <p>If your item arrives damaged, please contact us within 48 hours for a replacement.</p>
        </div>
      </div>
    </div>
  );
}