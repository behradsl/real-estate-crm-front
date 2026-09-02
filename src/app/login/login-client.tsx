"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Building2 } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { ApiError } from "@/lib/api/client";
import { messages } from "@/lib/labels";
import { safeInternalPath } from "@/lib/safe-redirect";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginClient() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationSlug, setOrganizationSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace(safeInternalPath(searchParams.get("next")));
    }
  }, [loading, user, router, searchParams]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login({
        email,
        password,
        organizationSlug: organizationSlug.trim() || undefined,
      });
      toast.success(messages.signedIn);
      router.replace(safeInternalPath(searchParams.get("next")));
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : messages.loginFailed;
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_oklch(0.92_0.03_175)_0%,_oklch(0.975_0.008_80)_42%,_oklch(0.94_0.02_245)_100%)] px-4 dark:bg-[radial-gradient(ellipse_at_top,_oklch(0.24_0.04_175)_0%,_oklch(0.18_0.025_250)_50%,_oklch(0.16_0.03_248)_100%)]">
      <Card className="w-full max-w-md border-border/70 shadow-lg">
        <CardHeader className="space-y-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Building2 className="size-5" />
          </div>
          <CardTitle className="text-2xl">{messages.appName}</CardTitle>
          <CardDescription>
            با حساب کاربری آژانس وارد شوید. شناسه سازمان را برای مدیر سامانه خالی
            بگذارید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">شناسه سازمان (اختیاری)</Label>
              <Input
                id="slug"
                placeholder="acme-realty"
                value={organizationSlug}
                onChange={(e) => setOrganizationSlug(e.target.value)}
                dir="ltr"
              />
            </div>
            <Button className="w-full" disabled={submitting} type="submit">
              {submitting ? messages.signingIn : messages.signIn}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
