"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { propertiesApi } from "@/lib/api";
import type { Property } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { formatArea } from "@/lib/format";
import { messages, propertyTypeLabels, yn } from "@/lib/labels";
import { RelatedContractsCard } from "@/components/contracts/related-contracts-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<Property | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setItem(await propertiesApi.get(params.id));
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : messages.loadFailed);
      }
    })();
  }, [params.id]);

  if (!item) {
    return <p className="text-sm leading-relaxed text-muted-foreground">{messages.loading}</p>;
  }

  const deed = item.deedInfo;

  return (
    <div>
      <PageHeader
        title={item.title}
        description={item.description ?? undefined}
        actions={
          <Button asChild variant="secondary">
            <Link href={`/properties/${item.id}/edit`}>{messages.edit}</Link>
          </Button>
        }
      />
      <div className="mb-6 flex flex-wrap gap-2">
        <Badge>{propertyTypeLabels[item.propertyType]}</Badge>
        {item.referenceCode ? (
          <Badge variant="secondary">{item.referenceCode}</Badge>
        ) : null}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>مشخصات ملک</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed">
            <p>متراژ: {formatArea(item.areaSqm)}</p>
            <p>
              طبقه: {item.floor ?? messages.none} از {item.totalFloors ?? messages.none}
            </p>
            <p>سال ساخت: {item.yearBuilt ?? messages.none}</p>
            <p>
              خواب / سرویس: {item.bedrooms ?? messages.none} / {item.bathrooms ?? messages.none}
            </p>
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

        <Card>
          <CardHeader>
            <CardTitle>امکانات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed">
            <p>آب: {yn(item.water)}</p>
            <p>برق: {yn(item.electricity)}</p>
            <p>گاز: {yn(item.gas)}</p>
            <p>تلفن: {yn(item.telephone)}</p>
            <p>
              پارکینگ: {yn(item.parking)}
              {item.parkingCount != null ? ` (${item.parkingCount})` : ""}
            </p>
            <p>
              انباری: {yn(item.storage)}
              {item.storageCount != null ? ` ×${item.storageCount}` : ""}
              {item.storageArea != null ? ` — ${formatArea(item.storageArea)}` : ""}
            </p>
            <p>آسانسور: {yn(item.elevator)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>امکانات تکمیلی</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed">
            {item.otherFacilities?.length ? (
              item.otherFacilities.map((f, i) => (
                <p key={`${f.name}-${i}`}>
                  {f.name}
                  {f.kind ? `: ${f.kind}` : ""}
                </p>
              ))
            ) : (
              <p className="text-muted-foreground">موردی ثبت نشده است</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>مشخصات سند</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed">
            {deed ? (
              <>
                <p>پلاک ثبتی: {deed.cadastralNumber ?? messages.none}</p>
                <p>
                  قطعه فرعی / اصلی: {deed.subParcelNumber ?? messages.none} /{" "}
                  {deed.mainParcelNumber ?? messages.none}
                </p>
                <p>
                  شماره قطعه / بخش: {deed.plotNumber ?? messages.none} /{" "}
                  {deed.cadastralDistrict ?? messages.none}
                </p>
                <p>حوزه ثبتی: {deed.registrationArea ?? messages.none}</p>
                <p>سریال سند: {deed.deedSerialNumber ?? messages.none}</p>
                <p>متراژ سند: {formatArea(deed.areaSqm)}</p>
                <p>کد پستی: {deed.postalCode ?? messages.none}</p>
              </>
            ) : (
              <p className="text-muted-foreground">اطلاعات سند ثبت نشده است</p>
            )}
          </CardContent>
        </Card>

        <RelatedContractsCard contracts={item.contracts} />
      </div>
    </div>
  );
}
