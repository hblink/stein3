"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Save } from "lucide-react";

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    store_name: "Lumière",
    store_description: "Handmade sustainable jewellery",
    currency: "USD",
    shipping_free_threshold: 150,
    shipping_rate: 12,
    estimated_delivery_days: 14,
    notifications_email: "",
    store_open: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setSettings({ ...settings, [name]: (e.target as HTMLInputElement).checked });
    } else if (type === "number") {
      setSettings({ ...settings, [name]: parseFloat(value) || 0 });
    } else {
      setSettings({ ...settings, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // In a real app, this would save to the database
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display text-cream mb-2" style={{ fontFamily: "var(--font-display)" }}>
          Settings
        </h1>
        <p className="text-cream/40 font-body">
          Configure your store settings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass rounded-3xl p-6">
          <h2 className="text-lg font-display text-cream mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Store Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-cream/60 text-sm font-body mb-2">Store Name</label>
              <Input
                name="store_name"
                value={settings.store_name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-cream/60 text-sm font-body mb-2">Currency</label>
              <Input
                name="currency"
                value={settings.currency}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-cream/60 text-sm font-body mb-2">Store Description</label>
            <textarea
              name="store_description"
              value={settings.store_description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-cream/5 border border-cream/10 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/30 font-body resize-none"
            />
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="text-lg font-display text-cream mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Shipping
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-cream/60 text-sm font-body mb-2">Free Shipping Threshold</label>
              <Input
                name="shipping_free_threshold"
                type="number"
                value={settings.shipping_free_threshold}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-cream/60 text-sm font-body mb-2">Shipping Rate</label>
              <Input
                name="shipping_rate"
                type="number"
                value={settings.shipping_rate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-cream/60 text-sm font-body mb-2">Estimated Delivery (days)</label>
              <Input
                name="estimated_delivery_days"
                type="number"
                value={settings.estimated_delivery_days}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="text-lg font-display text-cream mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Notifications
          </h2>
          <div>
            <label className="block text-cream/60 text-sm font-body mb-2">Email for Notifications</label>
            <Input
              name="notifications_email"
              type="email"
              value={settings.notifications_email}
              onChange={handleInputChange}
              placeholder="admin@example.com"
            />
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="text-lg font-display text-cream mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Store Status
          </h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="store_open"
              checked={settings.store_open}
              onChange={handleInputChange}
              className="w-5 h-5 rounded bg-cream/5 border border-cream/20 text-gold focus:ring-gold/30"
            />
            <span className="text-cream/80 font-body">Store is Open for Orders</span>
          </label>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={loading}>
            <Save size={18} />
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}