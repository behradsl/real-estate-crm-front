"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { ApiError } from "@/lib/api/client";
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
  const [email, setEmail] = useState("admin@platform.local");
  const [password, setPassword] = useState("Admin12345");
  const [organizationSlug, setOrganizationSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace(searchParams.get("next") || "/dashboard");
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
      toast.success("Signed in");
      router.replace(searchParams.get("next") || "/dashboard");
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Login failed";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#e8eef7,_#f7f7f5_45%,_#f3efe8)] px-4">
      <Card className="w-full max-w-md border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Real Estate CRM</CardTitle>
          <CardDescription>
            Sign in with your session credentials. Leave organization slug empty
            for platform ADMIN.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Organization slug (optional)</Label>
              <Input
                id="slug"
                placeholder="acme-realty"
                value={organizationSlug}
                onChange={(e) => setOrganizationSlug(e.target.value)}
              />
            </div>
            <Button className="w-full" disabled={submitting} type="submit">
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
