"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { PartyForm } from "@/components/parties/party-form";
import { partiesApi } from "@/lib/api";
import type { Party } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { partyDisplayName } from "@/lib/contracts/wizard";
import { messages } from "@/lib/labels";

export default function EditPartyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
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
      <PageHeader title="ویرایش طرف قرارداد" description={partyDisplayName(item)} />
      <PartyForm
        key={item.id}
        initial={item}
        submitLabel={messages.save}
        onSubmit={async (payload) => {
          try {
            const updated = await partiesApi.update(item.id, payload);
            toast.success("تغییرات طرف قرارداد ذخیره شد");
            router.push(`/parties/${updated.id}`);
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
