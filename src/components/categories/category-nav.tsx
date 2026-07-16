"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Car, ChevronRight, Cpu, FlaskConical, HardHat, HeartPulse, Monitor,
  Package, Shirt, Sprout, Store, ToyBrick, Truck,
  UtensilsCrossed, Wrench, type LucideIcon,
} from "lucide-react";

interface SubCategory {
  label: string;
  href: string;
}

interface CategoryGroup {
  label: string;
  icon: LucideIcon;
  href: string;
  subs: SubCategory[];
}

const categoryGroups: CategoryGroup[] = [
  { label: "Electronics", icon: Cpu, href: "/marketplace?category=Electronics", subs: [
    { label: "Consumer Electronics", href: "/marketplace?category=Consumer+Electronics" },
    { label: "Industrial Electronics", href: "/marketplace?category=Industrial+Electronics" },
    { label: "Electronic Components", href: "/marketplace?category=Electronic+Components" },
  ]},
  { label: "Industrial Equipment", icon: Wrench, href: "/marketplace?category=Industrial+Equipment", subs: [
    { label: "Machinery", href: "/marketplace?category=Machinery" },
    { label: "Tools", href: "/marketplace?category=Tools" },
    { label: "Heavy Equipment", href: "/marketplace?category=Heavy+Equipment" },
  ]},
  { label: "Packaging", icon: Package, href: "/marketplace?category=Packaging", subs: [
    { label: "Boxes & Containers", href: "/marketplace?category=Boxes+Containers" },
    { label: "Bags & Wraps", href: "/marketplace?category=Bags+Wraps" },
    { label: "Labeling", href: "/marketplace?category=Labeling" },
  ]},
  { label: "Safety Supplies", icon: HardHat, href: "/marketplace?category=Safety+Supplies", subs: [
    { label: "PPE", href: "/marketplace?category=PPE" },
    { label: "Fire Safety", href: "/marketplace?category=Fire+Safety" },
    { label: "Signage", href: "/marketplace?category=Signage" },
  ]},
  { label: "Office Operations", icon: Monitor, href: "/marketplace?category=Office+Operations", subs: [
    { label: "Furniture", href: "/marketplace?category=Furniture" },
    { label: "Stationery", href: "/marketplace?category=Stationery" },
    { label: "Supplies", href: "/marketplace?category=Office+Supplies" },
  ]},
  { label: "Raw Materials", icon: FlaskConical, href: "/marketplace?category=Raw+Materials", subs: [
    { label: "Chemicals", href: "/marketplace?category=Chemicals" },
    { label: "Metals", href: "/marketplace?category=Metals" },
    { label: "Plastics", href: "/marketplace?category=Plastics" },
  ]},
  { label: "Food & Beverage", icon: UtensilsCrossed, href: "/marketplace?category=Food+%26+Beverage", subs: [
    { label: "Beverages", href: "/marketplace?category=Beverages" },
    { label: "Ingredients", href: "/marketplace?category=Ingredients" },
    { label: "Processed Foods", href: "/marketplace?category=Processed+Foods" },
  ]},
  { label: "Clothing & Beauty", icon: Shirt, href: "/marketplace?category=Clothing+%26+Beauty", subs: [
    { label: "Apparel", href: "/marketplace?category=Apparel" },
    { label: "Beauty & Cosmetics", href: "/marketplace?category=Beauty+Cosmetics" },
    { label: "Textiles & Fabrics", href: "/marketplace?category=Textiles+Fabrics" },
  ]},
  { label: "Automotive", icon: Car, href: "/marketplace?category=Automotive", subs: [
    { label: "Auto Parts", href: "/marketplace?category=Auto+Parts" },
    { label: "Accessories", href: "/marketplace?category=Auto+Accessories" },
    { label: "Automotive Tools", href: "/marketplace?category=Automotive+Tools" },
  ]},
  { label: "Agriculture", icon: Sprout, href: "/marketplace?category=Agriculture", subs: [
    { label: "Seeds", href: "/marketplace?category=Seeds" },
    { label: "Fertilizers", href: "/marketplace?category=Fertilizers" },
    { label: "Equipment", href: "/marketplace?category=Farm+Equipment" },
  ]},
  { label: "Construction", icon: ToyBrick, href: "/marketplace?category=Construction", subs: [
    { label: "Building Materials", href: "/marketplace?category=Building+Materials" },
    { label: "Tools & Hardware", href: "/marketplace?category=Tools+Hardware" },
    { label: "Finishes & Fixtures", href: "/marketplace?category=Finishes+Fixtures" },
  ]},
  { label: "Healthcare", icon: HeartPulse, href: "/marketplace?category=Healthcare", subs: [
    { label: "Medical Equipment", href: "/marketplace?category=Medical+Equipment" },
    { label: "Pharmaceuticals", href: "/marketplace?category=Pharmaceuticals" },
    { label: "Medical Supplies", href: "/marketplace?category=Medical+Supplies" },
  ]},
  { label: "Logistics", icon: Truck, href: "/marketplace?category=Logistics", subs: [
    { label: "Shipping", href: "/marketplace?category=Shipping" },
    { label: "Warehousing", href: "/marketplace?category=Warehousing" },
    { label: "Freight", href: "/marketplace?category=Freight" },
  ]},
  { label: "Technology", icon: Wrench, href: "/marketplace?category=Technology", subs: [
    { label: "Software", href: "/marketplace?category=Software" },
    { label: "Hardware", href: "/marketplace?category=Hardware" },
    { label: "IT Services", href: "/marketplace?category=IT+Services" },
  ]},
];

