"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { RelatedContractsCard } from "@/components/contracts/related-contracts-card";
import { partiesApi } from "@/lib/api";
import type { Party } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { partyDisplayName } from "@/lib/contracts/wizard";
import { genderLabels, messages, partyTypeLabels } from "@/lib/labels";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PartyDetailPage() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<Party | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setItem(await partiesApi.get(params.id));
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : messages.loadFailed);
      }
    })();
  }, [params.id]);

  if (!item) {
    return <p className="text-sm leading-relaxed text-muted-foreground">{messages.loading}</p>;
  }

  return (
    <div>
      <PageHeader
        title={partyDisplayName(item)}
        actions={
          <Button asChild variant="secondary">
            <Link href={`/parties/${item.id}/edit`}>{messages.edit}</Link>
          </Button>
        }
      />
      <div className="mb-6">
        <Badge>{partyTypeLabels[item.type]}</Badge>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>مشخصات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed">
            <p>کد ملی: {item.nationalCode ?? messages.none}</p>
            <p>شناسه اقتصادی: {item.economicCode ?? messages.none}</p>
            <p>نام پدر: {item.fatherName ?? messages.none}</p>
            <p>جنسیت: {item.gender ? genderLabels[item.gender] : messages.none}</p>
            <p>شماره شناسنامه: {item.identityNumber ?? messages.none}</p>
            <p>محل صدور شناسنامه: {item.identityExportPlace ?? messages.none}</p>
            <p>تلفن: {item.phone ?? messages.none}</p>
            <p>ایمیل: {item.email ?? messages.none}</p>
            <p>محل تولد: {item.birthPlace ?? messages.none}</p>
            <p>تاریخ تولد: {item.birthDate ?? messages.none}</p>
            {item.address ? (
              <>
                <p>
                  نشانی: {item.address.city}، {item.address.province}
                  {item.address.details ? ` — ${item.address.details}` : ""}
                  {item.address.plaque ? ` (پلاک ${item.address.plaque})` : ""}
                </p>
                <p>کد پستی: {item.address.postalCode ?? messages.none}</p>
              </>
            ) : null}
          </CardContent>
        </Card>

        <RelatedContractsCard contracts={item.contracts} showRole />
      </div>
    </div>
  );
}
