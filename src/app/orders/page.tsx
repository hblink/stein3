import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { OrderList } from "@/components/orders/OrderList";

export const dynamic = "force-dynamic";

async function getOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch orders:", error.message);
    return [];
  }

  return data;
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <main className="min-h-screen bg-charcoal">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold/3 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-sage/3 blur-[120px]" />
      </div>
      <div className="absolute inset-0 grain-overlay" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-cream/40 hover:text-gold transition-colors text-sm font-body mb-8"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-gold"
              >
                <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
            </div>
            <h1
              className="text-4xl md:text-5xl font-display text-cream"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your Orders
            </h1>
          </div>

          <p className="text-cream/50 font-body max-w-lg">
            Track your handcrafted pieces from our studio to your doorstep. Every
            order carries the care of our artisans.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 rounded-full bg-cream/5 flex items-center justify-center mx-auto mb-8">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-cream/15"
              >
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </div>
            <h2
              className="text-2xl font-display text-cream/60 mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              No Orders Yet
            </h2>
            <p className="text-cream/30 font-body mb-8 max-w-sm mx-auto">
              Your handcrafted journey begins here. Explore our collection or
              design your own piece.
            </p>
            <Link
              href="/#collection"
              className="inline-flex px-8 py-3.5 rounded-full bg-gold text-charcoal font-semibold tracking-wider uppercase text-sm hover:bg-gold-light transition-all hover:shadow-[0_0_30px_rgba(201,169,110,0.4)]"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <OrderList orders={orders} />
        )}
      </div>
    </main>
  );
}
