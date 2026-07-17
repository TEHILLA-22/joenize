"use client";

import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Plus,
} from "lucide-react";
import {
  BuyerStatsGrid,
} from "@/components/dashboard/buyer-stats-grid";
import {
  ProcurementFlow,
} from "@/components/dashboard/procurement-flow";
import {
  RecentOrders,
} from "@/components/dashboard/recent-orders";
import {
  RecommendedSuppliers,
} from "@/components/dashboard/recommended-suppliers";
import {
  RealtimeNotifications,
} from "@/components/dashboard/realtime-notifications";
import {
  useBuyerWorkspace,
} from "@/hooks/use-buyer-workspace";
import {
  useAuthStore,
} from "@/stores/auth-store";

function getGreetingName(
  username?: string
) {
  if (!username) {
    return "Buyer";
  }

  return username;
}

export function BuyerDashboard() {
  const user =
    useAuthStore(
      (state) => state.user
    );
  const {
    data,
    isLoading,
  } = useBuyerWorkspace();
  const name = getGreetingName(
    user?.username
  );

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-2">
        <div>
          <p className="text-sm font-medium text-[#4F7A57]">
            Buyer workspace
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-[#1E1E1E] sm:text-3xl">
            Hello {name}
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-[#6B6B6B]">
            Manage procurement activity, open orders, invoices, shipments, wallet, and notifications.
          </p>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/rfq/create"
          className="inline-flex items-center gap-2 rounded-lg border border-[#D8D3CC] bg-white px-4 py-3 text-sm font-medium text-[#1E1E1E] shadow-sm hover:border-[#4F7A57] hover:text-[#4F7A57] transition-colors">
          <Plus className="h-4 w-4" />
          Post new RFQ
        </Link>
        <Link href="/rfq/market"
          className="inline-flex items-center gap-2 rounded-lg border border-[#D8D3CC] bg-white px-4 py-3 text-sm font-medium text-[#1E1E1E] shadow-sm hover:border-[#4F7A57] hover:text-[#4F7A57] transition-colors">
          <FileText className="h-4 w-4" />
          Browse RFQ market
        </Link>
        <Link href="/dashboard/orders"
          className="inline-flex items-center gap-2 rounded-lg border border-[#D8D3CC] bg-white px-4 py-3 text-sm font-medium text-[#1E1E1E] shadow-sm hover:border-[#4F7A57] hover:text-[#4F7A57] transition-colors">
          <ArrowRight className="h-4 w-4" />
          My orders
        </Link>
      </div>

      {data ? (
        <BuyerStatsGrid
          isLoading={isLoading}
          summary={data}
        />
      ) : (
        <BuyerStatsGrid
          isLoading={isLoading}
        />
      )}

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <ProcurementFlow />
          <RecentOrders
            activity={
              data?.recentActivity ?? []
            }
          />
        </div>

        <div className="space-y-6">
          <RealtimeNotifications />
          <RecommendedSuppliers />
        </div>
      </div>
    </div>
  );
}
