"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Modal";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import type { Category } from "@/lib/types";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchData() {
    const supabase = createClient();
    const { data } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
    setCategories(data || []);
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

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleDelete() {
    if (!categoryToDelete) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("categories").delete().eq("id", categoryToDelete.id);
    setCategories(categories.filter((c) => c.id !== categoryToDelete.id));
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
    setDeleting(false);
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-cream mb-2" style={{ fontFamily: "var(--font-display)" }}>
            Categories
          </h1>
          <p className="text-cream/40 font-body">
            Organize your products into collections
          </p>
        </div>
        <Link href="/admin/categories/new">
          <Button size="lg" className="font-bold tracking-wider">
            <Plus size={18} />
            Add New Category
          </Button>
        </Link>
      </div>

      <div className="glass rounded-3xl p-5 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30" size={18} />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-cream/5 border border-cream/10 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/30 font-body"
          />
        </div>
      </div>

      {loading ? (
        <div className="glass rounded-3xl p-8 text-center text-cream/40 font-body">
          Loading categories...
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="glass rounded-3xl p-8 text-center">
          <p className="text-cream/40 font-body mb-4">
            {searchQuery ? "No categories match your filters" : "No categories yet"}
          </p>
          {!searchQuery && (
            <Link href="/admin/categories/new">
              <Button>Add Your First Category</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="glass rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-cream/10">
                <tr className="text-left">
                  <th className="px-6 py-4 text-xs tracking-widest text-cream/40 uppercase font-body">Category</th>
                  <th className="px-6 py-4 text-xs tracking-widest text-cream/40 uppercase font-body">Description</th>
                  <th className="px-6 py-4 text-xs tracking-widest text-cream/40 uppercase font-body">Sort Order</th>
                  <th className="px-6 py-4 text-xs tracking-widest text-cream/40 uppercase font-body">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b border-cream/5 last:border-0 hover:bg-cream/2">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {category.image_url ? (
                          <div className="w-12 h-12 rounded-xl overflow-hidden relative">
                            <Image src={category.image_url} alt={category.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-cream/5 flex items-center justify-center">
                            <span className="text-cream/20 font-display text-lg" style={{ fontFamily: "var(--font-display)" }}>
                              {category.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <p className="text-cream/90 font-body font-medium">{category.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-cream/60 font-body max-w-xs truncate">
                      {category.description || "No description"}
                    </td>
                    <td className="px-6 py-4 text-cream/60 font-body">
                      {category.sort_order}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/categories/${category.id}/edit`}>
                          <Button variant="ghost" size="sm" className="px-3">
                            <Edit size={16} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="px-3 text-terracotta hover:text-terracotta-light hover:bg-terracotta/10"
                          onClick={() => {
                            setCategoryToDelete(category);
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
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Category"
        loading={deleting}
        danger
      />
    </div>
  );
}