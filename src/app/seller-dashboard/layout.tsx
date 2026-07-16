import DashboardLayout from "@/app/dashboard/layout";

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
