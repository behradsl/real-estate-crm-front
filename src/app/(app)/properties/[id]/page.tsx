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

function yn(value: boolean | null | undefined) {
  if (value == null) return "—";
  return value ? "Yes" : "No";
}

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

  const deed = item.deedInfo;

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
              Beds / baths: {item.bedrooms ?? "—"} / {item.bathrooms ?? "—"}
            </p>
            {item.address ? (
              <p>
                Address: {item.address.city}, {item.address.province}
                {item.address.details ? ` — ${item.address.details}` : ""}
                {item.address.plaque ? ` (پلاک ${item.address.plaque})` : ""}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Facilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>Water: {yn(item.water)}</p>
            <p>Electricity: {yn(item.electricity)}</p>
            <p>Gas: {yn(item.gas)}</p>
            <p>Telephone: {yn(item.telephone)}</p>
            <p>
              Parking: {yn(item.parking)}
              {item.parkingCount != null ? ` (${item.parkingCount})` : ""}
            </p>
            <p>
              Storage: {yn(item.storage)}
              {item.storageCount != null ? ` ×${item.storageCount}` : ""}
              {item.storageArea != null ? ` — ${item.storageArea} m²` : ""}
            </p>
            <p>Elevator: {yn(item.elevator)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Other facilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {item.otherFacilities?.length ? (
              item.otherFacilities.map((f, i) => (
                <p key={`${f.name}-${i}`}>
                  {f.name}
                  {f.kind ? `: ${f.kind}` : ""}
                </p>
              ))
            ) : (
              <p className="text-muted-foreground">None</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Deed info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {deed ? (
              <>
                <p>Cadastral: {deed.cadastralNumber ?? "—"}</p>
                <p>Sub / main parcel: {deed.subParcelNumber ?? "—"} / {deed.mainParcelNumber ?? "—"}</p>
                <p>Plot / district: {deed.plotNumber ?? "—"} / {deed.cadastralDistrict ?? "—"}</p>
                <p>Registration area: {deed.registrationArea ?? "—"}</p>
                <p>Area: {deed.areaSqm ?? "—"} m²</p>
                <p>Postal code: {deed.postalCode ?? "—"}</p>
              </>
            ) : (
              <p className="text-muted-foreground">No deed info</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
