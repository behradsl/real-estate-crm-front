"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { propertiesApi } from "@/lib/api";
import type { Property } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<Property | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setItem(await propertiesApi.get(params.id));
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : "Load failed");
      }
    })();
  }, [params.id]);

  if (!item) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <div>
      <PageHeader
        title={item.title}
        description={item.description ?? undefined}
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge>{item.propertyType}</Badge>
        {item.referenceCode ? (
          <Badge variant="secondary">{item.referenceCode}</Badge>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>Area: {item.areaSqm ?? "—"} m²</p>
            <p>
              Floor: {item.floor ?? "—"} / {item.totalFloors ?? "—"}
            </p>
            <p>Year: {item.yearBuilt ?? "—"}</p>
            <p>
              Beds / baths / parking: {item.bedrooms ?? "—"} /{" "}
              {item.bathrooms ?? "—"} / {item.parkingSpots ?? "—"}
            </p>
            {item.address ? (
              <p>
                Address: {item.address.city}, {item.address.province}
                {item.address.street ? ` — ${item.address.street}` : ""}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Facilities</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-auto rounded-lg bg-muted p-3 text-xs">
              {JSON.stringify(item.facilities, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Deed info</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-auto rounded-lg bg-muted p-3 text-xs">
              {JSON.stringify(item.deedInfo?.data ?? null, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
