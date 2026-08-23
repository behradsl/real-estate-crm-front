"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { contractsApi } from "@/lib/api";
import type { Contract } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { contractToWizardState } from "@/lib/contracts/from-contract";
import {
  GenericDocument,
  RentDocument,
  SaleDocument,
} from "@/components/contracts/documents";
import { ContractPreview } from "@/components/contracts/contract-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PreviewMode = "full" | "overlay" | "overlay-blank";

export default function ContractDetailPage() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<Contract | null>(null);
  const [partyId, setPartyId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("full");

  async function load() {
    try {
      const contract = await contractsApi.get(params.id);
      setItem(contract);
      const first = contract.parties?.find((p) => p.role === "FIRST_PARTY");
      if (first) setPartyId(first.partyId);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Load failed");
    }
  }

  useEffect(() => {
    void load();
  }, [params.id]);

  const wizardState = useMemo(
    () => (item ? contractToWizardState(item) : null),
    [item],
  );

  const documentNode = useMemo(() => {
    if (!wizardState) return null;
    if (wizardState.contractType === "SALE") {
      return <SaleDocument state={wizardState} />;
    }
    if (wizardState.contractType === "RENT") {
      return <RentDocument state={wizardState} />;
    }
    return <GenericDocument state={wizardState} />;
  }, [wizardState]);

  async function addSignature(event: React.FormEvent) {
    event.preventDefault();
    if (!partyId) return;
    setSubmitting(true);
    try {
      await contractsApi.addSignature(params.id, {
        partyId,
        data: {
          method: "DRAWN",
          signedByRole: "FIRST_PARTY",
          device: "web",
        },
        signedAt: new Date().toISOString(),
      });
      toast.success("Signature added");
      await load();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Signature failed",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function printNow(mode: PreviewMode) {
    setPreviewMode(mode);
    window.document.documentElement.setAttribute("data-contract-print", mode);
    window.setTimeout(() => {
      window.print();
      window.document.documentElement.removeAttribute("data-contract-print");
    }, 80);
  }

  if (!item || !wizardState || !documentNode) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <div>
      <PageHeader
        title={item.contractNumber}
        description={item.description ?? undefined}
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge>{item.contractType}</Badge>
        {item.totalAmount ? (
          <Badge variant="secondary">Total: {item.totalAmount}</Badge>
        ) : null}
        {item.monthlyAmount ? (
          <Badge variant="secondary">Monthly: {item.monthlyAmount}</Badge>
        ) : null}
        {item.signedAt ? (
          <Badge variant="secondary">Signed</Badge>
        ) : (
          <Badge variant="outline">Draft</Badge>
        )}
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Document actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={previewMode === "full" ? "default" : "outline"}
            onClick={() => setPreviewMode("full")}
          >
            Full HTML
          </Button>
          <Button
            type="button"
            variant={previewMode === "overlay" ? "default" : "outline"}
            onClick={() => setPreviewMode("overlay")}
          >
            Overlay on form
          </Button>
          <Button
            type="button"
            variant={previewMode === "overlay-blank" ? "default" : "outline"}
            onClick={() => setPreviewMode("overlay-blank")}
          >
            Blank-paper fields
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => printNow(previewMode)}
          >
            Print / Save PDF
          </Button>
        </CardContent>
      </Card>

      <div
        id="contract-print-root"
        className="mb-6 rounded-xl border bg-muted/30 p-4"
      >
        <ContractPreview state={wizardState} mode={previewMode}>
          {documentNode}
        </ContractPreview>
      </div>

      <div className="grid gap-4 md:grid-cols-2 print:hidden">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Parties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {(item.parties ?? []).map((link) => (
              <p key={link.id}>
                <span className="font-medium">{link.role}</span>:{" "}
                {link.party.type === "COMPANY"
                  ? link.party.companyName
                  : [link.party.firstName, link.party.lastName]
                      .filter(Boolean)
                      .join(" ")}
              </p>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add signature</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={addSignature}>
              <div className="space-y-2">
                <Label>Party id</Label>
                <Input
                  value={partyId}
                  onChange={(e) => setPartyId(e.target.value)}
                  required
                />
              </div>
              <Button disabled={submitting} type="submit">
                {submitting ? "Saving…" : "Add signature"}
              </Button>
            </form>
            <div className="mt-4 space-y-2 text-sm">
              {(item.signatures ?? []).map((signature) => (
                <p key={signature.id}>
                  {signature.partyId.slice(0, 8)}… at{" "}
                  {new Date(signature.signedAt).toLocaleString()}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">CRM amounts</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm md:grid-cols-3">
            <p>Total: {item.totalAmount ?? "—"}</p>
            <p>Monthly: {item.monthlyAmount ?? "—"}</p>
            <p>Deposit: {item.depositAmount ?? "—"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
