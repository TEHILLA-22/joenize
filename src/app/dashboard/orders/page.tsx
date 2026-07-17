"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { Loader2, Package, ShoppingCart } from "lucide-react";
import Link from "next/link";

interface Order {
  id: string; order_number: string; status: string; total_amount: number;
  currency: string; created_at: string; shipping_address: string;
  items?: { id: string; name: string; quantity: number; unit_price: number; total_price: number }[];
  seller?: { id: string; username: string };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/orders").then((res) => setOrders(res.data.results || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#4F7A57]" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1E1E1E]">Orders</h1>
        <p className="mt-1 text-sm text-[#6B6B6B]">Track your purchases from order to delivery.</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-[#D8D3CC] bg-white p-12 text-center shadow-sm">
          <ShoppingCart className="mx-auto h-12 w-12 text-[#D8D3CC]" />
          <p className="mt-4 text-sm font-medium text-[#1E1E1E]">No orders yet</p>
          <p className="mt-1 text-xs text-[#6B6B6B]">Browse the marketplace and place your first order.</p>
          <Link href="/" className="mt-4 inline-flex rounded-md bg-[#1E1E1E] px-4 py-2 text-sm font-medium text-white hover:bg-[#2A2A2A]">Browse products</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border border-[#D8D3CC] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#1E1E1E]">{o.order_number}</p>
                  <p className="text-xs text-[#6B6B6B]">{o.seller?.username || "Seller"} &middot; {new Date(o.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  o.status === "delivered" || o.status === "completed" ? "bg-green-100 text-green-700" :
                  o.status === "shipped" ? "bg-blue-100 text-blue-700" :
                  o.status === "cancelled" ? "bg-red-100 text-red-700" :
                  o.status === "pending" || o.status === "confirmed" ? "bg-yellow-100 text-yellow-700" :
                  "bg-purple-100 text-purple-700"
                }`}>{o.status}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[#D8D3CC] pt-3">
                <p className="text-xs text-[#6B6B6B]">{o.items?.length || 0} item{(o.items?.length || 0) !== 1 ? "s" : ""}</p>
                <p className="text-sm font-semibold text-[#1E1E1E]">${o.total_amount?.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
