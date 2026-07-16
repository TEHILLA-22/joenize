import {
  ShoppingCart,
} from "lucide-react";
import {
  BuyerModulePage,
} from "@/components/dashboard/buyer-module-page";

export default function OrdersPage() {
  return (
    <BuyerModulePage
      description="Track accepted quotations and checkout purchases through fulfillment."
      details={[
        "Orders connect accepted quotes, invoices, escrow, and shipments.",
        "Order updates will come from the backend orders API.",
        "Delivery completion unlocks supplier rating.",
      ]}
      emptyDescription="Orders will appear here after checkout or accepted quotations create a purchase."
      emptyTitle="No orders yet"
      icon={ShoppingCart}
      primaryAction={{
        label: "Start sourcing",
        href: "/",
      }}
      title="Orders"
    />
  );
}
