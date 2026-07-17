"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { FileText, Loader2, Search, SendHorizontal } from "lucide-react";
import Link from "next/link";

interface RFQItem {
  id: string; title: string; description?: string; status: string; quantity: number;
  unit?: string; target_price?: number; notes?: string; created_at: string;
  category?: { id: string; name: string };
  buyer?: { id: string; username: string };
  quotes?: { id: string; amount: number; status: string; seller_id: string }[];
}

export default function RFQMarketPage() {
  const [rfqs, setRfqs] = useState<RFQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [filterCat, setFilterCat] = useState("");

  useEffect(() => {
    apiClient.get("/products/categories").then((res) => setCategories(res.data.results || [])).catch(() => {});
  }, []);

  function loadRFQs() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterCat) params.set("category", filterCat);
    if (search) params.set("search", search);
    apiClient.get(`/procurement/rfqs/market?${params}`).then((res) => setRfqs(res.data.results || [])).catch(() => {}).finally(() => setLoading(false));
  }

  useEffect(() => { loadRFQs(); }, [filterCat]);

  return (
    <div className="min-h-screen bg-[#F5F3EF] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#1E1E1E] sm:text-3xl">RFQ Marketplace</h1>
            <p className="mt-1 text-sm text-[#6B6B6B]">Browse buyer requests and submit competitive quotes to win orders.</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadRFQs()}
              className="block w-full rounded-lg border border-[#D8D3CC] bg-white py-2.5 pl-10 pr-3 text-sm text-[#1E1E1E] outline-none focus:border-[#4F7A57]"
              placeholder="Search RFQs..." />
          </div>
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
            className="rounded-lg border border-[#D8D3CC] bg-white px-3 py-2.5 text-sm text-[#1E1E1E] outline-none focus:border-[#4F7A57]">
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button onClick={loadRFQs} className="rounded-md bg-[#1E1E1E] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2A2A2A]">Search</button>
        </div>

        {loading ? (
          <div className="mt-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#4F7A57]" /></div>
        ) : rfqs.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-[#D8D3CC] bg-white p-12 text-center shadow-sm">
            <FileText className="mx-auto h-12 w-12 text-[#D8D3CC]" />
            <p className="mt-4 text-sm font-medium text-[#1E1E1E]">No open RFQs found</p>
            <p className="mt-1 text-xs text-[#6B6B6B]">Check back later or adjust your search filters.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {rfqs.map((rfq) => (
              <Link key={rfq.id} href={`/rfq/${rfq.id}`}
                className="block rounded-xl border border-[#D8D3CC] bg-white p-5 shadow-sm transition-colors hover:border-[#4F7A57]">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-[#1E1E1E]">{rfq.title}</h3>
                      {rfq.quotes && rfq.quotes.length > 0 && (
                        <span className="rounded-full bg-[#4F7A57]/10 px-2 py-0.5 text-xs font-medium text-[#4F7A57]">{rfq.quotes.length} quote{rfq.quotes.length !== 1 ? "s" : ""}</span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#6B6B6B]">
                      {rfq.category && <span>{rfq.category.name}</span>}
                      <span>Qty: {rfq.quantity}{rfq.unit ? ` ${rfq.unit}` : ""}</span>
                      {rfq.target_price != null && rfq.target_price > 0 && <span>Target: ${Number(rfq.target_price).toFixed(2)}</span>}
                      <span>Posted {new Date(rfq.created_at).toLocaleDateString()}</span>
                    </div>
                    {rfq.description && <p className="mt-2 text-xs text-[#6B6B6B] line-clamp-2">{rfq.description}</p>}
                  </div>
                  <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Open</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
