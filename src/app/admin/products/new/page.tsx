"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { ArrowLeft, Save } from "lucide-react";
import type { Category, ProductType } from "@/lib/types";
import { PRODUCT_TYPE_LABELS } from "@/lib/types";
import { productSchema } from "@/lib/validation";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    compare_price: "",
    category_id: "",
    material: "",
    type: "",
    images: [] as string[],
    in_stock: true,
    featured: false,
    sort_order: 0,
  });

  useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient();
      const { data } = await supabase.from("categories").select("*").order("name");
      setCategories(data || []);
    }
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else if (type === "number") {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData({ ...formData, slug });
  };

  const handleImagesChange = (images: string[]) => {
    setFormData({ ...formData, images });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.from("products").insert([
      {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        price: parseFloat(formData.price),
        compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
        category_id: formData.category_id || null,
        material: formData.material || null,
        type: formData.type,
        images: formData.images,
        in_stock: formData.in_stock,
        featured: formData.featured,
        sort_order: formData.sort_order,
      },
    ] as any);

    if (error) {
      alert("Error creating product: " + error.message);
    } else {
      router.push("/admin/products");
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/products")}
          className="p-2 rounded-xl glass hover-glow"
        >
          <ArrowLeft size={20} className="text-cream/60" />
        </button>
        <div>
          <h1 className="text-3xl font-display text-cream" style={{ fontFamily: "var(--font-display)" }}>
            Add New Product
          </h1>
          <p className="text-cream/40 font-body">Create a new product for your store</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass rounded-3xl p-6">
          <h2 className="text-lg font-display text-cream mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Basic Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-cream/60 text-sm font-body mb-2">Product Name *</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Golden Sunrise Necklace"
                required
              />
            </div>
            <div>
              <label className="block text-cream/60 text-sm font-body mb-2">Slug *</label>
              <Input
                name="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g., golden-sunrise-necklace"
                required
              />
              <p className="text-cream/30 text-xs mt-1 font-body">URL-friendly identifier</p>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-cream/60 text-sm font-body mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe this beautiful piece..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-cream/5 border border-cream/10 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/30 font-body resize-none"
            />
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="text-lg font-display text-cream mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Pricing & Inventory
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-cream/60 text-sm font-body mb-2">Price *</label>
              <Input
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="85.00"
                required
              />
            </div>
            <div>
              <label className="block text-cream/60 text-sm font-body mb-2">Compare Price</label>
              <Input
                name="compare_price"
                type="number"
                step="0.01"
                value={formData.compare_price}
                onChange={handleInputChange}
                placeholder="120.00"
              />
            </div>
            <div>
              <label className="block text-cream/60 text-sm font-body mb-2">Stock Status</label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="in_stock"
                  checked={formData.in_stock}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded bg-cream/5 border border-cream/20 text-gold focus:ring-gold/30"
                />
                <span className="text-cream/80 font-body">In Stock</span>
              </label>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="text-lg font-display text-cream mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Product Details
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-cream/60 text-sm font-body mb-2">Category</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-cream/5 border border-cream/10 text-cream font-body focus:outline-none focus:border-gold/30"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-cream/60 text-sm font-body mb-2">Product Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-cream/5 border border-cream/10 text-cream font-body focus:outline-none focus:border-gold/30"
              >
                <option value="">Select type</option>
                {Object.entries(PRODUCT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-cream/60 text-sm font-body mb-2">Material</label>
              <Input
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                placeholder="e.g., 14k Gold Plated"
              />
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="text-lg font-display text-cream mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Product Images
          </h2>
          <ImageUpload images={formData.images} onChange={handleImagesChange} />
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="text-lg font-display text-cream mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Publishing
          </h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="w-5 h-5 rounded bg-cream/5 border border-cream/20 text-gold focus:ring-gold/30"
              />
              <div>
                <span className="text-cream/80 font-body">Featured Product</span>
                <p className="text-cream/40 text-sm font-body">Show on homepage and featured collections</p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="px-6 py-3 rounded-xl border border-cream/15 text-cream/70 font-body hover:border-cream/30 transition-colors"
          >
            Cancel
          </button>
          <Button type="submit" size="lg" disabled={loading}>
            <Save size={18} />
            {loading ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}