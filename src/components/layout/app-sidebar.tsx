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
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { messages, userRoleLabels } from "@/lib/labels";
import type { UserRole } from "@/lib/api/types";

const navItems: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
}[] = [
  { href: "/dashboard", label: "داشبورد", icon: LayoutDashboard },
  { href: "/properties", label: "املاک", icon: Home },
  { href: "/parties", label: "طرفین قرارداد", icon: UserSquare2 },
  { href: "/contracts", label: "قراردادها", icon: FileText },
  {
    href: "/users",
    label: "کاربران",
    icon: Users,
    roles: ["ADMIN", "OWNER"],
  },
  {
    href: "/organizations",
    label: "آژانس‌ها",
    icon: Building2,
    roles: ["ADMIN", "OWNER"],
  },
];

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, hasRole } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <aside className="flex h-full w-64 flex-col border-e border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex items-start justify-between gap-3 border-b border-sidebar-border px-4 py-5">
        <div>
          <p className="text-xs font-medium text-sidebar-foreground/70">
            {messages.appName}
          </p>
          <p className="mt-1 text-sm font-semibold leading-relaxed">
            {messages.appTagline}
          </p>
        </div>
        <ThemeToggle />
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
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm leading-relaxed transition-colors",
                  active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        {user ? (
          <div className="mb-3 px-1">
            <p className="truncate text-sm font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/60" dir="ltr">
              {user.email}
            </p>
            <p className="mt-1 text-xs text-sidebar-foreground/60">
              {userRoleLabels[user.role]}
            </p>
          </div>
        ) : null}
        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => void handleLogout()}
        >
          <LogOut className="size-4 rtl:scale-x-[-1]" />
          {messages.logOut}
        </Button>
      </div>
    </aside>
  );
}
