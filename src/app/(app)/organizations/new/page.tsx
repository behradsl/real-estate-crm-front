"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { useAuth } from "@/components/providers/auth-provider";
import { organizationsApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
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
  const [name, setName] = useState("Acme Realty");
  const [slug, setSlug] = useState("acme-realty");
  const [email, setEmail] = useState("info@acme.com");
  const [phone, setPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("owner@acme.com");
  const [ownerPassword, setOwnerPassword] = useState("password123");
  const [ownerFirstName, setOwnerFirstName] = useState("Sara");
  const [ownerLastName, setOwnerLastName] = useState("Karimi");

  if (!hasRole("ADMIN")) {
    return (
      <p className="text-sm text-muted-foreground">
        Only platform ADMIN can create organizations.
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
      toast.success("Organization created");
      router.push(`/organizations/${created.id}`);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Create failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="New organization"
        description="Creates the agency and its OWNER in one request."
      />
      <form className="space-y-4" onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Organization</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Owner</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={ownerPassword}
                onChange={(e) => setOwnerPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label>First name</Label>
              <Input
                value={ownerFirstName}
                onChange={(e) => setOwnerFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Last name</Label>
              <Input
                value={ownerLastName}
                onChange={(e) => setOwnerLastName(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>
        <Button disabled={submitting} type="submit">
          {submitting ? "Creating…" : "Create organization"}
        </Button>
      </form>
    </div>
  );
}