export function CategoryDropdown() {
  const [open, setOpen] = useState(false);
  const [activeCat, setActiveCat] = useState<string | null>(null);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => { setOpen(false); setActiveCat(null); }}
    >
      <button className="flex items-center gap-1 text-sm font-medium text-[#6B6B6B] hover:text-[#1E1E1E] transition-colors">
        <Store className="h-4 w-4" />
        Categories
        <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-[640px] rounded-xl border border-[#D8D3CC] bg-white shadow-xl">
          <div className="flex">
            <div className="w-56 shrink-0 border-r border-[#D8D3CC] p-2">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">
                All Categories
              </p>
              <div className="space-y-0.5">
                {categoryGroups.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCat === cat.label;
                  return (
                    <div
                      key={cat.label}
                      className="relative"
                      onMouseEnter={() => setActiveCat(cat.label)}
                    >
                      <Link
                        href={cat.href}
                        className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive ? "bg-[#F5F3EF] text-[#4F7A57]" : "text-[#1E1E1E] hover:bg-[#F5F3EF] hover:text-[#4F7A57]"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#F5F3EF]">
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          {cat.label}
                        </span>
                        {cat.subs.length > 0 && <ChevronRight className="h-3.5 w-3.5" />}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 p-4">
              {activeCat ? (
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">
                    {activeCat}
                  </p>
                  <div className="space-y-1">
                    {categoryGroups
                      .find((g) => g.label === activeCat)
                      ?.subs.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block rounded-lg px-3 py-2 text-sm text-[#1E1E1E] transition-colors hover:bg-[#F5F3EF] hover:text-[#4F7A57]"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    <Link
                      href={categoryGroups.find((g) => g.label === activeCat)?.href || "#"}
                      className="mt-3 block rounded-lg px-3 py-2 text-sm font-medium text-[#4F7A57] transition-colors hover:bg-[#F5F3EF]"
                    >
                      View all {activeCat.toLowerCase()} →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-[#6B6B6B]">Hover over a category to see subcategories</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CategorySidebar() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="rounded-xl border border-[#D8D3CC] bg-white shadow-sm">
        <div className="border-b border-[#D8D3CC] px-4 py-3">
          <h3 className="text-sm font-semibold text-[#1E1E1E]">Categories</h3>
        </div>
        <nav className="p-2 space-y-0.5">
          {categoryGroups.map((cat) => {
            const Icon = cat.icon;
            const isExpanded = expanded === cat.label;
            return (
              <div key={cat.label}>
                <button
                  onClick={() => setExpanded(isExpanded ? null : cat.label)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-[#6B6B6B] transition-colors hover:bg-[#F5F3EF] hover:text-[#4F7A57]"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#F5F3EF]">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    {cat.label}
                  </span>
                  {cat.subs.length > 0 && (
                    <ChevronRight className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  )}
                </button>
                {isExpanded && (
                  <div className="ml-10 space-y-0.5 pb-1">
                    {cat.subs.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className="block rounded-lg px-3 py-1.5 text-sm text-[#6B6B6B] transition-colors hover:bg-[#F5F3EF] hover:text-[#4F7A57]"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
