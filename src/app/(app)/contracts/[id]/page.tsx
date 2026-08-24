"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { contractsApi } from "@/lib/api";
import type { Contract } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { contractToWizardState } from "@/lib/contracts/from-contract";
import type { ContractPreviewMode } from "@/lib/contracts/templates";
import {
  ContractPreview,
  printContract,
} from "@/components/contracts/contract-preview";
import { partyDisplayName } from "@/lib/contracts/wizard";
import { formatDateTime } from "@/lib/format";
import {
  contractPartyRoleLabels,
  contractTypeLabels,
  messages,
} from "@/lib/labels";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContractDetailPage() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<Contract | null>(null);
  const [partyId, setPartyId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState<ContractPreviewMode>("full");

  async function load() {
    try {
      const contract = await contractsApi.get(params.id);
      setItem(contract);
      const first = contract.parties?.find((p) => p.role === "FIRST_PARTY");
      if (first) setPartyId(first.partyId);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : messages.loadFailed);
    }
  }

  useEffect(() => {
    void load();
  }, [params.id]);

  const wizardState = useMemo(
    () => (item ? contractToWizardState(item) : null),
    [item],
  );

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
      toast.success("امضا ثبت شد");
      await load();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "ثبت امضا انجام نشد",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function printNow(mode: ContractPreviewMode) {
    setPreviewMode(mode);
    printContract(mode);
  }

  if (!item || !wizardState) {
    return <p className="text-sm leading-relaxed text-muted-foreground">{messages.loading}</p>;
  }

  return (
    <div>
      <PageHeader
        title={item.contractNumber}
        description={item.description ?? undefined}
        actions={
          <Button asChild variant="secondary">
            <Link href={`/contracts/${item.id}/edit`}>{messages.edit}</Link>
          </Button>
        }
      />
      <div className="mb-6 flex flex-wrap gap-2">
        <Badge>{contractTypeLabels[item.contractType]}</Badge>
        {item.totalAmount ? (
          <Badge variant="secondary">مبلغ کل: {item.totalAmount}</Badge>
        ) : null}
        {item.monthlyAmount ? (
          <Badge variant="secondary">اجاره ماهانه: {item.monthlyAmount}</Badge>
        ) : null}
        {item.signedAt ? (
          <Badge variant="secondary">امضاشده</Badge>
        ) : (
          <Badge variant="outline">پیش‌نویس</Badge>
        )}
      </div>

      <Card className="mb-5 print:hidden">
        <CardHeader>
          <CardTitle>پیش‌نمایش و چاپ</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={previewMode === "full" ? "default" : "outline"}
            onClick={() => setPreviewMode("full")}
          >
            پیش‌نمایش کامل
          </Button>
          <Button
            type="button"
            variant={previewMode === "print-only" ? "default" : "outline"}
            onClick={() => setPreviewMode("print-only")}
          >
            فقط چاپ فیلدها
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => printNow(previewMode)}
          >
            {messages.print}
          </Button>
        </CardContent>
      </Card>

      <div
        id="contract-print-root"
        className="mb-6 rounded-xl border bg-muted/30 p-4"
      >
        <ContractPreview state={wizardState} mode={previewMode} />
      </div>

      <div className="grid gap-5 md:grid-cols-2 print:hidden">
        <Card>
          <CardHeader>
            <CardTitle>طرفین</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed">
            {(item.parties ?? []).map((link) => (
              <p key={link.id}>
                <span className="font-medium">
                  {contractPartyRoleLabels[link.role]}
                </span>
                : {partyDisplayName(link.party)}
              </p>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ثبت امضا</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={addSignature}>
              <div className="space-y-2">
                <Label>شناسه طرف قرارداد</Label>
                <Input
                  value={partyId}
                  onChange={(e) => setPartyId(e.target.value)}
                  required
                  dir="ltr"
                />
              </div>
              <Button disabled={submitting} type="submit">
                {submitting ? messages.saving : "ثبت امضا"}
              </Button>
            </form>
            <div className="mt-5 space-y-2 text-sm leading-relaxed">
              {(item.signatures ?? []).map((signature) => (
                <p key={signature.id}>
                  {signature.partyId.slice(0, 8)}… در{" "}
                  {formatDateTime(signature.signedAt)}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>مبالغ قرارداد</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm leading-relaxed md:grid-cols-3">
            <p>مبلغ کل: {item.totalAmount ?? messages.none}</p>
            <p>اجاره ماهانه: {item.monthlyAmount ?? messages.none}</p>
            <p>ودیعه / رهن: {item.depositAmount ?? messages.none}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
