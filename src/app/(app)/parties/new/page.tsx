"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { PartyForm } from "@/components/parties/party-form";
import { partiesApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { messages } from "@/lib/labels";

export default function NewPartyPage() {
  const router = useRouter();

  return (
    <div>
      <PageHeader
        title="ثبت طرف قرارداد"
        description="شخص حقیقی یا حقوقی را برای استفاده در قراردادها ثبت کنید."
      />
      <PartyForm
        submitLabel="ثبت طرف قرارداد"
        submittingLabel={messages.creating}
        onSubmit={async (payload) => {
          try {
            const created = await partiesApi.create(payload);
            toast.success("طرف قرارداد ثبت شد");
            router.push(`/parties/${created.id}`);
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
