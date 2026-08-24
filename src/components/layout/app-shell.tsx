"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { messages } from "@/lib/labels";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm leading-relaxed text-muted-foreground">
        {messages.loadingSession}
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:sticky md:top-0 md:flex md:h-screen">
        <AppSidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-background/85 px-4 py-3 backdrop-blur md:hidden">
          <Sheet open={mobileNav} onOpenChange={setMobileNav}>
            <SheetTrigger asChild>
              <Button type="button" variant="outline" size="icon-sm">
                <Menu className="size-4" />
                <span className="sr-only">منوی اصلی</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0" showCloseButton={false}>
              <SheetTitle className="sr-only">منوی اصلی</SheetTitle>
              <AppSidebar onNavigate={() => setMobileNav(false)} />
            </SheetContent>
          </Sheet>
          <p className="font-heading text-sm font-semibold">{messages.appName}</p>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
