"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-charcoal min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="text-cream/20 mx-auto mb-4" />
          <h2 className="text-2xl font-display text-cream mb-2" style={{ fontFamily: "var(--font-display)" }}>
            Your bag is empty
          </h2>
          <p className="text-cream/40 font-body mb-6">Discover pieces that speak to your story</p>
          <Link href="/shop">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-charcoal min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-display text-cream mb-8" style={{ fontFamily: "var(--font-display)" }}>
          Your Bag
        </h1>

        <div className="glass rounded-3xl overflow-hidden mb-8">
          {items.map((item) => (
            <div key={item.product_id} className="border-b border-cream/5 last:border-0 p-6">
              <div className="flex gap-6">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-gold/10 to-sage/10 flex-shrink-0 relative">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ShoppingBag size={32} className="text-cream/20" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-display text-cream mb-1" style={{ fontFamily: "var(--font-display)" }}>
                    {item.name}
                  </h3>
                  {item.material && (
                    <p className="text-cream/40 text-sm font-body mb-2">{item.material}</p>
                  )}
                  <p className="text-gold font-display" style={{ fontFamily: "var(--font-display)" }}>
                    {formatPrice(item.price)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    className="w-10 h-10 rounded-full border border-cream/20 text-cream hover:border-gold/40 hover:text-gold transition-all"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-cream w-8 text-center font-body">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    className="w-10 h-10 rounded-full border border-cream/20 text-cream hover:border-gold/40 hover:text-gold transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.product_id)}
                  className="ml-4 text-cream/40 hover:text-terracotta transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="glass rounded-3xl p-8 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-cream/60 font-body">Subtotal</span>
            <span className="text-2xl font-display text-cream" style={{ fontFamily: "var(--font-display)" }}>
              {formatPrice(totalPrice)}
            </span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-cream/60 font-body">Shipping</span>
            <span className="text-cream font-body">Calculated at checkout</span>
          </div>
          <div className="border-t border-cream/10 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-cream font-body">Total</span>
              <span className="text-2xl font-display text-gold" style={{ fontFamily: "var(--font-display)" }}>
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Link href="/shop" className="flex-1">
            <Button variant="secondary" className="w-full">
              Continue Shopping
            </Button>
          </Link>
          <Button className="flex-1" size="lg">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}