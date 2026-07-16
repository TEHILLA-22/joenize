import Link from "next/link";
import type {
  LucideIcon,
} from "lucide-react";
import {
  ArrowRight,
} from "lucide-react";

interface BuyerModulePageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  details: string[];
}

export function BuyerModulePage({
  title,
  description,
  icon: Icon,
  emptyTitle,
  emptyDescription,
  primaryAction,
  details,
}: BuyerModulePageProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-[#D8D3CC] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#4F7A57]/10 text-[#4F7A57]">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-semibold text-[#1E1E1E]">
                {title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-[#6B6B6B]">
                {description}
              </p>
            </div>
          </div>

          {primaryAction && (
            <Link
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#1E1E1E] px-4 text-sm font-medium text-white transition-colors hover:bg-[#2A2A2A]"
              href={primaryAction.href}
            >
              {primaryAction.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-dashed border-[#D8D3CC] bg-white p-8 text-center shadow-sm">
        <Icon className="mx-auto h-9 w-9 text-[#4F7A57]" />
        <h2 className="mt-4 text-lg font-semibold text-[#1E1E1E]">
          {emptyTitle}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#6B6B6B]">
          {emptyDescription}
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {details.map((detail) => (
          <div
            className="rounded-lg border border-[#D8D3CC] bg-white p-4 text-sm text-[#6B6B6B] shadow-sm"
            key={detail}
          >
            {detail}
          </div>
        ))}
      </section>
    </div>
  );
}
