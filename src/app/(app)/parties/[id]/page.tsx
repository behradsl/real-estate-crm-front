"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { partiesApi } from "@/lib/api";
import type { Party } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PartyDetailPage() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<Party | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setItem(await partiesApi.get(params.id));
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : "Load failed");
      }
    })();
  }, [params.id]);

  if (!item) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  const title =
    item.type === "COMPANY"
      ? item.companyName ?? "Company"
      : [item.firstName, item.lastName].filter(Boolean).join(" ") || "Person";

  return (
    <div>
      <PageHeader title={title} />
      <div className="mb-4">
        <Badge>{item.type}</Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>National code: {item.nationalCode ?? "—"}</p>
          <p>Economic code: {item.economicCode ?? "—"}</p>
          <p>Father: {item.fatherName ?? "—"}</p>
          <p>Gender: {item.gender ?? "—"}</p>
          <p>Phone: {item.phone ?? "—"}</p>
          <p>Email: {item.email ?? "—"}</p>
          <p>Birth place: {item.birthPlace ?? "—"}</p>
          {item.address ? (
            <p>
              Address: {item.address.city}, {item.address.province}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
