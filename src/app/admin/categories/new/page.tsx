"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { ArrowLeft, Save } from "lucide-react";

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    sort_order: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImagesChange = (images: string[]) => {
    setFormData({ ...formData, image_url: images[0] || "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient() as any;
    const { error } = await supabase.from("categories").insert({
      name: formData.name,
      slug: formData.slug,
      description: formData.description || null,
      image_url: formData.image_url || null,
      sort_order: formData.sort_order,
    });

    if (error) {
      alert("Error creating category: " + error.message);
    } else {
      router.push("/admin/categories");
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/categories")}
          className="p-2 rounded-xl glass hover-glow"
        >
          <ArrowLeft size={20} className="text-cream/60" />
        </button>
        <div>
          <h1 className="text-3xl font-display text-cream" style={{ fontFamily: "var(--font-display)" }}>
            Add New Category
          </h1>
          <p className="text-cream/40 font-body">Create a new product collection</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass rounded-3xl p-6">
          <h2 className="text-lg font-display text-cream mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Basic Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-cream/60 text-sm font-body mb-2">Category Name *</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Necklaces"
                required
              />
            </div>
            <div>
              <label className="block text-cream/60 text-sm font-body mb-2">Slug *</label>
              <Input
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="e.g., necklaces"
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
              placeholder="Describe this collection..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-cream/5 border border-cream/10 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/30 font-body resize-none"
            />
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="text-lg font-display text-cream mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Category Image
          </h2>
          <ImageUpload images={formData.image_url ? [formData.image_url] : []} onChange={handleImagesChange} />
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="text-lg font-display text-cream mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Display Settings
          </h2>
          <div>
            <label className="block text-cream/60 text-sm font-body mb-2">Sort Order</label>
            <Input
              name="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={handleInputChange}
              placeholder="0"
            />
            <p className="text-cream/30 text-xs mt-1 font-body">Lower numbers appear first</p>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push("/admin/categories")}
            className="px-6 py-3 rounded-xl border border-cream/15 text-cream/70 font-body hover:border-cream/30 transition-colors"
          >
            Cancel
          </button>
          <Button type="submit" size="lg" disabled={loading}>
            <Save size={18} />
            {loading ? "Creating..." : "Create Category"}
          </Button>
        </div>
      </form>
    </div>
  );
}