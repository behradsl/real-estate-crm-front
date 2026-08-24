"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { OrganizationEditForm } from "@/components/organizations/organization-edit-form";
import { useAuth } from "@/components/providers/auth-provider";
import { organizationsApi } from "@/lib/api";
import type { Organization } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { messages } from "@/lib/labels";

export default function EditOrganizationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
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

  if (!hasRole("ADMIN", "OWNER")) {
    return (
      <p className="text-sm leading-relaxed text-muted-foreground">
        به ویرایش آژانس دسترسی ندارید.
      </p>
    );
  }

  if (!item) {
    return <p className="text-sm leading-relaxed text-muted-foreground">{messages.loading}</p>;
  }

  return (
    <div>
      <PageHeader title="ویرایش آژانس" description={item.name} />
      <OrganizationEditForm
        key={item.id}
        initial={item}
        onSubmit={async (payload) => {
          try {
            const updated = await organizationsApi.update(item.id, payload);
            toast.success("تغییرات آژانس ذخیره شد");
            router.push(`/organizations/${updated.id}`);
          } catch (error) {
            toast.error(
              error instanceof ApiError ? error.message : messages.saveFailed,
            );
          }
        }}
      />
    </div>
  );
}
