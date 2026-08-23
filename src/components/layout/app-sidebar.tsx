"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Users,
  UserSquare2,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/api/types";

const navItems: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
}[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/properties", label: "Properties", icon: Home },
  { href: "/parties", label: "Parties", icon: UserSquare2 },
  { href: "/contracts", label: "Contracts", icon: FileText },
  {
    href: "/users",
    label: "Users",
    icon: Users,
    roles: ["ADMIN", "OWNER"],
  },
  {
    href: "/organizations",
    label: "Organizations",
    icon: Building2,
    roles: ["ADMIN", "OWNER"],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, hasRole } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <aside className="flex h-full w-60 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="border-b px-4 py-5">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Real Estate CRM
        </p>
        <p className="mt-1 text-sm font-semibold">Operations</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems
          .filter((item) => !item.roles || hasRole(...item.roles))
          .map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
      </nav>

      <div className="border-t p-3">
        {user ? (
          <div className="mb-3 px-1">
            <p className="truncate text-sm font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            <p className="mt-1 text-xs text-muted-foreground">{user.role}</p>
          </div>
        ) : null}
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => void handleLogout()}
        >
          <LogOut className="size-4" />
          Log out
        </Button>
      </div>
    </aside>
  );
}
