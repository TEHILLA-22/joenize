import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Joenise - Enterprise Procurement and Supplier Marketplace",
  description: "Join Joenise to access verified suppliers",
}

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      <div className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
        <BrandPanel />

        <main className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 lg:min-h-0 lg:py-12">
          <div className="w-full max-w-[28rem] animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6 lg:hidden">
              <h1 className="text-2xl font-bold text-[#1E1E1E]">
                Joenise
              </h1>

              <p className="mt-2 text-sm text-[#6B6B6B]">
                Verified sourcing, secure procurement, and supplier workflows.
              </p>
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function BrandPanel() {
  return (
    <section className="hidden flex-col justify-between bg-[#1E1E1E] p-10 text-white lg:flex xl:p-12">
      <div>
        <h1 className="text-3xl font-bold">
          Joenise
        </h1>

        <p className="mt-4 text-lg text-neutral-300">
          Enterprise procurement and
          supplier marketplace.
        </p>
      </div>

      <div className="space-y-4">
        <Feature text="Verified suppliers" />
        <Feature text="Escrow-protected transactions" />
        <Feature text="Enterprise procurement workflows" />
        <Feature text="Global fulfillment support" />
      </div>

      <div>
        <p className="text-sm text-neutral-400">
          Built for organizations buying
          and selling technology at scale.
        </p>
      </div>
    </section>
  );
}

function Feature({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-2 rounded-sm bg-[#C4A574]" />
      <span>{text}</span>
    </div>
  );
}
