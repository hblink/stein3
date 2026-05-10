export type OrderStatus =
  | "pending"
  | "confirmed"
  | "crafting"
  | "shipped"
  | "delivered"
  | "cancelled";

export type ProductType = "necklace" | "bracelet" | "earring" | "ring" | "other";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  products?: Product[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  category_id: string | null;
  category?: Category;
  material: string | null;
  type: ProductType | null;
  images: string[];
  in_stock: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  material: string | null;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer?: Profile;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  shipping_address: string | null;
  tracking_number: string | null;
  estimated_delivery: string | null;
  delivered_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  status_history?: OrderStatusHistory[];
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  note: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Setting {
  key: string;
  value: unknown;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  table_name: string;
  record_id: string | null;
  old_data: unknown;
  new_data: unknown;
  created_at: string;
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  material: string | null;
  image: string | null;
  slug: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Category, "id" | "created_at" | "updated_at">>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Product, "id" | "created_at" | "updated_at">>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Order, "id" | "created_at" | "updated_at">>;
      };
      order_status_history: {
        Row: OrderStatusHistory;
        Insert: Omit<OrderStatusHistory, "id" | "created_at">;
        Update: Partial<Omit<OrderStatusHistory, "id" | "created_at">>;
      };
      settings: {
        Row: Setting;
        Insert: Omit<Setting, "updated_at">;
        Update: Partial<Omit<Setting, "key" | "updated_at">>;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, "id" | "created_at">;
        Update: never;
      };
    };
  };
}

export const STATUS_STEPS: OrderStatus[] = [
  "pending",
  "confirmed",
  "crafting",
  "shipped",
  "delivered",
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  crafting: "Handcrafting",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  pending: "We've received your order",
  confirmed: "Your order has been confirmed",
  crafting: "Our artisans are crafting your piece",
  shipped: "Your piece is on its way",
  delivered: "Your piece has arrived",
  cancelled: "This order has been cancelled",
};

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  necklace: "Necklace",
  bracelet: "Bracelet",
  earring: "Earring",
  ring: "Ring",
  other: "Other",
};
