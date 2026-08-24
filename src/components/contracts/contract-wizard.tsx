"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { contractsApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import type { ContractType, Party } from "@/lib/api/types";
import { CONTRACT_TYPES } from "@/lib/examples";
import {
  WIZARD_STEPS,
  buildCreateContractPayload,
  createInitialWizardState,
  type ContractWizardState,
  type WizardStep,
} from "@/lib/contracts/wizard";
import {
  Field,
  NotesField,
  PartyPicker,
  PropertyPicker,
} from "@/components/contracts/entity-pickers";
import {
  ContractPreview,
  printContract,
} from "@/components/contracts/contract-preview";
import type { ContractPreviewMode } from "@/lib/contracts/templates";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

function stepIndex(step: WizardStep) {
  return WIZARD_STEPS.findIndex((s) => s.id === step);
}

export function ContractWizard() {
  const router = useRouter();
  const [state, setState] = useState<ContractWizardState>(createInitialWizardState);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<ContractPreviewMode>("full");

  function patch(partial: Partial<ContractWizardState>) {
    setState((prev) => ({ ...prev, ...partial }));
  }

  function go(step: WizardStep) {
    setState((prev) => ({ ...prev, step }));
  }

  function next() {
    const i = stepIndex(state.step);
    if (i < WIZARD_STEPS.length - 1) go(WIZARD_STEPS[i + 1].id);
  }

  function back() {
    const i = stepIndex(state.step);
    if (i > 0) go(WIZARD_STEPS[i - 1].id);
  }

  function validateCurrent(): string | null {
    if (state.step === "basics") {
      if (!state.contractNumber.trim()) return "Contract number is required";
    }
    if (state.step === "property") {
      if (!state.propertyId) return "Select or create a property";
    }
    if (state.step === "parties") {
      if (!state.firstPartyId || !state.secondPartyId) {
        return "Select first and second parties";
      }
      if (state.firstPartyId === state.secondPartyId) {
        return "First and second party must be different";
      }
    }
    if (state.step === "terms") {
      if (state.contractType === "SALE" && !state.sale.totalRials.trim()) {
        return "Sale total amount is required";
      }
      if (state.contractType === "RENT" && !state.rent.monthlyRials.trim()) {
        return "Monthly rent is required";
      }
    }
    return null;
  }

  function onNext() {
    const error = validateCurrent();
    if (error) {
      toast.error(error);
      return;
    }
    next();
  }

  async function onSave() {
    const error = validateCurrent();
    if (error) {
      toast.error(error);
      return;
    }
    if (!state.propertyId || !state.firstPartyId || !state.secondPartyId) {
      toast.error("Complete previous steps first");
      return;
    }
    setSaving(true);
    try {
      const created = await contractsApi.create(buildCreateContractPayload(state));
      toast.success("Contract saved");
      router.push(`/contracts/${created.id}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function printNow(mode: ContractPreviewMode) {
    setPreviewMode(mode);
    printContract(mode);
  }

  function toggleWitness(party: Party) {
    setState((prev) => {
      const exists = prev.witnessIds.includes(party.id);
      if (exists) {
        return {
          ...prev,
          witnessIds: prev.witnessIds.filter((id) => id !== party.id),
          witnesses: prev.witnesses.filter((w) => w.id !== party.id),
        };
      }
      return {
        ...prev,
        witnessIds: [...prev.witnessIds, party.id],
        witnesses: [...prev.witnesses, party],
      };
    });
  }

  return (
    <div>
      <PageHeader
        title="New contract"
        description="Step-by-step registration with typed terms and PDF preview/print."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {WIZARD_STEPS.map((step, index) => {
          const active = state.step === step.id;
          const done = stepIndex(state.step) > index;
          return (
            <Badge
              key={step.id}
              variant={active ? "default" : done ? "secondary" : "outline"}
            >
              {index + 1}. {step.label}
            </Badge>
          );
        })}
      </div>

      {state.step === "basics" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contract basics</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label="Type">
              <Select
                value={state.contractType}
                onValueChange={(v) => {
                  const contractType = v as ContractType;
                  patch({
                    contractType,
                    contractNumber: `CNT-${contractType}-${Date.now()
                      .toString()
                      .slice(-6)}`,
                  });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTRACT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Contract number">
              <Input
                value={state.contractNumber}
                onChange={(e) => patch({ contractNumber: e.target.value })}
              />
            </Field>
            <Field label="Description">
              <Input
                value={state.description}
                onChange={(e) => patch({ description: e.target.value })}
              />
            </Field>
            <Field label="Commission %">
              <Input
                type="number"
                value={state.commissionPercentage}
                onChange={(e) =>
                  patch({ commissionPercentage: e.target.value })
                }
              />
            </Field>
            <Field label="Commission amount (ریال)">
              <Input
                type="number"
                value={state.commissionAmount}
                onChange={(e) => patch({ commissionAmount: e.target.value })}
              />
            </Field>
            <Field label="Tax %">
              <Input
                type="number"
                value={state.taxPercentage}
                onChange={(e) => patch({ taxPercentage: e.target.value })}
              />
            </Field>
            <Field label="Tax amount (ریال)">
              <Input
                type="number"
                value={state.taxAmount}
                onChange={(e) => patch({ taxAmount: e.target.value })}
              />
            </Field>
          </CardContent>
        </Card>
      ) : null}

      {state.step === "property" ? (
        <PropertyPicker
          selected={state.property}
          onSelect={(property) =>
            patch({ property, propertyId: property.id })
          }
        />
      ) : null}

      {state.step === "parties" ? (
        <div className="space-y-4">
          <PartyPicker
            label="First party"
            selected={state.firstParty}
            onSelect={(party) =>
              patch({ firstParty: party, firstPartyId: party.id })
            }
          />
          <PartyPicker
            label="Second party"
            selected={state.secondParty}
            onSelect={(party) =>
              patch({ secondParty: party, secondPartyId: party.id })
            }
          />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Witnesses (optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <PartyPicker
                label="Add witness"
                selected={null}
                onSelect={toggleWitness}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {state.witnesses.map((w) => (
                  <Badge
                    key={w.id}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => toggleWitness(w)}
                  >
                    {w.firstName || w.companyName} ✕
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.step === "terms" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Terms — {state.contractType}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {state.contractType === "SALE" ? (
              <>
                <Field label="دانگ (share units)">
                  <Input
                    value={state.sale.shareUnits}
                    onChange={(e) =>
                      patch({
                        sale: { ...state.sale, shareUnits: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="مبلغ کل (ریال)">
                  <Input
                    value={state.sale.totalRials}
                    onChange={(e) =>
                      patch({ sale: { ...state.sale, totalRials: e.target.value } })
                    }
                  />
                </Field>
                <Field label="مبلغ به حروف">
                  <Input
                    value={state.sale.totalInWords}
                    onChange={(e) =>
                      patch({
                        sale: { ...state.sale, totalInWords: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="بیعانه (ریال)">
                  <Input
                    value={state.sale.downPaymentRials}
                    onChange={(e) =>
                      patch({
                        sale: {
                          ...state.sale,
                          downPaymentRials: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <Field label="نحوه پرداخت بیعانه">
                  <Input
                    value={state.sale.downPaymentMethod}
                    onChange={(e) =>
                      patch({
                        sale: {
                          ...state.sale,
                          downPaymentMethod: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <Field label="بانک بیعانه (اختیاری)">
                  <Input
                    value={state.sale.downPaymentBank}
                    onChange={(e) =>
                      patch({
                        sale: { ...state.sale, downPaymentBank: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="الباقی (ریال)">
                  <Input
                    value={state.sale.remainingRials}
                    onChange={(e) =>
                      patch({
                        sale: { ...state.sale, remainingRials: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="موعد الباقی">
                  <Input
                    value={state.sale.remainingDueAt}
                    onChange={(e) =>
                      patch({
                        sale: { ...state.sale, remainingDueAt: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="دفترخانه">
                  <Input
                    value={state.sale.notaryOffice}
                    onChange={(e) =>
                      patch({
                        sale: { ...state.sale, notaryOffice: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="تاریخ انتقال سند">
                  <Input
                    value={state.sale.officialDeedDueAt}
                    onChange={(e) =>
                      patch({
                        sale: {
                          ...state.sale,
                          officialDeedDueAt: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <Field label="تاریخ تحویل">
                  <Input
                    value={state.sale.deliveryDueAt}
                    onChange={(e) =>
                      patch({
                        sale: { ...state.sale, deliveryDueAt: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="وجه التزام روزانه (ریال)">
                  <Input
                    value={state.sale.delayPenaltyPerDayRials}
                    onChange={(e) =>
                      patch({
                        sale: {
                          ...state.sale,
                          delayPenaltyPerDayRials: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <div className="md:col-span-2">
                  <NotesField
                    value={state.sale.notes}
                    onChange={(notes) =>
                      patch({ sale: { ...state.sale, notes } })
                    }
                  />
                </div>
              </>
            ) : null}

            {state.contractType === "RENT" ? (
              <>
                <Field label="دانگ (share units)">
                  <Input
                    value={state.rent.shareUnits}
                    onChange={(e) =>
                      patch({
                        rent: { ...state.rent, shareUnits: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="تاریخ شروع">
                  <Input
                    value={state.rent.startDate}
                    onChange={(e) =>
                      patch({
                        rent: { ...state.rent, startDate: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="تاریخ پایان">
                  <Input
                    value={state.rent.endDate}
                    onChange={(e) =>
                      patch({
                        rent: { ...state.rent, endDate: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="مدت (ماه)">
                  <Input
                    value={state.rent.durationMonths}
                    onChange={(e) =>
                      patch({
                        rent: { ...state.rent, durationMonths: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="اجاره کل دوره (ریال)">
                  <Input
                    value={state.rent.totalRials}
                    onChange={(e) =>
                      patch({
                        rent: { ...state.rent, totalRials: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="اجاره ماهانه (ریال)">
                  <Input
                    value={state.rent.monthlyRials}
                    onChange={(e) =>
                      patch({
                        rent: { ...state.rent, monthlyRials: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="اجاره ماهانه به حروف">
                  <Input
                    value={state.rent.monthlyInWords}
                    onChange={(e) =>
                      patch({
                        rent: { ...state.rent, monthlyInWords: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="ودیعه / رهن (ریال)">
                  <Input
                    value={state.rent.securityDepositRials}
                    onChange={(e) =>
                      patch({
                        rent: {
                          ...state.rent,
                          securityDepositRials: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <Field label="روز پرداخت ماهانه">
                  <Input
                    value={state.rent.paymentDayOfMonth}
                    onChange={(e) =>
                      patch({
                        rent: {
                          ...state.rent,
                          paymentDayOfMonth: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <Field label="بانک">
                  <Input
                    value={state.rent.bankName}
                    onChange={(e) =>
                      patch({
                        rent: { ...state.rent, bankName: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="شماره حساب (اختیاری)">
                  <Input
                    value={state.rent.accountNumber}
                    onChange={(e) =>
                      patch({
                        rent: { ...state.rent, accountNumber: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="وجه التزام روزانه (ریال)">
                  <Input
                    value={state.rent.delayPenaltyPerDayRials}
                    onChange={(e) =>
                      patch({
                        rent: {
                          ...state.rent,
                          delayPenaltyPerDayRials: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <div className="md:col-span-2">
                  <NotesField
                    value={state.rent.notes}
                    onChange={(notes) =>
                      patch({ rent: { ...state.rent, notes } })
                    }
                  />
                </div>
              </>
            ) : null}

            {state.contractType !== "SALE" && state.contractType !== "RENT" ? (
              <>
                {(state.contractType === "GOODWILL" ||
                  state.contractType === "CONSTRUCTION_JOINT_VENTURE") && (
                  <Field label="دانگ (share units)">
                    <Input
                      value={state.generic.shareUnits}
                      onChange={(e) =>
                        patch({
                          generic: {
                            ...state.generic,
                            shareUnits: e.target.value,
                          },
                        })
                      }
                    />
                  </Field>
                )}
                <Field label="مبلغ کل (ریال)">
                  <Input
                    value={state.generic.totalRials}
                    onChange={(e) =>
                      patch({
                        generic: {
                          ...state.generic,
                          totalRials: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <Field label="ماهانه (ریال)">
                  <Input
                    value={state.generic.monthlyRials}
                    onChange={(e) =>
                      patch({
                        generic: {
                          ...state.generic,
                          monthlyRials: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <Field label="ودیعه (ریال)">
                  <Input
                    value={state.generic.depositRials}
                    onChange={(e) =>
                      patch({
                        generic: {
                          ...state.generic,
                          depositRials: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <Field label="شروع">
                  <Input
                    value={state.generic.startDate}
                    onChange={(e) =>
                      patch({
                        generic: {
                          ...state.generic,
                          startDate: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <Field label="پایان">
                  <Input
                    value={state.generic.endDate}
                    onChange={(e) =>
                      patch({
                        generic: { ...state.generic, endDate: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="تحویل">
                  <Input
                    value={state.generic.deliveryDueAt}
                    onChange={(e) =>
                      patch({
                        generic: {
                          ...state.generic,
                          deliveryDueAt: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <Field label="انتقال سند">
                  <Input
                    value={state.generic.officialDeedDueAt}
                    onChange={(e) =>
                      patch({
                        generic: {
                          ...state.generic,
                          officialDeedDueAt: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <div className="md:col-span-2">
                  <NotesField
                    value={state.generic.notes}
                    onChange={(notes) =>
                      patch({ generic: { ...state.generic, notes } })
                    }
                  />
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {state.step === "review" ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">PDF preview & print</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={previewMode === "full" ? "default" : "outline"}
                onClick={() => setPreviewMode("full")}
              >
                Full preview
              </Button>
              <Button
                type="button"
                variant={previewMode === "print-only" ? "default" : "outline"}
                onClick={() => setPreviewMode("print-only")}
              >
                Print only
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => printNow(previewMode)}
              >
                Print
              </Button>
              <Button type="button" disabled={saving} onClick={() => void onSave()}>
                {saving ? "Saving…" : "Save contract"}
              </Button>
            </CardContent>
          </Card>

          <div id="contract-print-root" className="rounded-xl border bg-muted/30 p-4">
            <ContractPreview state={state} mode={previewMode} />
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex justify-between">
        <Button
          type="button"
          variant="outline"
          disabled={state.step === "basics"}
          onClick={back}
        >
          Back
        </Button>
        {state.step !== "review" ? (
          <Button type="button" onClick={onNext}>
            Next
          </Button>
        ) : (
          <Button type="button" disabled={saving} onClick={() => void onSave()}>
            {saving ? "Saving…" : "Save contract"}
          </Button>
        )}
      </div>
    </div>
  );
}
