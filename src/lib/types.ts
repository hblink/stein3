export type OrderStatus =
  | "pending"
  | "confirmed"
  | "crafting"
  | "shipped"
  | "delivered";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  material: string;
  image_url?: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  created_at: string;
  estimated_delivery: string;
  delivered_at: string | null;
  customer_id: string;
  tracking_number: string | null;
  shipping_address: string;
}

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at">;
        Update: Partial<Omit<Order, "id">>;
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
};

export const STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  pending: "We've received your order",
  confirmed: "Your order has been confirmed",
  crafting: "Our artisans are crafting your piece",
  shipped: "Your piece is on its way",
  delivered: "Your piece has arrived",
};
