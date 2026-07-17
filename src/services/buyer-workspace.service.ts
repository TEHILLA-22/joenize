import {
  apiClient,
} from "@/lib/api/client";

export interface BuyerWorkspaceSummary {
  pendingRfqs: number;
  ordersInProgress: number;
  invoicesAwaiting: number;
  shipmentsInTransit: number;
  walletBalance: string;
  recentActivity: BuyerActivityItem[];
}

export interface BuyerActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp?: string;
}

type ListResponse =
  | unknown[]
  | {
      results?: unknown[];
      count?: number;
    };

function getCount(
  response: ListResponse
): number {
  if (Array.isArray(response)) {
    return response.length;
  }

  if (
    typeof response.count ===
    "number"
  ) {
    return response.count;
  }

  return response.results?.length ?? 0;
}

async function getListCount(
  path: string
): Promise<number> {
  try {
    const response =
      await apiClient.get<ListResponse>(
        path
      );

    return getCount(
      response.data
    );
  } catch {
    return 0;
  }
}

async function getWalletBalance(): Promise<string> {
  try {
    const response =
      await apiClient.get<
        Record<string, unknown>
      >("/payments/wallet");

    const balance =
      response.data.balance ??
      response.data.available_balance ??
      response.data.amount;

    if (
      typeof balance === "number"
    ) {
      return new Intl.NumberFormat(
        "en-US",
        {
          style: "currency",
          currency: "USD",
        }
      ).format(balance);
    }

    if (
      typeof balance === "string" &&
      balance.length > 0
    ) {
      return balance;
    }
  } catch {
  }

  return "$0.00";
}

export async function getBuyerWorkspaceSummary(): Promise<BuyerWorkspaceSummary> {
  const [
    pendingRfqs,
    ordersInProgress,
    invoicesAwaiting,
    shipmentsInTransit,
    walletBalance,
  ] = await Promise.all([
    getListCount(
      "/procurement/rfqs"
    ),
    getListCount(
      "/orders"
    ),
    getListCount(
      "/invoices"
    ),
    getListCount(
      "/shipping"
    ),
    getWalletBalance(),
  ]);

  return {
    pendingRfqs,
    ordersInProgress,
    invoicesAwaiting,
    shipmentsInTransit,
    walletBalance,
    recentActivity: [],
  };
}
