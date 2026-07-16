"use client";

import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import {
  Bell,
  BriefcaseBusiness,
  Factory,
  LogOut,
  Menu,
  Package,
  Search,
  Ship,
  ShoppingBag,
  ShoppingCart,
  Store,
  User,
  Wallet,
} from "lucide-react";
import {
  performLogout,
} from "@/hooks/use-logout";
import {
  useAuthStore,
} from "@/stores/auth-store";
import {
  ProtectedRoute,
} from "@/components/auth/protected-route";
import { TopNavNotifications } from "@/components/dashboard/top-nav-notifications";

const workspaceLinks = [
  {
    label: "Marketplace",
    href: "/marketplace",
    icon: Store,
  },
  {
    label: "Procurement",
    href: "/dashboard",
    icon: BriefcaseBusiness,
  },
  {
    label: "Cart",
    href: "/dashboard/cart",
    icon: ShoppingBag,
  },
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    label: "Shipments",
    href: "/dashboard/shipments",
    icon: Ship,
  },
  {
    label: "Wallet",
    href: "/dashboard/wallet",
    icon: Wallet,
  },
  {
    label: "Account",
    href: "/dashboard/account",
    icon: User,
  },
  {
    label: "Sell on Joenize",
    href: "/seller-dashboard",
    icon: Package,
  },
];

const mobileLinks =
  workspaceLinks.slice(0, 5);

function getInitials(
  username?: string,
  email?: string
) {
  const source =
    username || email || "Buyer";

  return source
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part[0]?.toUpperCase()
    )
    .join("") || "B";
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname =
    usePathname();
  const router = useRouter();
  const user =
    useAuthStore(
      (state) => state.user
    );

  async function handleLogout() {
    await performLogout();
    router.push("/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-background">
      <header className="bg-white border-b border-brand-primary/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-brand-primary hover:bg-brand-background rounded-md transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center gap-2 text-brand-primary">
              <Factory className="w-7 h-7" />
              <span className="text-xl font-bold tracking-tight hidden sm:block">joenise</span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl px-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-brand-primary-light/50" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-brand-primary/20 rounded-lg leading-5 bg-brand-background/50 placeholder-brand-primary-light/50 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:bg-white transition-all sm:text-sm"
                placeholder="Search products, suppliers, or categories..."
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/seller-dashboard" 
              className="hidden sm:flex bg-brand-primary text-brand-background text-sm font-medium px-4 py-2 rounded-md hover:bg-brand-primary-light transition-colors shadow-sm"
            >
              Sell on joenise
            </Link>

            <div className="h-6 w-px bg-brand-primary/10 hidden sm:block"></div>

            <TopNavNotifications />
            
            <div className="flex cursor-pointer items-center gap-2 rounded-md p-1 transition-colors hover:bg-brand-background">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-accent/20 font-semibold text-brand-accent">
                {getInitials(
                  user?.username,
                  user?.email
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <ProtectedRoute>
        <div className="mx-auto flex w-full max-w-7xl flex-1">
          <aside className="w-64 hidden lg:block py-8 pr-8">
            <nav className="space-y-1">
              {workspaceLinks.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname ===
                        item.href ||
                      pathname.startsWith(
                        `${item.href}/`
                      );

                return (
                  <Link
                    className={
                      isActive
                        ? "flex items-center gap-3 rounded-md bg-brand-primary px-3 py-2.5 font-medium text-brand-background"
                        : "flex items-center gap-3 rounded-md px-3 py-2.5 font-medium text-brand-primary-light transition-colors hover:bg-brand-accent/10 hover:text-brand-accent"
                    }
                    href={item.href}
                    key={item.label}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-12 pt-8 border-t border-brand-primary/10">
              <button
                className="flex items-center gap-3 px-3 py-2.5 rounded-md w-full text-left text-brand-primary-light hover:bg-brand-error/10 hover:text-brand-error transition-colors font-medium"
                onClick={handleLogout}
                type="button"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </aside>

          <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 lg:pl-0">
            {children}
          </main>
        </div>
      </ProtectedRoute>

      <nav className="sticky bottom-0 z-30 grid grid-cols-5 border-t border-brand-primary/10 bg-white px-1 py-2 lg:hidden">
        {mobileLinks.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname ===
                  item.href ||
                pathname.startsWith(
                  `${item.href}/`
                );

          return (
            <Link
              className={
                isActive
                  ? "flex flex-col items-center gap-1 rounded-md px-1 py-1.5 text-xs font-medium text-[#4F7A57]"
                  : "flex flex-col items-center gap-1 rounded-md px-1 py-1.5 text-xs font-medium text-brand-primary-light"
              }
              href={item.href}
              key={item.label}
            >
              <Icon className="h-4 w-4" />
              <span className="max-w-full truncate">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
