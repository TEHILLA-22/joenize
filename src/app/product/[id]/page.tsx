"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { imageUrl } from "@/lib/api/uploads";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2, Package, ShoppingCart, ShieldCheck, Store, Truck, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface ProductDetail {
  id: string; name: string; description: string; price: number; currency: string;
  stock: number; moq: number; status: string; tags: string; in_stock: boolean;
  category?: { id: string; name: string };
  seller?: { id: string; username: string; email: string };
  images?: { id: string; url: string; is_primary: boolean }[];
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [placing, setPlacing] = useState(false);
  const [orderDone, setOrderDone] = useState(false);

  useEffect(() => {
    if (!id) return;
    apiClient.get(`/products/${id}`).then((res) => {
      setProduct(res.data);
      setQuantity(Math.max(1, res.data.moq || 1));
    }).catch(() => router.push("/")).finally(() => setLoading(false));
  }, [id, router]);

  async function placeOrder() {
    if (!isAuthenticated) { router.push("/login?next=/product/" + id); return; }
    setPlacing(true);
    try {
      await apiClient.post("/orders", {
        items: [{ product_id: id, quantity }],
        shipping_address: shippingAddress,
        notes: orderNotes,
      });
      setOrderDone(true);
    } catch (e: any) {
      alert(e?.response?.data?.detail || "Order failed");
    }
    setPlacing(false);
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#F5F3EF]"><Loader2 className="h-8 w-8 animate-spin text-[#4F7A57]" /></div>;
  if (!product) return null;

  if (orderDone) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-[#D8D3CC] bg-white p-8 shadow-sm text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#4F7A57]/10"><ShoppingCart className="h-8 w-8 text-[#4F7A57]" /></div>
          <h1 className="mt-6 text-2xl font-semibold text-[#1E1E1E]">Order placed!</h1>
          <p className="mt-2 text-sm text-[#6B6B6B]">Your order has been submitted. The seller will confirm shortly.</p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link href="/dashboard/orders" className="rounded-md bg-[#1E1E1E] px-4 py-2 text-sm font-medium text-white hover:bg-[#2A2A2A]">View orders</Link>
            <Link href="/" className="rounded-md border border-[#D8D3CC] px-4 py-2 text-sm font-medium text-[#6B6B6B] hover:bg-[#F5F3EF]">Continue browsing</Link>
          </div>
        </div>
      </div>
    );
  }

  const mainImage = product.images?.[0]?.url;

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-[#6B6B6B] hover:text-[#1E1E1E]"><ChevronLeft className="h-4 w-4" /> Back to marketplace</Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="aspect-square rounded-2xl border border-[#D8D3CC] bg-white overflow-hidden">
            {mainImage ? (
              <img src={imageUrl(mainImage)} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-[#D8D3CC]"><Package className="h-16 w-16" /></div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              {product.category && (
                <span className="inline-block rounded-full bg-[#F5F3EF] px-3 py-1 text-xs font-medium text-[#6B6B6B]">{product.category.name}</span>
              )}
              <h1 className="mt-2 text-2xl font-semibold text-[#1E1E1E] sm:text-3xl">{product.name}</h1>
              {product.seller && (
                <p className="mt-1 text-sm text-[#6B6B6B]">Sold by <span className="font-medium text-[#1E1E1E]">{product.seller.username}</span></p>
              )}
            </div>

            <div className="rounded-xl border border-[#D8D3CC] bg-white p-5">
              <p className="text-3xl font-bold text-[#1E1E1E]">${product.price?.toFixed(2)} <span className="text-sm font-normal text-[#6B6B6B]">/{product.currency || "USD"}</span></p>
              {product.moq > 0 && <p className="mt-1 text-sm text-[#6B6B6B]">Minimum order: {product.moq} units</p>}
              <div className="mt-3 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${product.in_stock ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${product.in_stock ? "bg-green-500" : "bg-yellow-500"}`} />
                  {product.in_stock ? "In stock" : "Check availability"}
                </span>
                {product.stock > 0 && <span className="text-xs text-[#6B6B6B]">{product.stock} available</span>}
              </div>
            </div>

            {product.description && (
              <div>
                <h3 className="text-sm font-semibold text-[#1E1E1E]">Description</h3>
                <p className="mt-1 text-sm text-[#6B6B6B] whitespace-pre-wrap">{product.description}</p>
              </div>
            )}

            <div className="space-y-4 rounded-xl border border-[#D8D3CC] bg-white p-5">
              <h3 className="text-sm font-semibold text-[#1E1E1E]">Place order</h3>
              <div className="flex items-center gap-3">
                <label className="text-sm text-[#6B6B6B]">Quantity:</label>
                <input type="number" min={product.moq || 1} value={quantity}
                  onChange={(e) => setQuantity(Math.max(product.moq || 1, parseInt(e.target.value) || 1))}
                  className="w-20 rounded-lg border border-[#D8D3CC] px-3 py-2 text-sm text-[#1E1E1E] outline-none focus:border-[#4F7A57]" />
                {product.moq > 0 && <span className="text-xs text-[#6B6B6B]">(min {product.moq})</span>}
              </div>
              <div>
                <label className="block text-sm text-[#6B6B6B]">Shipping address</label>
                <textarea value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-[#D8D3CC] px-3 py-2 text-sm text-[#1E1E1E] outline-none focus:border-[#4F7A57]" rows={2} placeholder="Street, city, country" />
              </div>
              <div>
                <label className="block text-sm text-[#6B6B6B]">Order notes (optional)</label>
                <textarea value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-[#D8D3CC] px-3 py-2 text-sm text-[#1E1E1E] outline-none focus:border-[#4F7A57]" rows={2} placeholder="Any special instructions" />
              </div>
              <div className="flex items-center justify-between border-t border-[#D8D3CC] pt-4">
                <p className="text-lg font-semibold text-[#1E1E1E]">${(product.price * quantity).toFixed(2)}</p>
                <button onClick={placeOrder} disabled={placing || !shippingAddress}
                  className="inline-flex items-center gap-2 rounded-md bg-[#1E1E1E] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#2A2A2A] disabled:opacity-50">
                  {placing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
                  {placing ? "Placing..." : "Buy now"}
                </button>
              </div>
            </div>

            {product.tags && (
              <div className="flex flex-wrap gap-2">
                {product.tags.split(",").map((t: string) => (
                  <span key={t} className="rounded-full bg-[#F5F3EF] px-3 py-1 text-xs text-[#6B6B6B]">{t.trim()}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
