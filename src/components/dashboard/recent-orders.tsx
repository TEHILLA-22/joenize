import Link from "next/link";
import type {
  BuyerActivityItem,
} from "@/services/buyer-workspace.service";

export function RecentOrders({
  activity,
}: {
  activity: BuyerActivityItem[];
}) {
  return (
    <section className="rounded-lg border border-[#D8D3CC] bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-[#D8D3CC] p-4 sm:p-5">
        <div>
          <h2 className="text-lg font-semibold text-[#1E1E1E]">
            Recent Orders
          </h2>
          <p className="text-sm text-[#6B6B6B]">
            Active purchases that need tracking.
          </p>
        </div>

        <Link
          className="text-sm font-medium text-[#4F7A57] hover:text-[#1E1E1E]"
          href="/dashboard/orders"
        >
          View all
        </Link>
      </div>

      {activity.length > 0 ? (
        <div className="divide-y divide-[#D8D3CC]">
          {activity.map((item) => (
            <article
              className="p-4 sm:p-5"
              key={item.id}
            >
              <p className="font-medium text-[#1E1E1E]">
                {item.title}
              </p>
              <p className="mt-1 text-sm text-[#6B6B6B]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center">
          <p className="font-medium text-[#1E1E1E]">
            No recent activity yet
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-[#6B6B6B]">
            RFQs, quotes, orders, invoices, and shipment updates will appear here once you begin procurement.
          </p>
        </div>
      )}
    </section>
  );
}
