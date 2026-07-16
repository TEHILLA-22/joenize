"use client";

import Link from "next/link";
import type {
  ReactNode,
} from "react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, Building2, ChevronLeft, ChevronRight, Factory,
  PackageSearch, Search, ShieldCheck, Sparkles, Store,
} from "lucide-react";
import {
  CategoryCard,
} from "@/components/marketplace/marketplace-cards";
import {
  CategoryDropdown,
} from "@/components/categories/category-nav";
import { useAuthStore } from "@/stores/auth-store";
import { apiClient } from "@/lib/api/client";

const categoryLabels = [
  "Electronics",
  "Industrial Equipment",
  "Packaging",
  "Safety Supplies",
  "Office Operations",
  "Raw Materials",
  "Food & Beverage",
  "Clothing & Beauty",
  "Automotive",
  "Agriculture",
  "Construction",
  "Healthcare",
  "Logistics",
  "Technology",
];

function MarketplaceHeader() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const marketplaceHref = "/marketplace";

  const sellerHref = user?.is_seller ? "/dashboard" : "/sell-on-joenize";

  return (
    <header className="sticky top-0 z-30 border-b border-[#D8D3CC] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          className="flex items-center gap-2 text-[#1E1E1E]"
          href={marketplaceHref}
        >
          <Factory className="h-7 w-7" />
          <span className="text-xl font-bold">
            Joenize
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-[#6B6B6B] md:flex">
          <CategoryDropdown />
          <Link className="hover:text-[#1E1E1E]" href="#suppliers">
            Suppliers
          </Link>
          <Link className="hover:text-[#1E1E1E]" href={sellerHref}>
            Sell on Joenize
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Link
                className="hidden rounded-md px-3 py-2 text-sm font-medium text-[#1E1E1E] transition-colors hover:bg-[#F5F3EF] sm:inline-flex"
                href="/login"
              >
                Login
              </Link>
              <Link
                className="rounded-md bg-[#1E1E1E] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2A2A2A]"
                href="/signup"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <Link
              className="rounded-md bg-[#1E1E1E] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2A2A2A]"
              href="/dashboard"
            >
              Go to dashboard
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function EmptyMarketplaceSection({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-[#D8D3CC] bg-white p-6 text-center">
      <PackageSearch className="mx-auto h-8 w-8 text-[#4F7A57]" />
      <h3 className="mt-3 font-semibold text-[#1E1E1E]">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-[#6B6B6B]">
        {description}
      </p>
      {action && (
        <Link
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#4F7A57] hover:text-[#1E1E1E]"
          href="/signup"
        >
          {action}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function SectionShell({
  id,
  title,
  description,
  children,
}: {
  id?: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
      id={id}
    >
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#1E1E1E] sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

export function MarketplacePage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiClient.get("/products/featured/").then((res) => setFeatured(res.data.results || [])).catch(() => {});
  }, []);

  function scrollCarousel(dir: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF] text-[#1E1E1E]">
      <MarketplaceHeader />

      <main>
        <section className="border-b border-[#D8D3CC] bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md bg-[#4F7A57]/10 px-3 py-1 text-sm font-medium text-[#4F7A57]">
                <ShieldCheck className="h-4 w-4" />
                Marketplace with buyer protection
              </div>

              <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-normal text-[#1E1E1E] sm:text-5xl">
                Source products and suppliers before you ever need an account.
              </h1>

              <p className="mt-5 max-w-2xl text-base text-[#6B6B6B] sm:text-lg">
                Browse categories, compare suppliers, and unlock RFQs, cart, checkout, wallet, orders, and shipments when you are ready to act.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <label className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]" />
                  <input
                    className="h-12 w-full rounded-md border border-[#D8D3CC] bg-white pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-[#6B6B6B] focus:border-[#4F7A57]"
                    placeholder="Search products, suppliers, categories..."
                    type="search"
                  />
                </label>

                <button className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#1E1E1E] px-5 text-sm font-medium text-white transition-colors hover:bg-[#2A2A2A]">
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {categoryLabels.slice(0, 6).map((label) => (
                  <Link
                    className="rounded-md border border-[#D8D3CC] bg-[#F5F3EF] px-3 py-1.5 text-sm text-[#1E1E1E] transition-colors hover:border-[#4F7A57] hover:text-[#4F7A57]"
                    href={`/categories?category=${encodeURIComponent(label)}`}
                    key={label}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[#D8D3CC] bg-[#F5F3EF] p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md bg-white p-4">
                  <Store className="h-6 w-6 text-[#4F7A57]" />
                  <p className="mt-4 text-2xl font-semibold">
                    Public
                  </p>
                  <p className="mt-1 text-sm text-[#6B6B6B]">
                    Browse, search, and inspect suppliers freely.
                  </p>
                </div>
                <div className="rounded-md bg-white p-4">
                  <Building2 className="h-6 w-6 text-[#4F7A57]" />
                  <p className="mt-4 text-2xl font-semibold">
                    Workspace
                  </p>
                  <p className="mt-1 text-sm text-[#6B6B6B]">
                    RFQs, cart, checkout, wallet, orders, and shipments after login.
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-md bg-[#1E1E1E] p-4 text-white">
                <p className="text-sm font-medium text-[#D4B98E]">
                  Procurement path
                </p>
                <p className="mt-2 text-sm text-neutral-200">
                  Product - Cart - RFQ - Quote - Order - Invoice - Escrow - Shipment - Delivery
                </p>
              </div>
            </div>
          </div>
        </section>

        <SectionShell
          description="Start broad, then filter by brand, supplier, price, MOQ, and country as catalog data comes online."
          id="categories"
          title="Featured Categories"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryLabels.map((label) => (
              <CategoryCard
                href={`/categories?category=${encodeURIComponent(label)}`}
                key={label}
                label={label}
              />
            ))}
          </div>
        </SectionShell>

        <SectionShell
          description="Live product cards will render here from the product catalog API."
          title="Featured Products"
        >
          {featured.length === 0 ? (
            <EmptyMarketplaceSection
              action="Create an account to prepare your first procurement cart"
              description={
                typeof window !== "undefined" && window.location.hostname === "localhost"
                  ? "Create products as a seller to see them featured here."
                  : "No supplier products are published in the marketplace yet."
              }
              title="No featured products yet"
            />
          ) : (
            <div className="relative group">
              <button onClick={() => scrollCarousel("left")} type="button"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-[#D8D3CC] opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div ref={scrollRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-hide">
                {featured.map((p: any) => (
                  <Link key={p.id} href={`/marketplace?product=${p.id}`}
                    className="flex-shrink-0 w-64 rounded-xl border border-[#D8D3CC] bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-square rounded-lg bg-[#F5F3EF] overflow-hidden mb-3">
                      {p.images && p.images.length > 0 ? (
                        <img src={p.images[0].url} alt={p.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#D8D3CC] text-xs">No image</div>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-[#1E1E1E] truncate">{p.name}</p>
                    <p className="text-xs text-[#6B6B6B]">${p.price?.toFixed(2)} &middot; {p.seller?.username || "Seller"}</p>
                  </Link>
                ))}
              </div>
              <button onClick={() => scrollCarousel("right")} type="button"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-[#D8D3CC] opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </SectionShell>

        <SectionShell
          description="Verified supplier storefronts will appear here with ratings, response rates, and catalogs."
          id="suppliers"
          title="Verified Suppliers"
        >
          <EmptyMarketplaceSection
            action="Apply to become a supplier"
            description="Supplier storefronts will show once business verification and product publishing are complete."
            title="No verified supplier storefronts yet"
          />
        </SectionShell>

        <SectionShell
          description="Promotions, trending products, and recently added listings stay separated for easier scanning."
          title="Deals, Trending, and Recently Added"
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <EmptyMarketplaceSection
              description="Deals will appear after suppliers publish discounted listings."
              title="Deals of the Week"
            />
            <EmptyMarketplaceSection
              description="Trending products will appear after buyer search and product activity exists."
              title="Trending Products"
            />
            <EmptyMarketplaceSection
              description="New listings will appear as suppliers publish catalog items."
              title="Recently Added"
            />
          </div>
        </SectionShell>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-[#1E1E1E] p-6 text-white sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-sm font-medium text-[#D4B98E]">
                  <Sparkles className="h-4 w-4" />
                  Become a Supplier
                </div>
                <h2 className="mt-3 text-2xl font-semibold">
                  Sell to businesses already sourcing on Joenize.
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-neutral-300">
                  Apply, verify your business, set up your storefront, and publish products into the marketplace.
                </p>
              </div>
              <Link
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-[#1E1E1E]"
                href="/sell-on-joenize"
              >
                Start seller application
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#D8D3CC] bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-[#6B6B6B] sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <Link className="font-semibold text-[#1E1E1E]" href="/">
              Joenize
            </Link>
            <p className="mt-2">
              Marketplace first. Procurement workspace attached.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/about">About</Link>
            <Link href="/help">Help Center</Link>
            <Link href="/buyer-protection">Buyer Protection</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
