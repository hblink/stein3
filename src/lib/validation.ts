import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  compare_price: z.coerce.number().min(0).optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  material: z.string().optional(),
  type: z.enum(["necklace", "bracelet", "earring", "ring", "other"]).optional().nullable(),
  in_stock: z.coerce.boolean().default(true),
  featured: z.coerce.boolean().default(false),
  sort_order: z.coerce.number().int().min(0).default(0),
  images: z.array(z.string()).default([]),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  sort_order: z.coerce.number().int().min(0).default(0),
});

export const orderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "crafting",
  "shipped",
  "delivered",
  "cancelled",
]);

export const updateOrderSchema = z.object({
  status: orderStatusSchema.optional(),
  tracking_number: z.string().optional().nullable(),
  estimated_delivery: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  shipping_address: z.string().optional().nullable(),
});

export const settingsSchema = z.object({
  store_name: z.string().min(1),
  store_description: z.string().optional(),
  currency: z.string().default("USD"),
  shipping_free_threshold: z.coerce.number().min(0).default(150),
  shipping_rate: z.coerce.number().min(0).default(12),
  estimated_delivery_days: z.coerce.number().int().min(1).default(14),
  notifications_email: z.string().email().optional().or(z.literal("")),
  store_open: z.coerce.boolean().default(true),
});

export const checkoutSchema = z.object({
  shipping_address: z.string().min(5, "Please enter a full shipping address"),
  notes: z.string().optional(),
});

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().min(1, "Name is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type UpdateOrderFormData = z.infer<typeof updateOrderSchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
