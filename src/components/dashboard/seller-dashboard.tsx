"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/stores/auth-store";
import {
  ArrowRight, BarChart3, CheckCircle2, CreditCard, DollarSign, Edit, Eye,
  FileText, Image, Loader2, MessageSquare, Package, PackagePlus, Plus,
  ShieldCheck, ShoppingCart, Store, Trash2, Upload, X,
} from "lucide-react";
import Link from "next/link";

type Tab = "overview" | "products" | "orders" | "rfqs";

interface DashboardStats {
  total_products: number; total_orders: number; pending_orders: number;
  active_shipments: number; total_revenue: number;
}

interface Product {
  id: string; name: string; price: number; stock: number; status: string;
  category_id?: string; images?: { id: string; url: string; is_primary: boolean }[];
  category?: { id?: string; name: string }; created_at: string;
}

interface OrderItem {
  id: string; order_number: string; status: string;
  total_amount: number; created_at: string; buyer?: { username: string };
}

interface RFQItem {
  id: string; title: string; status: string; notes: string;
  buyer?: { username: string; email: string };
  quotes?: { id: string; amount: number; status: string; seller_id: string }[];
  created_at: string;
}

const tabs: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "products", label: "Products" },
  { key: "orders", label: "Orders" },
  { key: "rfqs", label: "RFQs" },
];

