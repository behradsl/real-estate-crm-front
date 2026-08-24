"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ContractWizard } from "@/components/contracts/contract-wizard";
import { contractsApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { contractToWizardState } from "@/lib/contracts/from-contract";
import type { ContractWizardState } from "@/lib/contracts/wizard";
import { messages } from "@/lib/labels";

export default function EditContractPage() {
  const params = useParams<{ id: string }>();
  const [initialState, setInitialState] = useState<ContractWizardState | null>(
    null,
  );

  useEffect(() => {
    void (async () => {
      try {
        const contract = await contractsApi.get(params.id);
        const state = contractToWizardState(contract);
        state.step = "basics";
        setInitialState(state);
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : messages.loadFailed);
      }
    })();
  }, [params.id]);

  if (!initialState) {
    return <p className="text-sm leading-relaxed text-muted-foreground">{messages.loading}</p>;
  }

  return (
    <ContractWizard
      key={params.id}
      contractId={params.id}
      initialState={initialState}
    />
  );
}
