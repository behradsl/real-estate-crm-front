"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { PropertyForm } from "@/components/properties/property-form";
import { propertiesApi } from "@/lib/api";
import type { Property } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { messages } from "@/lib/labels";

export default function EditPropertyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
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

  return (
    <div>
      <PageHeader
        title="ویرایش ملک"
        description={item.title}
      />
      <PropertyForm
        key={item.id}
        initial={item}
        submitLabel={messages.save}
        onSubmit={async (payload) => {
          try {
            const updated = await propertiesApi.update(item.id, payload);
            toast.success("تغییرات ملک ذخیره شد");
            router.push(`/properties/${updated.id}`);
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
