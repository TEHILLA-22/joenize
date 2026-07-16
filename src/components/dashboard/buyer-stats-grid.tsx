import {
  CircleDollarSign,
  FileClock,
  PackageCheck,
  ReceiptText,
  Truck,
} from "lucide-react";

import type {
  BuyerWorkspaceSummary,
} from "@/services/buyer-workspace.service";

function buildStats(
  summary?: BuyerWorkspaceSummary
) {
  return [
    {
      label: "Pending RFQs",
      value:
        summary?.pendingRfqs ?? 0,
      note: "Supplier responses awaiting review",
      icon: FileClock,
    },
    {
      label: "Orders in Progress",
      value:
        summary?.ordersInProgress ?? 0,
      note: "Orders currently moving through procurement",
      icon: PackageCheck,
    },
    {
      label: "Invoices Awaiting Payment",
      value:
        summary?.invoicesAwaiting ?? 0,
      note: "Invoices pending buyer action",
      icon: ReceiptText,
    },
    {
      label: "Shipments in Transit",
      value:
        summary?.shipmentsInTransit ?? 0,
      note: "Shipments currently being tracked",
      icon: Truck,
    },
    {
      label: "Wallet Balance",
      value:
        summary?.walletBalance ??
        "$0.00",
      note: "Available buyer wallet balance",
      icon: CircleDollarSign,
    },
  ];
}

export function BuyerStatsGrid({
  summary,
  isLoading,
}: {
  summary?: BuyerWorkspaceSummary;
  isLoading: boolean;
}) {
  const stats = buildStats(
    summary
  );

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article
            className="rounded-lg border border-[#D8D3CC] bg-white p-4 shadow-sm"
            key={stat.label}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-[#6B6B6B]">
                  {stat.label}
                </p>

                <p className="mt-2 text-2xl font-semibold text-[#1E1E1E]">
                  {
                    isLoading
                      ? "..."
                      : stat.value
                  }
                </p>
              </div>

              <span className="rounded-md bg-[#4F7A57]/10 p-2 text-[#4F7A57]">
                <Icon className="h-5 w-5" />
              </span>
            </div>

            <p className="mt-3 text-xs text-[#6B6B6B]">
              {stat.note}
            </p>
          </article>
        );
      })}
    </section>
  );
}
