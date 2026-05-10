"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";
import type { Profile } from "@/lib/types";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchData() {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("is_admin", false)
      .order("created_at", { ascending: false });
    setCustomers((data as any) || []);
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

  const filteredCustomers = customers.filter((customer) =>
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display text-cream mb-2" style={{ fontFamily: "var(--font-display)" }}>
          Customers
        </h1>
        <p className="text-cream/40 font-body">
          View and manage customer accounts
        </p>
      </div>

      <div className="glass rounded-3xl p-5 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30" size={18} />
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-cream/5 border border-cream/10 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/30 font-body"
          />
        </div>
      </div>

      {loading ? (
        <div className="glass rounded-3xl p-8 text-center text-cream/40 font-body">
          Loading customers...
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="glass rounded-3xl p-8 text-center">
          <p className="text-cream/40 font-body">
            {searchQuery ? "No customers match your filters" : "No customers yet"}
          </p>
        </div>
      ) : (
        <div className="glass rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-cream/10">
                <tr className="text-left">
                  <th className="px-6 py-4 text-xs tracking-widest text-cream/40 uppercase font-body">Name</th>
                  <th className="px-6 py-4 text-xs tracking-widest text-cream/40 uppercase font-body">Email</th>
                  <th className="px-6 py-4 text-xs tracking-widest text-cream/40 uppercase font-body">Phone</th>
                  <th className="px-6 py-4 text-xs tracking-widest text-cream/40 uppercase font-body">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-cream/5 last:border-0 hover:bg-cream/2">
                    <td className="px-6 py-4 text-cream/90 font-body font-medium">
                      {customer.full_name || "Unnamed"}
                    </td>
                    <td className="px-6 py-4 text-cream/60 font-body">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 text-cream/60 font-body">
                      {customer.phone || "—"}
                    </td>
                    <td className="px-6 py-4 text-cream/60 font-body">
                      {new Date(customer.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}