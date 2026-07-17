"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/stores/auth-store";
import { ChevronLeft, DollarSign, FileText, Loader2, MessageSquare, SendHorizontal, ShieldCheck, User, Lock } from "lucide-react";
import Link from "next/link";

interface RFQDetail {
  id: string; title: string; description?: string; status: string; quantity: number;
  unit?: string; target_price?: number; notes?: string; created_at: string; is_private?: boolean;
  category?: { id: string; name: string };
  buyer?: { id: string; username: string; email: string };
  invitations?: { id: string; supplier?: { id: string; username: string } }[];
  quotes?: { id: string; amount: number; notes: string; status: string; created_at: string; seller?: { id: string; username: string } }[];
}

export default function RFQDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [rfq, setRfq] = useState<RFQDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function loadRFQ() {
    if (!id) return;
    setLoading(true);
    apiClient.get(`/procurement/rfqs/${id}`).then((res) => setRfq(res.data)).catch(() => {}).finally(() => setLoading(false));
  }

  useEffect(() => { loadRFQ(); }, [id]);

  async function submitQuote() {
    setSubmitting(true);
    try {
      await apiClient.post("/procurement/quotes", { rfq_id: id, amount: parseFloat(quoteAmount), notes: quoteNotes });
      alert("Quote submitted successfully!");
      setQuoteAmount("");
      setQuoteNotes("");
      loadRFQ();
    } catch (e: any) {
      alert(e?.response?.data?.detail || "Failed to submit quote");
    }
    setSubmitting(false);
  }

  async function respondToQuote(quoteId: string, action: "accept" | "reject") {
    try {
      await apiClient.patch(`/procurement/quotes/${quoteId}/respond`, { action });
      loadRFQ();
    } catch (e: any) {
      alert(e?.response?.data?.detail || "Action failed");
    }
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#F5F3EF]"><Loader2 className="h-8 w-8 animate-spin text-[#4F7A57]" /></div>;
  if (!rfq) return <div className="flex min-h-screen items-center justify-center bg-[#F5F3EF]"><p className="text-sm text-[#6B6B6B]">RFQ not found</p></div>;

  const isBuyer = user?.id === rfq.buyer?.id;
  const myQuote = rfq.quotes?.find((q) => q.seller?.id === user?.id);
  const canQuote = rfq.status === "open" && !isBuyer && !myQuote;

  return (
    <div className="min-h-screen bg-[#F5F3EF] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href={isBuyer ? "/dashboard" : "/rfq/market"} className="inline-flex items-center gap-1 text-sm text-[#6B6B6B] hover:text-[#1E1E1E]"><ChevronLeft className="h-4 w-4" /> {isBuyer ? "Back to dashboard" : "Back to RFQ market"}</Link>

        <div className="mt-6 rounded-2xl border border-[#D8D3CC] bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {rfq.is_private && <Lock className="h-4 w-4 text-[#6B6B6B]" />}
                <h1 className="text-xl font-semibold text-[#1E1E1E] sm:text-2xl">{rfq.title}</h1>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  rfq.status === "open" ? "bg-green-100 text-green-700" :
                  rfq.status === "accepted" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                }`}>{rfq.status}</span>
                {rfq.is_private && <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">Private</span>}
              </div>
              {rfq.buyer && (
                <p className="mt-1 flex items-center gap-1 text-xs text-[#6B6B6B]">
                  <User className="h-3 w-3" /> Posted by {rfq.buyer.username}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            {rfq.category && <span className="rounded-md bg-[#F5F3EF] px-2.5 py-1 text-xs text-[#6B6B6B]">{rfq.category.name}</span>}
            <span className="text-[#6B6B6B]"><strong className="text-[#1E1E1E]">Quantity:</strong> {rfq.quantity}{rfq.unit ? ` ${rfq.unit}` : ""}</span>
            {rfq.target_price != null && rfq.target_price > 0 && <span className="text-[#6B6B6B]"><strong className="text-[#1E1E1E]">Target price:</strong> ${Number(rfq.target_price).toFixed(2)}</span>}
            <span className="text-[#6B6B6B]"><strong className="text-[#1E1E1E]">Posted:</strong> {new Date(rfq.created_at).toLocaleDateString()}</span>
          </div>

          {rfq.description && (
            <div className="mt-4 border-t border-[#D8D3CC] pt-4">
              <h3 className="text-sm font-semibold text-[#1E1E1E]">Description</h3>
              <p className="mt-1 text-sm text-[#6B6B6B] whitespace-pre-wrap">{rfq.description}</p>
            </div>
          )}

          {rfq.notes && (
            <div className="mt-3">
              <h3 className="text-sm font-semibold text-[#1E1E1E]">Additional notes</h3>
              <p className="mt-1 text-sm text-[#6B6B6B]">{rfq.notes}</p>
            </div>
          )}

          {isBuyer && rfq.invitations && rfq.invitations.length > 0 && (
            <div className="mt-4 border-t border-[#D8D3CC] pt-4">
              <h3 className="text-sm font-semibold text-[#1E1E1E]">Invited suppliers</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {rfq.invitations.map((inv) => (
                  <span key={inv.id} className="rounded-full bg-[#F5F3EF] px-3 py-1 text-xs text-[#6B6B6B]">
                    {inv.supplier?.username || "Unknown"}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {canQuote && (
          <div className="mt-6 rounded-2xl border border-[#D8D3CC] bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#1E1E1E]"><DollarSign className="h-5 w-5 text-[#4F7A57]" /> Submit your quote</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E1E1E]">Your price (USD)</label>
                <input type="number" step="0.01" value={quoteAmount} onChange={(e) => setQuoteAmount(e.target.value)}
                  className="mt-1 block w-full max-w-xs rounded-lg border border-[#D8D3CC] px-3 py-2.5 text-sm text-[#1E1E1E] outline-none focus:border-[#4F7A57]" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E1E1E]">Message to buyer</label>
                <textarea value={quoteNotes} onChange={(e) => setQuoteNotes(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-[#D8D3CC] px-3 py-2.5 text-sm text-[#1E1E1E] outline-none focus:border-[#4F7A57]" rows={3}
                  placeholder="Describe your offer, delivery timeline, payment terms..." />
              </div>
              <button onClick={submitQuote} disabled={submitting || !quoteAmount}
                className="inline-flex items-center gap-2 rounded-md bg-[#4F7A57] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3D6344] disabled:opacity-50">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
                {submitting ? "Submitting..." : "Submit quote"}
              </button>
            </div>
          </div>
        )}

        {myQuote && (
          <div className="mt-6 rounded-2xl border border-[#D8D3CC] bg-[#F5F3EF] p-6">
            <p className="flex items-center gap-2 text-sm font-medium text-[#4F7A57]"><ShieldCheck className="h-4 w-4" /> Your quote: <strong>${myQuote.amount.toFixed(2)}</strong> &middot; Status: <strong>{myQuote.status}</strong></p>
            {myQuote.notes && <p className="mt-1 text-xs text-[#6B6B6B]">{myQuote.notes}</p>}
          </div>
        )}

        {isBuyer && rfq.quotes && rfq.quotes.length > 0 && (
          <div className="mt-6 space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#1E1E1E]">
              <MessageSquare className="h-5 w-5 text-[#4F7A57]" />
              Quotes ({rfq.quotes.length})
            </h2>
            {rfq.quotes.map((q) => (
              <div key={q.id} className="rounded-xl border border-[#D8D3CC] bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#1E1E1E]">{q.seller?.username || "Supplier"}</p>
                    <p className="text-lg font-bold text-[#4F7A57]">${q.amount.toFixed(2)}</p>
                    {q.notes && <p className="mt-1 text-xs text-[#6B6B6B]">{q.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      q.status === "accepted" ? "bg-green-100 text-green-700" :
                      q.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                    }`}>{q.status}</span>
                    {rfq.status === "open" && q.status === "pending" && (
                      <div className="flex gap-1">
                        <button onClick={() => respondToQuote(q.id, "accept")} className="rounded-md bg-[#4F7A57] px-3 py-1 text-xs font-medium text-white hover:bg-[#3D6344]">Accept</button>
                        <button onClick={() => respondToQuote(q.id, "reject")} className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700">Reject</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isBuyer && !myQuote && rfq.status === "open" && (
          <p className="mt-6 text-center text-xs text-[#6B6B6B]">
            <FileText className="mr-1 inline h-3 w-3" />
            {rfq.is_private ? "You are invited to quote on this RFQ. Use the form above to submit your offer." : "Interested in supplying this? Use the form above to submit your quote."}
          </p>
        )}
      </div>
    </div>
  );
}
