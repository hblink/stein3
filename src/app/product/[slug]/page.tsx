"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase-client";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart-context";
import { Package2, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    (async () => {
      const { slug } = await params;
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("slug", slug)
        .single();
      setProduct(data as Product | null);
      setLoading(false);
    })();
  }, [params]);

  if (loading) {
    return (
      <div className="bg-charcoal min-h-screen flex items-center justify-center">
        <div className="text-cream/40 font-body">Loading piece...</div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      material: product.material,
      image: product.images?.[0] || null,
      slug: product.slug,
    });
  };

  return (
    <div className="bg-charcoal min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="glass rounded-3xl overflow-hidden">
            <div className="relative aspect-square bg-gradient-to-br from-gold/10 to-sage/10">
              {product.images?.[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package2 size={96} className="text-cream/20" />
                </div>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-display text-cream mb-4" style={{ fontFamily: "var(--font-display)" }}>
              {product.name}
            </h1>
            
            {product.material && (
              <p className="text-cream/50 font-body mb-4">{product.material}</p>
            )}

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-display text-gold" style={{ fontFamily: "var(--font-display)" }}>
                {formatPrice(product.price)}
              </span>
              {product.compare_price && (
                <span className="text-cream/30 line-through text-lg">
                  {formatPrice(product.compare_price)}
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-cream/70 font-body leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            <div className="space-y-6">
              <div>
                <label className="text-cream/60 text-sm tracking-wider uppercase mb-3 block font-body">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-full border border-cream/20 text-cream hover:border-gold/40 hover:text-gold transition-all font-body"
                  >
                    -
                  </button>
                  <span className="text-2xl font-display text-cream w-12 text-center" style={{ fontFamily: "var(--font-display)" }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-full border border-cream/20 text-cream hover:border-gold/40 hover:text-gold transition-all font-body"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full sm:w-auto font-bold tracking-wider"
                onClick={handleAddToCart}
              >
                <ShoppingBag size={18} />
                Add to Bag
              </Button>

              {!product.in_stock && (
                <p className="text-terracotta font-body">This piece is currently out of stock</p>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-cream/10">
              <h3 className="text-cream/60 text-sm tracking-wider uppercase mb-3 font-body">
                Details
              </h3>
              <ul className="space-y-2 text-cream/50 font-body">
                <li>• Handcrafted with sustainable materials</li>
                <li>• Each piece is unique with slight variations</li>
                <li>• Packaged in eco-friendly materials</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}