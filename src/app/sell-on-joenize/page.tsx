"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, CreditCard, ShieldCheck, Store } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { buildAppRoute } from "@/lib/navigation";

export default function SellOnJoenizePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleContinue = () => {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent("/sell-on-joenize")}`);
      return;
    }

    if (user?.is_seller) {
      router.push("/dashboard");
      return;
    }

    router.push(
      buildAppRoute("/seller-onboarding", {
        flow: "seller-payment",
        next: "/seller-onboarding",
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF] px-4 py-12 text-[#1E1E1E] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-2xl border border-[#D8D3CC] bg-white p-8 shadow-sm">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#4F7A57]/10 px-3 py-1 text-sm font-medium text-[#4F7A57]">
            <ShieldCheck className="h-4 w-4" />
            Seller onboarding
          </div>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Start selling on Joenize with a payment-first setup.
          </h1>
          <p className="max-w-3xl text-base text-[#6B6B6B] sm:text-lg">
            Every seller must complete a secure onboarding payment before they can create a storefront, publish products, or access the seller workspace.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-xl border border-[#D8D3CC] bg-[#F5F3EF] p-6">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-[#4F7A57]" />
              <h2 className="text-lg font-semibold">What happens first</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-[#6B6B6B]">
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[#4F7A57]" />Sign in to your Joenize account.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[#4F7A57]" />Complete the seller onboarding payment.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[#4F7A57]" />Unlock business verification, storefront setup, and marketplace publishing.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-[#D8D3CC] p-6">
            <div className="flex items-center gap-3">
              <Store className="h-5 w-5 text-[#4F7A57]" />
              <h2 className="text-lg font-semibold">Ready to continue?</h2>
            </div>
            <p className="mt-3 text-sm text-[#6B6B6B]">
              This flow ensures only fully approved sellers can move into the marketplace workspace.
            </p>
            <button
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#1E1E1E] px-4 text-sm font-medium text-white transition-colors hover:bg-[#2A2A2A]"
              onClick={handleContinue}
              type="button"
            >
              Continue to seller onboarding
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link className="mt-3 inline-flex text-sm font-medium text-[#4F7A57] hover:text-[#1E1E1E]" href="/">
              Back to marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
