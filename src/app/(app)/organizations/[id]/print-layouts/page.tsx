"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { useAuth } from "@/components/providers/auth-provider";
import type { ContractType } from "@/lib/api/types";
import { CONTRACT_TYPES } from "@/lib/examples";
import { contractTypeLabels, messages } from "@/lib/labels";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrganizationPrintLayoutsPage() {
  const params = useParams<{ id: string }>();
  const { hasRole } = useAuth();

  if (!hasRole("ADMIN", "OWNER")) {
    return (
      <p className="text-sm leading-relaxed text-muted-foreground">
        فقط مدیر یا مالک آژانس می‌تواند چیدمان چاپ را ویرایش کند.
      </p>
    );
  }

  return (
    <div>
      <PageHeader
        title="چیدمان چاپ قراردادها"
        description="مختصات فیلدهای چاپی برای هر نوع قرارداد (میلی‌متر از گوشه پایین-چپ A3)."
        actions={
          <Button asChild variant="outline">
            <Link href={`/organizations/${params.id}`}>{messages.back}</Link>
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {CONTRACT_TYPES.map((type: ContractType) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="text-base">
                {contractTypeLabels[type]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link
                  href={`/organizations/${params.id}/print-layouts/${type}`}
                >
                  ویرایش چیدمان
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
