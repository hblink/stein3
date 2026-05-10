"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-client";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Modal";
import { Edit, Trash2, Plus, Search, Package2 } from "lucide-react";
import type { Product, Category } from "@/lib/types";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchData() {
    const supabase = createClient();
    const [productsResult, categoriesResult] = await Promise.all([
      supabase.from("products").select("*, category:categories(*)").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
    ]);

    setProducts(productsResult.data as Product[] || []);
    setCategories(categoriesResult.data as Category[] || []);
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      try {
        await fetchData();
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  async function handleDelete() {
    if (!productToDelete) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("products").delete().eq("id", productToDelete.id);
    setProducts(products.filter((p) => p.id !== productToDelete.id));
    setDeleteModalOpen(false);
    setProductToDelete(null);
    setDeleting(false);
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-cream mb-2" style={{ fontFamily: "var(--font-display)" }}>
            Products
          </h1>
          <p className="text-cream/40 font-body">
            Manage your jewellery collection
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button size="lg" className="font-bold tracking-wider">
            <Plus size={18} />
            Add New Product
          </Button>
        </Link>
      </div>

      <div className="glass rounded-3xl p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30" size={18} />
            <input
              type="text"
              placeholder="Search products..."
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
        <div className="glass rounded-3xl p-8 text-center text-cream/40 font-body">
          Loading products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="glass rounded-3xl p-8 text-center">
          <p className="text-cream/40 font-body mb-4">
            {searchQuery || selectedCategory ? "No products match your filters" : "No products yet"}
          </p>
          {!searchQuery && !selectedCategory && (
            <Link href="/admin/products/new">
              <Button>Add Your First Product</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="glass rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-cream/10">
                <tr className="text-left">
                  <th className="px-6 py-4 text-xs tracking-widest text-cream/40 uppercase font-body">Product</th>
                  <th className="px-6 py-4 text-xs tracking-widest text-cream/40 uppercase font-body">Category</th>
                  <th className="px-6 py-4 text-xs tracking-widest text-cream/40 uppercase font-body">Price</th>
                  <th className="px-6 py-4 text-xs tracking-widest text-cream/40 uppercase font-body">Status</th>
                  <th className="px-6 py-4 text-xs tracking-widest text-cream/40 uppercase font-body">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-cream/5 last:border-0 hover:bg-cream/2">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          <div className="w-12 h-12 rounded-xl overflow-hidden relative">
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-cream/5 flex items-center justify-center">
                            <Package2 size={20} className="text-cream/20" />
                          </div>
                        )}
                        <div>
                          <p className="text-cream/90 font-body font-medium">{product.name}</p>
                          {product.material && (
                            <p className="text-cream/40 text-sm font-body">{product.material}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-cream/60 font-body">
                      {product.category?.name || "Uncategorized"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-cream/90 font-body">
                        {formatPrice(product.price)}
                        {product.compare_price && (
                          <span className="text-cream/30 line-through text-sm ml-2">
                            {formatPrice(product.compare_price)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        product.in_stock ? "bg-sage/20 text-sage-light" : "bg-terracotta/20 text-terracotta-light"
                      }`}>
                        {product.in_stock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="ghost" size="sm" className="px-3">
                            <Edit size={16} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="px-3 text-terracotta hover:text-terracotta-light hover:bg-terracotta/10"
                          onClick={() => {
                            setProductToDelete(product);
                            setDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Product"
        loading={deleting}
        danger
      />
    </div>
  );
}