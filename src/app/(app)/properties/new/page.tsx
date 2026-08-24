"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { PropertyForm } from "@/components/properties/property-form";
import { propertiesApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { messages } from "@/lib/labels";

export default function NewPropertyPage() {
  const router = useRouter();

  return (
    <div>
      <PageHeader
        title="ثبت ملک جدید"
        description="نشانی، امکانات ثابت، امکانات تکمیلی و مشخصات سند را وارد کنید."
      />
      <PropertyForm
        submitLabel="ثبت ملک"
        submittingLabel={messages.creating}
        onSubmit={async (payload) => {
          try {
            const created = await propertiesApi.create(payload);
            toast.success("ملک با موفقیت ثبت شد");
            router.push(`/properties/${created.id}`);
          } catch (error) {
            toast.error(
              error instanceof ApiError ? error.message : messages.createFailed,
            );
          }
        }}
      />
    </div>
  );
}
