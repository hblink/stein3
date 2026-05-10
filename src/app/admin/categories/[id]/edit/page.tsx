"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { ArrowLeft, Save } from "lucide-react";
import type { Category } from "@/lib/types";

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    sort_order: 0,
  });

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data } = await supabase.from("categories").select("*").eq("id", params.id);
      if (data && data.length > 0) {
        const c = data[0] as any;
        setFormData({
          name: c.name,
          slug: c.slug,
          description: c.description || "",
          image_url: c.image_url || "",
          sort_order: c.sort_order,
        });
      }
    }
    fetchData();
  }, [params.id]);

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
    const { error } = await supabase.from("categories").update({
      name: formData.name,
      slug: formData.slug,
      description: formData.description || null,
      image_url: formData.image_url || null,
      sort_order: formData.sort_order,
    }).eq("id", params.id);

    if (error) {
      alert("Error updating category: " + error.message);
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
            Edit Category
          </h1>
          <p className="text-cream/40 font-body">Update category details</p>
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
            />
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
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}