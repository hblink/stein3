"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-client";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Search, Package2 } from "lucide-react";
import type { Product, Category } from "@/lib/types";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const [productsResult, categoriesResult] = await Promise.all([
        supabase.from("products").select("*, category:categories(*)").order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("name"),
      ]);
      setProducts(productsResult.data as Product[] || []);
      setCategories(categoriesResult.data as Category[] || []);
      setLoading(false);
    })();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory && product.in_stock;
  });

  return (
    <div className="bg-charcoal min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-display text-cream mb-4" style={{ fontFamily: "var(--font-display)" }}>
            The Collection
          </h1>
          <p className="text-cream/50 font-body max-w-xl mx-auto">
            Handcrafted jewellery made with sustainable materials. Each piece is unique as the story it carries.
          </p>
        </div>

        <div className="glass rounded-2xl p-5 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30" size={18} />
              <input
                type="text"
                placeholder="Search jewellery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-cream/5 border border-cream/10 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/30 font-body"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-xl bg-cream/5 border border-cream/10 text-cream font-body min-w-[180px] focus:outline-none focus:border-gold/30"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-cream/40 font-body">Loading collection...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <Package2 size={48} className="text-cream/20 mx-auto mb-4" />
            <p className="text-cream/40 font-body">No pieces match your selection</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`} className="group">
                <div className="glass rounded-3xl overflow-hidden hover-lift cursor-pointer">
                  <div className="relative aspect-square bg-gradient-to-br from-gold/10 to-sage/10 flex items-center justify-center overflow-hidden">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <Package2 size={64} className="text-cream/20" />
                    )}
                    {product.featured && (
                      <span className="absolute top-4 right-4 px-2 py-1 rounded-full bg-gold/20 text-gold text-xs font-body uppercase tracking-wider">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-display text-cream mb-2" style={{ fontFamily: "var(--font-display)" }}>
                      {product.name}
                    </h3>
                    {product.material && (
                      <p className="text-cream/40 text-sm font-body mb-3">{product.material}</p>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-display text-gold" style={{ fontFamily: "var(--font-display)" }}>
                        {formatPrice(product.price)}
                      </span>
                      {product.compare_price && (
                        <span className="text-cream/30 line-through text-sm">
                          {formatPrice(product.compare_price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}