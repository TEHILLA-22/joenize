import {
  Ship,
} from "lucide-react";
import {
  BuyerModulePage,
} from "@/components/dashboard/buyer-module-page";

export default function ShipmentsPage() {
  return (
    <BuyerModulePage
      description="Monitor packages and freight once an order enters fulfillment."
      details={[
        "Shipment records connect to order delivery status.",
        "Tracking events can feed real-time notifications.",
        "Receiving goods completes the procurement delivery step.",
      ]}
      emptyDescription="Shipment tracking will appear here once suppliers dispatch order items."
      emptyTitle="No shipments in transit"
      icon={Ship}
      title="Shipments"
    />
  );
}
