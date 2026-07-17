"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/stores/auth-store";
import { ImagePlus, Loader2, Search, SendHorizontal, X } from "lucide-react";
import Link from "next/link";

export default function CreateRFQPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({ title: "", description: "", category_id: "", target_price: "", quantity: "1", unit: "pieces", notes: "", is_private: false });
  const [submitting, setSubmitting] = useState(false);
  const [suppliers, setSuppliers] = useState<{ id: string; username: string; email: string; business_name?: string }[]>([]);
  const [invited, setInvited] = useState<{ id: string; username: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    apiClient.get("/products/categories").then((res) => setCategories(res.data.results || [])).catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function searchSuppliers(q: string) {
    setSearchTerm(q);
    if (q.length < 2) { setSuppliers([]); return; }
    try {
      const res = await apiClient.get(`/procurement/suppliers?search=${encodeURIComponent(q)}`);
      setSuppliers(res.data.results || []);
    } catch { setSuppliers([]); }
  }

  function toggleInvite(s: { id: string; username: string }) {
    if (invited.find((i) => i.id === s.id)) {
      setInvited(invited.filter((i) => i.id !== s.id));
    } else {
      setInvited([...invited, s]);
    }
    setSuppliers([]);
    setSearchTerm("");
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const newFiles = Array.from(files);
    setImages((prev) => [...prev, ...newFiles]);
    newFiles.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (e) => setPreviews((prev) => [...prev, e.target?.result as string]);
      reader.readAsDataURL(f);
    });
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isAuthenticated) { router.push("/login?next=/rfq/create"); return; }
    setSubmitting(true);
    try {
      const res = await apiClient.post("/procurement/rfqs", {
        title: form.title,
        description: form.description,
        category_id: form.category_id || undefined,
        target_price: parseFloat(form.target_price) || 0,
        quantity: parseInt(form.quantity) || 1,
        unit: form.unit,
        notes: form.notes,
        is_private: form.is_private,
        invited_supplier_ids: form.is_private ? invited.map((i) => i.id) : undefined,
      });

      const rfqId = res.data.id;

      for (const file of images) {
        const fd = new FormData();
        fd.append("image", file);
        await apiClient.post(`/procurement/rfqs/${rfqId}/images`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      router.push(`/rfq/${rfqId}`);
    } catch (e: any) {
      alert(e?.response?.data?.detail || "Failed to create RFQ");
    }
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-[#6B6B6B] hover:text-[#1E1E1E]">&larr; Back to marketplace</Link>
        <h1 className="mt-4 text-2xl font-semibold text-[#1E1E1E] sm:text-3xl">Post an RFQ</h1>
        <p className="mt-1 text-sm text-[#6B6B6B]">Tell suppliers exactly what you need and let them compete to offer the best quote.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-2xl border border-[#D8D3CC] bg-white p-6 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-[#1E1E1E]">Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-[#D8D3CC] px-3 py-2.5 text-sm text-[#1E1E1E] outline-none focus:border-[#4F7A57]" required placeholder="e.g. Looking for 500 units of industrial safety gloves" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1E1E1E]">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-[#D8D3CC] px-3 py-2.5 text-sm text-[#1E1E1E] outline-none focus:border-[#4F7A57]" rows={3} placeholder="Describe specifications, materials, quality requirements, etc." />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1E1E1E]">Images</label>
            <div className="mt-1 flex flex-wrap gap-3">
              {previews.map((p, i) => (
                <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg border border-[#D8D3CC]">
                  <img src={p} alt="" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => fileRef.current?.click()}
                className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-[#D8D3CC] text-[#6B6B6B] hover:border-[#4F7A57] hover:text-[#4F7A57] transition-colors">
                <ImagePlus className="h-6 w-6" />
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
            <p className="mt-1 text-xs text-[#6B6B6B]">Optional. Upload product reference images.</p>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-[#D8D3CC] bg-[#F5F3EF] p-3">
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" checked={form.is_private} onChange={(e) => setForm({ ...form, is_private: e.target.checked })}
                className="peer sr-only" />
              <div className="h-5 w-9 rounded-full bg-[#D8D3CC] after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[#4F7A57] peer-checked:after:translate-x-full"></div>
            </label>
            <div>
              <p className="text-sm font-medium text-[#1E1E1E]">Private RFQ</p>
              <p className="text-xs text-[#6B6B6B]">Only invited suppliers can see and quote on this RFQ</p>
            </div>
          </div>

          {form.is_private && (
            <div ref={searchRef} className="relative">
              <label className="block text-sm font-medium text-[#1E1E1E]">Invite suppliers</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]" />
                <input type="text" value={searchTerm} onChange={(e) => searchSuppliers(e.target.value)} onFocus={() => setShowSearch(true)}
                  className="block w-full rounded-lg border border-[#D8D3CC] py-2.5 pl-10 pr-3 text-sm text-[#1E1E1E] outline-none focus:border-[#4F7A57]"
                  placeholder="Search suppliers by name, email, or business..." />
              </div>
              {showSearch && suppliers.length > 0 && (
                <div className="absolute z-20 mt-1 w-full rounded-lg border border-[#D8D3CC] bg-white shadow-lg">
                  {suppliers.map((s) => (
                    <button key={s.id} type="button" onClick={() => toggleInvite(s)}
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-[#F5F3EF]">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4F7A57]/10 text-xs font-medium text-[#4F7A57]">{s.username?.[0]?.toUpperCase() || "?"}</div>
                      <div>
                        <p className="text-sm font-medium text-[#1E1E1E]">{s.username}{s.business_name ? ` - ${s.business_name}` : ""}</p>
                        <p className="text-xs text-[#6B6B6B]">{s.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {invited.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {invited.map((s) => (
                    <span key={s.id} className="inline-flex items-center gap-1 rounded-full bg-[#4F7A57]/10 px-3 py-1 text-xs font-medium text-[#4F7A57]">
                      {s.username}
                      <button type="button" onClick={() => toggleInvite(s)} className="ml-1 hover:text-red-600"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[#1E1E1E]">Category</label>
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-[#D8D3CC] px-3 py-2.5 text-sm text-[#1E1E1E] outline-none focus:border-[#4F7A57]">
                <option value="">All categories</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E1E1E]">Target price (USD)</label>
              <input type="number" step="0.01" value={form.target_price} onChange={(e) => setForm({ ...form, target_price: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-[#D8D3CC] px-3 py-2.5 text-sm text-[#1E1E1E] outline-none focus:border-[#4F7A57]" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E1E1E]">Quantity *</label>
              <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-[#D8D3CC] px-3 py-2.5 text-sm text-[#1E1E1E] outline-none focus:border-[#4F7A57]" required min="1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E1E1E]">Unit</label>
              <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-[#D8D3CC] px-3 py-2.5 text-sm text-[#1E1E1E] outline-none focus:border-[#4F7A57]">
                <option value="pieces">Pieces</option>
                <option value="kg">Kilograms</option>
                <option value="tons">Tons</option>
                <option value="liters">Liters</option>
                <option value="meters">Meters</option>
                <option value="boxes">Boxes</option>
                <option value="pallets">Pallets</option>
                <option value="containers">Containers</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1E1E1E]">Additional notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-[#D8D3CC] px-3 py-2.5 text-sm text-[#1E1E1E] outline-none focus:border-[#4F7A57]" rows={2} placeholder="Delivery timeline, payment terms, certification requirements..." />
          </div>
          <button type="submit" disabled={submitting || !form.title || (form.is_private && invited.length === 0)}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#1E1E1E] px-4 text-sm font-medium text-white hover:bg-[#2A2A2A] disabled:opacity-50">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
            {submitting ? "Posting..." : "Post RFQ"}
          </button>
        </form>
      </div>
    </div>
  );
}
