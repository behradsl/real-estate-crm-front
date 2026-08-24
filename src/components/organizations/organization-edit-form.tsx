"use client";

import { FormEvent, useState } from "react";
import type { Organization, UpdateOrganizationInput } from "@/lib/api/types";
import { messages } from "@/lib/labels";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function emptyToUndefined(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export function OrganizationEditForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial: Organization;
  submitLabel?: string;
  onSubmit: (payload: UpdateOrganizationInput) => Promise<void>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState(initial.name);
  const [slug, setSlug] = useState(initial.slug);
  const [email, setEmail] = useState(initial.email ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [website, setWebsite] = useState(initial.website ?? "");
  const [city, setCity] = useState(initial.address?.city ?? "");
  const [province, setProvince] = useState(initial.address?.province ?? "");
  const [details, setDetails] = useState(initial.address?.details ?? "");
  const [plaque, setPlaque] = useState(initial.address?.plaque ?? "");
  const [postalCode, setPostalCode] = useState(initial.address?.postalCode ?? "");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload: UpdateOrganizationInput = {
        name,
        slug,
        email: emptyToUndefined(email),
        phone: emptyToUndefined(phone),
        website: emptyToUndefined(website),
      };

      if (city.trim() && province.trim()) {
        payload.address = {
          city: city.trim(),
          province: province.trim(),
          details: emptyToUndefined(details),
          plaque: emptyToUndefined(plaque),
          postalCode: emptyToUndefined(postalCode),
        };
      }

      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={(e) => void handleSubmit(e)}>
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
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </div>
          <div className="space-y-2">
            <Label>تلفن</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              dir="ltr"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>وب‌سایت</Label>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              dir="ltr"
              placeholder="https://"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>نشانی</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>شهر</Label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>استان</Label>
            <Input
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>جزئیات نشانی</Label>
            <Input
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>پلاک</Label>
            <Input value={plaque} onChange={(e) => setPlaque(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>کد پستی</Label>
            <Input
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              dir="ltr"
            />
          </div>
        </CardContent>
      </Card>

      <Button disabled={submitting} type="submit">
        {submitting ? messages.saving : (submitLabel ?? messages.save)}
      </Button>
    </form>
  );
}
