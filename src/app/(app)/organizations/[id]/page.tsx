"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { useAuth } from "@/components/providers/auth-provider";
import { organizationsApi } from "@/lib/api";
import type { Organization } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { messages } from "@/lib/labels";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrganizationDetailPage() {
  const params = useParams<{ id: string }>();
  const { hasRole } = useAuth();
  const [item, setItem] = useState<Organization | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setItem(await organizationsApi.get(params.id));
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : messages.loadFailed);
      }
    })();
  }, [params.id]);

  if (!item) {
    return <p className="text-sm leading-relaxed text-muted-foreground">{messages.loading}</p>;
  }

  const canEdit = hasRole("ADMIN", "OWNER");

  return (
    <div>
      <PageHeader
        title={item.name}
        description={`شناسه: ${item.slug}`}
        actions={
          canEdit ? (
            <Button asChild variant="secondary">
              <Link href={`/organizations/${item.id}/edit`}>{messages.edit}</Link>
            </Button>
          ) : null
        }
      />
      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>مشخصات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed">
            <p>ایمیل: {item.email ?? messages.none}</p>
            <p>تلفن: {item.phone ?? messages.none}</p>
            <p>وب‌سایت: {item.website ?? messages.none}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>نشانی</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed">
            {item.address ? (
              <>
                <p>
                  {item.address.city}، {item.address.province}
                </p>
                {item.address.details ? <p>{item.address.details}</p> : null}
                {item.address.plaque ? <p>پلاک: {item.address.plaque}</p> : null}
                {item.address.postalCode ? (
                  <p>کد پستی: {item.address.postalCode}</p>
                ) : null}
              </>
            ) : (
              <p className="text-muted-foreground">نشانی ثبت نشده است</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
