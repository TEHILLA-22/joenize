import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Package,
} from "lucide-react";

export function ProductBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning";
}) {
  const className =
    tone === "success"
      ? "bg-[#4F7A57]/10 text-[#4F7A57]"
      : tone === "warning"
        ? "bg-[#C4A574]/15 text-[#7A623F]"
        : "bg-[#F5F3EF] text-[#6B6B6B]";

  return (
    <span className={`rounded-md px-2 py-1 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

export function PriceDisplay({
  price,
  currency = "USD",
}: {
  price?: number | undefined;
  currency?: string;
}) {
  return (
    <p className="text-lg font-semibold text-[#1E1E1E]">
      {typeof price === "number"
        ? new Intl.NumberFormat(
            "en-US",
            {
              style: "currency",
              currency,
            }
          ).format(price)
        : "Request quote"}
    </p>
  );
}

export function MOQ({
  value,
}: {
  value?: number | undefined;
}) {
  return (
    <p className="text-xs text-[#6B6B6B]">
      MOQ: {value ?? "Supplier set"}
    </p>
  );
}

export function StockIndicator({
  inStock,
}: {
  inStock?: boolean | undefined;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-[#6B6B6B]">
      <span
        className={
          inStock
            ? "h-2 w-2 rounded-sm bg-[#4F7A57]"
            : "h-2 w-2 rounded-sm bg-[#C4A574]"
        }
      />
      {inStock ? "In stock" : "Check availability"}
    </span>
  );
}

export function CategoryCard({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  return (
    <Link
      className="group rounded-lg border border-[#D8D3CC] bg-white p-4 shadow-sm transition-colors hover:border-[#4F7A57]"
      href={href}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium text-[#1E1E1E]">
          {label}
        </span>
        <ArrowRight className="h-4 w-4 text-[#6B6B6B] transition-colors group-hover:text-[#4F7A57]" />
      </div>
    </Link>
  );
}

export function ProductCard({
  name,
  href,
  price,
  moq,
  inStock,
}: {
  name: string;
  href: string;
  price?: number;
  moq?: number;
  inStock?: boolean;
}) {
  return (
    <Link
      className="rounded-lg border border-[#D8D3CC] bg-white p-4 shadow-sm transition-colors hover:border-[#4F7A57]"
      href={href}
    >
      <div className="flex aspect-[4/3] items-center justify-center rounded-md bg-[#F5F3EF] text-[#4F7A57]">
        <Package className="h-8 w-8" />
      </div>
      <div className="mt-4 space-y-2">
        <ProductBadge tone="success">
          Verified supplier
        </ProductBadge>
        <h3 className="font-medium text-[#1E1E1E]">
          {name}
        </h3>
        <PriceDisplay price={price} />
        <div className="flex items-center justify-between gap-3">
          <MOQ value={moq} />
          <StockIndicator inStock={inStock} />
        </div>
      </div>
    </Link>
  );
}

export function SupplierCard({
  name,
  href,
  description,
}: {
  name: string;
  href: string;
  description?: string;
}) {
  return (
    <Link
      className="rounded-lg border border-[#D8D3CC] bg-white p-4 shadow-sm transition-colors hover:border-[#4F7A57]"
      href={href}
    >
      <Building2 className="h-7 w-7 text-[#4F7A57]" />
      <h3 className="mt-4 font-medium text-[#1E1E1E]">
        {name}
      </h3>
      <p className="mt-2 text-sm text-[#6B6B6B]">
        {description ?? "Verified supplier storefront"}
      </p>
    </Link>
  );
}
