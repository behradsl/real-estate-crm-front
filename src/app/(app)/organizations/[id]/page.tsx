"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { organizationsApi } from "@/lib/api";
import type { Organization } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrganizationDetailPage() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<Organization | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setItem(await organizationsApi.get(params.id));
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
      <PageHeader title={item.name} description={`Slug: ${item.slug}`} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>Email: {item.email ?? "—"}</p>
          <p>Phone: {item.phone ?? "—"}</p>
          <p>Website: {item.website ?? "—"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