export function SellerDashboard() {
  const user = useAuthStore((state) => state.user);
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [rfqs, setRfqs] = useState<RFQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({ name: "", description: "", price: "", stock: "", category_id: "", moq: "", tags: "" });
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [newProductId, setNewProductId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [quoteAmounts, setQuoteAmounts] = useState<Record<string, string>>({});

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, prodRes, ordersRes, catRes, rfqRes] = await Promise.all([
        apiClient.get("/seller/dashboard"),
        apiClient.get("/products/my/list"),
        apiClient.get("/orders"),
        apiClient.get("/products/categories"),
        apiClient.get("/procurement/rfqs"),
      ]);
      setStats(statsRes.data);
      setProducts(prodRes.data.results || []);
      setOrders(ordersRes.data.results || []);
      setCategories(catRes.data.results || []);
      setRfqs(rfqRes.data.results || []);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: productForm.name, description: productForm.description,
        price: parseFloat(productForm.price) || 0, stock: parseInt(productForm.stock) || 0,
        category_id: productForm.category_id, moq: parseInt(productForm.moq) || 1, tags: productForm.tags,
      };
      let pid: string;
      if (editingProduct) {
        await apiClient.put(`/products/${editingProduct.id}`, payload);
        pid = editingProduct.id;
      } else {
        const res = await apiClient.post("/products", payload);
        pid = res.data.id;
      }
      if (uploadFiles.length > 0) {
        setUploading(true);
        for (const file of uploadFiles) {
          const fd = new FormData();
          fd.append("image", file);
          await apiClient.post(`/products/${pid}/images`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        }
        setUploadFiles([]);
        setUploading(false);
      }
      setShowProductForm(false);
      setEditingProduct(null);
      setNewProductId(null);
      setProductForm({ name: "", description: "", price: "", stock: "", category_id: "", moq: "", tags: "" });
      fetchData();
    } catch { /* ignore */ }
    setSaving(false);
  }

  function editProduct(p: Product) {
    setEditingProduct(p);
    setNewProductId(p.id);
    setProductForm({
      name: p.name, description: "", price: String(p.price), stock: String(p.stock),
      category_id: p.category_id || p.category?.id || "", moq: "1", tags: "",
    });
    setShowProductForm(true);
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    try { await apiClient.delete(`/products/${id}`); fetchData(); } catch { /* ignore */ }
  }

  async function submitQuote(rfqId: string) {
    const amount = quoteAmounts[rfqId];
    if (!amount) return;
    try {
      await apiClient.post("/procurement/quotes/", { rfq_id: rfqId, amount: parseFloat(amount), notes: "" });
      setQuoteAmounts((prev) => ({ ...prev, [rfqId]: "" }));
      fetchData();
    } catch { /* ignore */ }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#4F7A57]" /></div>;
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-2">
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#4F7A57]/10 px-3 py-1 text-sm font-medium text-[#4F7A57]">
          <Store className="h-4 w-4" /> Seller workspace
        </div>
        <h1 className="mt-2 text-2xl font-semibold text-[#1E1E1E] sm:text-3xl">Hello {user?.username || "Seller"}</h1>
      </section>

      <div className="flex gap-1 rounded-lg bg-[#F5F3EF] p-1 w-fit flex-wrap">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === t.key ? "bg-white text-[#1E1E1E] shadow-sm" : "text-[#6B6B6B] hover:text-[#1E1E1E]"}`}
            type="button">{t.label}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-6">
          {stats && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={Package} label="Total products" value={stats.total_products} />
              <StatCard icon={ShoppingCart} label="Total orders" value={stats.total_orders} />
              <StatCard icon={BarChart3} label="Pending orders" value={stats.pending_orders} />
              <StatCard icon={DollarSign} label="Revenue" value={`$${stats.total_revenue.toFixed(2)}`} />
            </div>
          )}
          <div className="rounded-2xl border border-[#D8D3CC] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E1E1E]">Quick actions</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <button onClick={() => { setEditingProduct(null); setNewProductId(null); setProductForm({ name: "", description: "", price: "", stock: "", category_id: "", moq: "", tags: "" }); setShowProductForm(true); }}
                className="flex items-center gap-3 rounded-lg border border-[#D8D3CC] p-4 text-sm font-medium text-[#1E1E1E] transition-colors hover:bg-[#F5F3EF]" type="button">
                <PackagePlus className="h-5 w-5 text-[#4F7A57]" /> Add new product
              </button>
              <button onClick={() => setTab("rfqs")} className="flex items-center gap-3 rounded-lg border border-[#D8D3CC] p-4 text-sm font-medium text-[#1E1E1E] transition-colors hover:bg-[#F5F3EF]" type="button">
                <MessageSquare className="h-5 w-5 text-[#4F7A57]" /> View RFQs
              </button>
              <button onClick={() => setTab("orders")} className="flex items-center gap-3 rounded-lg border border-[#D8D3CC] p-4 text-sm font-medium text-[#1E1E1E] transition-colors hover:bg-[#F5F3EF]" type="button">
                <Eye className="h-5 w-5 text-[#4F7A57]" /> View orders
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "products" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#6B6B6B]">{products.length} product{products.length !== 1 ? "s" : ""}</p>
            <button onClick={() => { setEditingProduct(null); setNewProductId(null); setProductForm({ name: "", description: "", price: "", stock: "", category_id: "", moq: "", tags: "" }); setShowProductForm(true); }}
              className="inline-flex items-center gap-2 rounded-md bg-[#1E1E1E] px-4 py-2 text-sm font-medium text-white hover:bg-[#2A2A2A]" type="button">
              <Plus className="h-4 w-4" /> Add product
            </button>
          </div>

          {showProductForm && (
            <div className="rounded-2xl border border-[#D8D3CC] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#1E1E1E]">{editingProduct ? "Edit product" : "New product"}</h3>
                <button onClick={() => { setShowProductForm(false); setEditingProduct(null); }} type="button" className="text-[#6B6B6B] hover:text-[#1E1E1E]"><X className="h-5 w-5" /></button>
              </div>
              <form onSubmit={saveProduct} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[#1E1E1E]">Product name</label>
                    <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-[#D8D3CC] px-3 py-2 text-sm outline-none focus:border-[#4F7A57] focus:ring-1 focus:ring-[#4F7A57]" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[#1E1E1E]">Description</label>
                    <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-[#D8D3CC] px-3 py-2 text-sm outline-none focus:border-[#4F7A57] focus:ring-1 focus:ring-[#4F7A57]" rows={2} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1E1E1E]">Price ($)</label>
                    <input type="number" step="0.01" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-[#D8D3CC] px-3 py-2 text-sm outline-none focus:border-[#4F7A57] focus:ring-1 focus:ring-[#4F7A57]" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1E1E1E]">Stock</label>
                    <input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-[#D8D3CC] px-3 py-2 text-sm outline-none focus:border-[#4F7A57] focus:ring-1 focus:ring-[#4F7A57]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1E1E1E]">Category</label>
                    <select value={productForm.category_id} onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-[#D8D3CC] px-3 py-2 text-sm outline-none focus:border-[#4F7A57] focus:ring-1 focus:ring-[#4F7A57]" required>
                      <option value="">Select a category</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1E1E1E]">Min. order qty</label>
                    <input type="number" value={productForm.moq} onChange={(e) => setProductForm({ ...productForm, moq: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-[#D8D3CC] px-3 py-2 text-sm outline-none focus:border-[#4F7A57] focus:ring-1 focus:ring-[#4F7A57]" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[#1E1E1E]">Tags (comma-separated)</label>
                    <input type="text" value={productForm.tags} onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-[#D8D3CC] px-3 py-2 text-sm outline-none focus:border-[#4F7A57] focus:ring-1 focus:ring-[#4F7A57]" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[#1E1E1E]">Product images</label>
                    <div className="mt-1 flex items-center gap-3">
                      <input ref={fileInputRef} type="file" accept="image/*" multiple
                        onChange={(e) => setUploadFiles(Array.from(e.target.files || []))}
                        className="block w-full text-sm text-[#6B6B6B] file:mr-3 file:rounded-md file:border-0 file:bg-[#F5F3EF] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#1E1E1E] hover:file:bg-[#E8E4DE]" />
                    </div>
                    {uploadFiles.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {uploadFiles.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 rounded-md bg-[#F5F3EF] px-3 py-1.5 text-xs text-[#6B6B6B]">
                            <Image className="h-3 w-3" /> {f.name}
                            <button type="button" onClick={() => setUploadFiles(uploadFiles.filter((_, j) => j !== i))} className="text-brand-error hover:text-brand-error/80"><X className="h-3 w-3" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                    {!editingProduct && <p className="mt-1 text-xs text-[#6B6B6B]">Images will be uploaded after the product is created.</p>}
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => { setShowProductForm(false); setEditingProduct(null); setUploadFiles([]); }}
                    className="rounded-md border border-[#D8D3CC] px-4 py-2 text-sm font-medium text-[#6B6B6B] hover:bg-[#F5F3EF]">Cancel</button>
                  <button type="submit" disabled={saving || uploading}
                    className="rounded-md bg-[#1E1E1E] px-4 py-2 text-sm font-medium text-white hover:bg-[#2A2A2A] disabled:opacity-50">
                    {uploading ? "Uploading images..." : saving ? "Saving..." : editingProduct ? "Update product" : "Create product"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {products.length === 0 ? (
            <div className="rounded-2xl border border-[#D8D3CC] bg-white p-12 text-center shadow-sm">
              <Package className="mx-auto h-12 w-12 text-[#D8D3CC]" />
              <p className="mt-4 text-sm font-medium text-[#1E1E1E]">No products yet</p>
              <p className="text-xs text-[#6B6B6B]">Create your first product to start selling.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl border border-[#D8D3CC] bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {p.images && p.images.length > 0 ? (
                      <img src={p.images[0]?.url} alt="" className="h-12 w-12 rounded-lg object-cover border border-[#D8D3CC]" />
                    ) : (
                      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#F5F3EF]"><Image className="h-5 w-5 text-[#D8D3CC]" /></span>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1E1E1E] truncate">{p.name}</p>
                      <p className="text-xs text-[#6B6B6B]">${p.price.toFixed(2)} &middot; {p.stock} in stock &middot; {p.category?.name || "No category"} &middot; {p.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={() => editProduct(p)} type="button" className="rounded-md p-2 text-[#6B6B6B] hover:bg-[#F5F3EF] hover:text-[#4F7A57]"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => deleteProduct(p.id)} type="button" className="rounded-md p-2 text-[#6B6B6B] hover:bg-brand-error/10 hover:text-brand-error"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "orders" && (
        <div className="space-y-4">
          <p className="text-sm text-[#6B6B6B]">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
          {orders.length === 0 ? (
            <div className="rounded-2xl border border-[#D8D3CC] bg-white p-12 text-center shadow-sm">
              <ShoppingCart className="mx-auto h-12 w-12 text-[#D8D3CC]" />
              <p className="mt-4 text-sm font-medium text-[#1E1E1E]">No orders yet</p>
              <p className="text-xs text-[#6B6B6B]">Orders from buyers will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-xl border border-[#D8D3CC] bg-white p-4 shadow-sm">
                  <div>
                    <p className="text-sm font-semibold text-[#1E1E1E]">{o.order_number}</p>
                    <p className="text-xs text-[#6B6B6B]">${o.total_amount.toFixed(2)} &middot; {o.status} &middot; {new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    o.status === "completed" ? "bg-green-100 text-green-700" :
                    o.status === "paid" ? "bg-blue-100 text-blue-700" :
                    o.status === "shipped" ? "bg-purple-100 text-purple-700" : "bg-yellow-100 text-yellow-700"
                  }`}>{o.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "rfqs" && (
        <div className="space-y-4">
          <p className="text-sm text-[#6B6B6B]">{rfqs.length} RFQ{rfqs.length !== 1 ? "s" : ""}</p>
          {rfqs.length === 0 ? (
            <div className="rounded-2xl border border-[#D8D3CC] bg-white p-12 text-center shadow-sm">
              <FileText className="mx-auto h-12 w-12 text-[#D8D3CC]" />
              <p className="mt-4 text-sm font-medium text-[#1E1E1E]">No RFQs yet</p>
              <p className="text-xs text-[#6B6B6B]">Buyer RFQs that match your products will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rfqs.map((rfq) => (
                <div key={rfq.id} className="rounded-xl border border-[#D8D3CC] bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#1E1E1E]">{rfq.title}</p>
                      <p className="text-xs text-[#6B6B6B]">by {rfq.buyer?.username || "Unknown"} &middot; {rfq.status} &middot; {new Date(rfq.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      rfq.status === "accepted" ? "bg-green-100 text-green-700" :
                      rfq.status === "open" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                    }`}>{rfq.status}</span>
                  </div>
                  {rfq.notes && <p className="mt-2 text-xs text-[#6B6B6B]">{rfq.notes}</p>}
                  {rfq.status === "open" && (
                    <div className="mt-3 flex items-center gap-3">
                      <input type="number" step="0.01" placeholder="Your price"
                        value={quoteAmounts[rfq.id] || ""}
                        onChange={(e) => setQuoteAmounts({ ...quoteAmounts, [rfq.id]: e.target.value })}
                        className="w-32 rounded-lg border border-[#D8D3CC] px-3 py-1.5 text-sm outline-none focus:border-[#4F7A57]" />
                      <button onClick={() => submitQuote(rfq.id)} type="button"
                        className="rounded-md bg-[#4F7A57] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#3D6344]">
                        Submit quote
                      </button>
                    </div>
                  )}
                  {rfq.quotes && rfq.quotes.length > 0 && (
                    <div className="mt-3 border-t border-[#D8D3CC] pt-3">
                      <p className="text-xs font-medium text-[#6B6B6B]">Your quotes:</p>
                      {rfq.quotes.map((q) => (
                        <div key={q.id} className="mt-1 flex items-center gap-3 text-xs text-[#1E1E1E]">
                          <span>$<span className="font-semibold">{q.amount.toFixed(2)}</span></span>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            q.status === "accepted" ? "bg-green-100 text-green-700" :
                            q.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                          }`}>{q.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-[#D8D3CC] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5F3EF]"><Icon className="h-5 w-5 text-[#4F7A57]" /></span>
        <div><p className="text-xs text-[#6B6B6B]">{label}</p><p className="text-xl font-semibold text-[#1E1E1E]">{value}</p></div>
      </div>
    </div>
  );
}
