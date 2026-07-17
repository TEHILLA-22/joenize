"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/stores/auth-store";
import { refreshToken, me } from "@/services/auth.service";
import { ArrowRight, CheckCircle2, CreditCard, Loader2, ShieldCheck, Store } from "lucide-react";
import Link from "next/link";

type Step = "form" | "processing" | "paying" | "verifying" | "done" | "error";

export default function SellerOnboardingPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#F5F3EF]"><Loader2 className="h-8 w-8 animate-spin text-[#4F7A57]" /></div>}>
      <SellerOnboardingContent />
    </Suspense>
  );
}

function SellerOnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hydrated = useAuthStore((state) => state.hydrated);

  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState("");
  const [authUrl, setAuthUrl] = useState("");

  const [form, setForm] = useState({
    business_name: "",
    business_type: "",
    business_address: "",
    tax_id: "",
    phone_number: "",
  });

  const reference = searchParams.get("reference");

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) { router.replace("/login?next=/seller-onboarding"); return; }
    if (user?.is_seller) { router.replace("/seller-dashboard"); return; }
  }, [hydrated, isAuthenticated, user, router]);

  useEffect(() => {
    if (reference) {
      setStep("verifying");
      verifyPayment(reference);
    }
  }, [reference]);

  async function saveProfile(): Promise<boolean> {
    const res = await apiClient.patch("/seller/profile", form);
    return res.status === 200;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.business_name || !form.business_type) {
      setError("Business name and business type are required");
      return;
    }

    setStep("processing");

    try {
      await saveProfile();
      setStep("paying");

      const payRes = await apiClient.post("/seller/onboarding/initialize", { amount: 8000 });
      const url = payRes.data.authorization_url;
      setAuthUrl(url);
      window.location.href = url;
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Something went wrong");
      setStep("form");
    }
  }

  async function verifyPayment(ref: string) {
    try {
      await apiClient.get("/seller/onboarding/verify", { params: { reference: ref } });
      const tokenRes = await refreshToken();
      useAuthStore.getState().setAccessToken(tokenRes.access);
      const userData = await me();
      useAuthStore.getState().setUser(userData);
      setStep("done");
      setTimeout(() => router.push("/seller-dashboard"), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Payment verification failed");
      setStep("error");
    }
  }

  if (!hydrated || !isAuthenticated) return null;

  if (step === "paying") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F3EF]">
        <div className="rounded-2xl border border-[#D8D3CC] bg-white p-8 shadow-sm text-center max-w-md">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#4F7A57]" />
          <p className="mt-4 text-sm font-medium text-[#1E1E1E]">Redirecting to payment...</p>
          <p className="mt-1 text-xs text-[#6B6B6B]">Complete your payment in the new tab. Return here when done.</p>
          <button
            type="button"
            onClick={() => { setAuthUrl(""); setStep("form"); setError(""); }}
            className="mt-6 text-sm text-[#6B6B6B] underline hover:text-[#1E1E1E]"
          >
            Cancel and go back
          </button>
          {authUrl && (
            <a
              href={authUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block text-sm font-medium text-[#4F7A57] underline hover:text-[#3D6344]"
            >
              Open payment page again
            </a>
          )}
        </div>
      </div>
    );
  }

  if (step === "verifying") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F3EF]">
        <div className="rounded-2xl border border-[#D8D3CC] bg-white p-8 shadow-sm text-center max-w-md">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#4F7A57]" />
          <p className="mt-4 text-sm font-medium text-[#1E1E1E]">Verifying your payment...</p>
          <p className="mt-1 text-xs text-[#6B6B6B]">Please wait while we confirm your onboarding.</p>
        </div>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F3EF]">
        <div className="rounded-2xl border border-[#D8D3CC] bg-white p-8 shadow-sm text-center max-w-md">
          <CheckCircle2 className="mx-auto h-12 w-12 text-[#4F7A57]" />
          <h2 className="mt-4 text-xl font-semibold text-[#1E1E1E]">Onboarding complete!</h2>
          <p className="mt-2 text-sm text-[#6B6B6B]">Redirecting to your seller dashboard...</p>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F3EF]">
        <div className="rounded-2xl border border-[#D8D3CC] bg-white p-8 shadow-sm text-center max-w-md">
          <p className="text-sm text-brand-error">{error}</p>
          <button
            onClick={() => router.push("/seller-onboarding")}
            className="mt-4 rounded-md bg-[#1E1E1E] px-4 py-2 text-sm font-medium text-white"
            type="button"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF] px-4 py-12 text-[#1E1E1E] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center gap-2">
          <Link href="/" className="text-sm text-[#6B6B6B] hover:text-[#1E1E1E]">Home</Link>
          <span className="text-xs text-[#6B6B6B]">/</span>
          <span className="text-sm font-medium text-[#1E1E1E]">Seller onboarding</span>
        </div>

        <div className="rounded-2xl border border-[#D8D3CC] bg-white p-8 shadow-sm">
          <div className="flex items-center gap-2 rounded-full bg-[#4F7A57]/10 px-3 py-1 text-sm font-medium text-[#4F7A57] w-fit">
            <ShieldCheck className="h-4 w-4" />
            Step 1 of 2 — Business details
          </div>
          <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">Set up your seller profile</h1>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            Enter your business information. After this, you will complete a one-time payment to activate your seller account.
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-brand-error/30 bg-brand-error/5 px-4 py-3 text-sm text-brand-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[#1E1E1E]">Business name *</label>
                <input
                  type="text"
                  value={form.business_name}
                  onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-[#D8D3CC] px-3 py-2.5 text-sm outline-none focus:border-[#4F7A57] focus:ring-1 focus:ring-[#4F7A57]"
                  placeholder="Your business name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E1E1E]">Business type *</label>
                <select
                  value={form.business_type}
                  onChange={(e) => setForm({ ...form, business_type: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-[#D8D3CC] px-3 py-2.5 text-sm outline-none focus:border-[#4F7A57] focus:ring-1 focus:ring-[#4F7A57]"
                  required
                >
                  <option value="">Select type</option>
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Distributor">Distributor</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Retailer">Retailer</option>
                  <option value="Service Provider">Service Provider</option>
                  <option value="Individual">Individual</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1E1E1E]">Business address</label>
              <textarea
                value={form.business_address}
                onChange={(e) => setForm({ ...form, business_address: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-[#D8D3CC] px-3 py-2.5 text-sm outline-none focus:border-[#4F7A57] focus:ring-1 focus:ring-[#4F7A57]"
                placeholder="Street, city, state, country"
                rows={2}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[#1E1E1E]">Tax ID / Registration number</label>
                <input
                  type="text"
                  value={form.tax_id}
                  onChange={(e) => setForm({ ...form, tax_id: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-[#D8D3CC] px-3 py-2.5 text-sm outline-none focus:border-[#4F7A57] focus:ring-1 focus:ring-[#4F7A57]"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E1E1E]">Phone number</label>
                <input
                  type="tel"
                  value={form.phone_number}
                  onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-[#D8D3CC] px-3 py-2.5 text-sm outline-none focus:border-[#4F7A57] focus:ring-1 focus:ring-[#4F7A57]"
                  placeholder="+234..."
                />
              </div>
            </div>

            <div className="rounded-xl border border-[#D8D3CC] bg-[#F5F3EF] p-5">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-[#4F7A57]" />
                <div>
                  <p className="text-sm font-semibold text-[#1E1E1E]">Onboarding fee: ₦8,000</p>
                  <p className="text-xs text-[#6B6B6B]">One-time payment to unlock your seller account</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={step === "processing"}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#1E1E1E] px-4 text-sm font-medium text-white transition-colors hover:bg-[#2A2A2A] disabled:opacity-50"
            >
              {step === "processing" ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                <><Store className="h-4 w-4" /> Continue to payment <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
