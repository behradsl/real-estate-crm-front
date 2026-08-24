"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { useAuth } from "@/components/providers/auth-provider";
import { organizationsApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { messages } from "@/lib/labels";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function emptyToUndefined(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export default function NewOrganizationPage() {
  const { hasRole } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("آژانس نمونه");
  const [slug, setSlug] = useState("namoneh");
  const [email, setEmail] = useState("info@namoneh.com");
  const [phone, setPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("owner@namoneh.com");
  const [ownerPassword, setOwnerPassword] = useState("password123");
  const [ownerFirstName, setOwnerFirstName] = useState("سارا");
  const [ownerLastName, setOwnerLastName] = useState("کریمی");

  if (!hasRole("ADMIN")) {
    return (
      <p className="text-sm leading-relaxed text-muted-foreground">
        فقط مدیر سامانه می‌تواند آژانس جدید ثبت کند.
      </p>
    );
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const created = await organizationsApi.create({
        name,
        slug,
        email: emptyToUndefined(email),
        phone: emptyToUndefined(phone),
        owner: {
          email: ownerEmail,
          password: ownerPassword,
          firstName: ownerFirstName,
          lastName: ownerLastName,
        },
      });
      toast.success("آژانس ثبت شد");
      router.push(`/organizations/${created.id}`);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : messages.createFailed);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="ثبت آژانس جدید"
        description="سازمان و حساب مالک آژانس در یک مرحله ایجاد می‌شود."
      />
      <form className="space-y-5" onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>مشخصات آژانس</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>نام</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>شناسه لاتین</Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label>ایمیل</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>
            <div className="space-y-2">
              <Label>تلفن</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                dir="ltr"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>مالک آژانس</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>ایمیل</Label>
              <Input
                type="email"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>رمز عبور</Label>
              <Input
                type="password"
                value={ownerPassword}
                onChange={(e) => setOwnerPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label>نام</Label>
              <Input
                value={ownerFirstName}
                onChange={(e) => setOwnerFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>نام خانوادگی</Label>
              <Input
                value={ownerLastName}
                onChange={(e) => setOwnerLastName(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>
        <Button disabled={submitting} type="submit">
          {submitting ? messages.creating : "ثبت آژانس"}
        </Button>
      </form>
    </div>
  );
}
