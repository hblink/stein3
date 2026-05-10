/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "./Button";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
}

export function ImageUpload({ images, onChange, max = 6 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.urls) {
        onChange([...images, ...data.urls].slice(0, max));
      }
    } catch {
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div key={i} className="relative group w-24 h-24 rounded-xl overflow-hidden bg-cream/5 border border-cream/10">
            <img
              src={url}
              alt={`Product image ${i + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-charcoal/80 text-cream/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {images.length < max && (
          <label className="w-24 h-24 rounded-xl border-2 border-dashed border-cream/10 flex flex-col items-center justify-center cursor-pointer hover:border-gold/30 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
            <ImagePlus size={20} className="text-cream/30 mb-1" />
            <span className="text-cream/20 text-[9px] font-body">Add</span>
          </label>
        )}
      </div>
      {uploading && (
        <p className="text-cream/40 text-xs font-body mt-2">Uploading...</p>
      )}
    </div>
  );
}
