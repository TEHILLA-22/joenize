"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { SellerDashboard } from "@/components/dashboard/seller-dashboard";

export default function SellerDashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hydrated = useAuthStore((state) => state.hydrated);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login?next=/seller-dashboard");
      return;
    }

    if (!user?.is_seller) {
      router.replace("/sell-on-joenize");
    }
  }, [hydrated, isAuthenticated, router, user?.is_seller]);

  if (!hydrated || !isAuthenticated || !user?.is_seller) {
    return null;
  }

  return <SellerDashboard />;
}
