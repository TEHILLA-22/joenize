import {
  ShoppingBag,
} from "lucide-react";
import {
  BuyerModulePage,
} from "@/components/dashboard/buyer-module-page";

export default function CartPage() {
  return (
    <BuyerModulePage
      description="Collect products before requesting quotations, negotiating, or checking out."
      details={[
        "Add to cart stays locked behind authentication.",
        "Cart items can move into RFQs when supplier pricing is needed.",
        "Checkout can create orders once pricing and payment terms are accepted.",
      ]}
      emptyDescription="Products added from the marketplace will appear here before RFQ or checkout."
      emptyTitle="Your procurement cart is empty"
      icon={ShoppingBag}
      primaryAction={{
        label: "Browse marketplace",
        href: "/",
      }}
      title="Procurement Cart"
    />
  );
}
