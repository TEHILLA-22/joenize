import {
  Wallet,
} from "lucide-react";
import {
  BuyerModulePage,
} from "@/components/dashboard/buyer-module-page";

export default function WalletPage() {
  return (
    <BuyerModulePage
      description="Manage buyer funds, escrow movement, payment transactions, and refunds."
      details={[
        "Wallet balance is read from the payments wallet API.",
        "Escrow release belongs to the order and delivery lifecycle.",
        "Refund activity will surface from payment transaction records.",
      ]}
      emptyDescription="Wallet transactions will appear after payments, escrow holds, or refunds are created."
      emptyTitle="No wallet activity yet"
      icon={Wallet}
      title="Wallet"
    />
  );
}
