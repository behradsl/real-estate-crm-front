"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { contractsApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import type { ContractType, Party } from "@/lib/api/types";
import { CONTRACT_TYPES } from "@/lib/examples";
import { contractTypeLabels, messages } from "@/lib/labels";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  WIZARD_STEPS,
  buildCreateContractPayload,
  createInitialWizardState,
  type ContractWizardState,
  type LawyerForm,
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

const LAWYER_FIELDS: { key: keyof LawyerForm; label: string }[] = [
  { key: "name", label: "نام و نام خانوادگی" },
  { key: "fatherName", label: "نام پدر" },
  { key: "identityNumber", label: "شماره شناسنامه" },
  { key: "birthPlace", label: "محل تولد" },
  { key: "birthDate", label: "تاریخ تولد" },
  { key: "identityExportPlace", label: "محل صدور" },
  { key: "nationalCode", label: "کد ملی" },
  { key: "address", label: "نشانی" },
  { key: "postalCode", label: "کد پستی" },
  { key: "cause", label: "علت وکالت" },
];

const SALE_FIELDS: {
  key: keyof ContractWizardState["sale"];
  label: string;
  span?: boolean;
}[] = [
  { key: "shareUnits", label: "دانگ" },
  { key: "totalAmount", label: "مبلغ کل (ریال)" },
  { key: "totalInWords", label: "مبلغ به حروف" },
  { key: "pricePerSqm", label: "قیمت هر متر (ریال)" },
  { key: "prePaymentAmount", label: "بیعانه (ریال)" },
  { key: "prePaymentChequeNumber", label: "شماره چک بیعانه" },
  { key: "prePaymentBankName", label: "بانک بیعانه" },
  { key: "prePaymentBankBranch", label: "شعبه بانک بیعانه" },
  { key: "remainderAmount", label: "الباقی (ریال)" },
  { key: "voucherRegistrationDate", label: "تاریخ ثبت سند/بنچاق" },
  { key: "voucherOrganizationNumber", label: "شماره دفترخانه / سازمان" },
  { key: "deliveryDate", label: "تاریخ تحویل" },
  { key: "cancelationPenalty", label: "وجه التزام فسخ" },
  { key: "breachPenalty", label: "وجه التزام تخلف" },
  { key: "notaryFeePayer", label: "عهده‌دار هزینه دفترخانه" },
  {
    key: "delayPenaltyFirstPartyPerDay",
    label: "وجه التزام تأخیر طرف اول (روزانه)",
  },
  {
    key: "delayPenaltySecondPartyPerDay",
    label: "وجه التزام تأخیر طرف دوم (روزانه)",
  },
];

const RENT_FIELDS: {
  key: keyof ContractWizardState["rent"];
  label: string;
}[] = [
  { key: "shareUnits", label: "دانگ" },
  { key: "durationMonths", label: "مدت (ماه)" },
  { key: "fromDate", label: "از تاریخ" },
  { key: "toDate", label: "تا تاریخ" },
  { key: "monthlyAmount", label: "اجاره ماهانه (ریال)" },
  { key: "monthlyInWords", label: "اجاره ماهانه به حروف" },
  { key: "mortgageAmount", label: "رهن / ودیعه (ریال)" },
  { key: "mortgageInWords", label: "رهن به حروف" },
  { key: "totalInWords", label: "جمع به حروف" },
  { key: "prePaymentAmount", label: "پیش‌پرداخت (ریال)" },
  { key: "prePaymentChequeNumber", label: "شماره چک پیش‌پرداخت" },
  { key: "prePaymentBankName", label: "بانک پیش‌پرداخت" },
  { key: "prePaymentBankBranch", label: "شعبه بانک" },
  { key: "remainderAmount", label: "الباقی (ریال)" },
  { key: "remainderDueDate", label: "موعد الباقی" },
  { key: "deliveryDate", label: "تاریخ تحویل" },
  { key: "cancelationPenalty", label: "وجه التزام فسخ" },
  { key: "breachPenalty", label: "وجه التزام تخلف" },
  { key: "notaryFeePayer", label: "عهده‌دار هزینه دفترخانه" },
  {
    key: "delayPenaltyFirstPartyPerDay",
    label: "وجه التزام تأخیر طرف اول (روزانه)",
  },
  {
    key: "delayPenaltySecondPartyPerDay",
    label: "وجه التزام تأخیر طرف دوم (روزانه)",
  },
];

const GOODWILL_FIELDS: {
  key: keyof ContractWizardState["goodwill"];
  label: string;
}[] = [
  { key: "shareUnits", label: "دانگ" },
  { key: "pricePerSqm", label: "قیمت هر متر (ریال)" },
  { key: "totalAmount", label: "مبلغ سرقفلی (ریال)" },
  { key: "prePaymentAmount", label: "بیعانه (ریال)" },
  { key: "prePaymentChequeNumber", label: "شماره چک بیعانه" },
  { key: "prePaymentBankName", label: "بانک بیعانه" },
  { key: "prePaymentBankBranch", label: "شعبه بانک" },
  { key: "remainderAmount", label: "الباقی (ریال)" },
  { key: "remainderDueDate", label: "موعد الباقی" },
  { key: "penaltyAmount", label: "وجه التزام" },
  { key: "deliveryDate", label: "تاریخ تحویل" },
];

const PRESALE_FIELDS: {
  key: keyof ContractWizardState["presale"];
  label: string;
}[] = [
  { key: "renovationCode", label: "کد نوسازی" },
  { key: "technicalIdNumber", label: "شناسه فنی" },
  { key: "insuranceNumber", label: "شماره بیمه" },
  { key: "buildingPermitNumber", label: "شماره پروانه" },
  { key: "buildingPermitDate", label: "تاریخ پروانه" },
  { key: "equipped", label: "تجهیزات / مجهز بودن" },
  { key: "totalFloors", label: "تعداد طبقات" },
  { key: "totalUnits", label: "تعداد واحدها" },
  { key: "areaSqm", label: "متراژ (مترمربع)" },
  { key: "storage", label: "انباری" },
  { key: "orientation", label: "جهت واحد" },
  { key: "parkingNumberAndArea", label: "پارکینگ (شماره و متراژ)" },
  { key: "flooringType", label: "نوع کف‌پوش" },
  { key: "cabinetAndFaucetType", label: "کابینت و شیرآلات" },
  { key: "bathroomType", label: "سرویس بهداشتی" },
  { key: "switchOutletType", label: "کلید و پریز" },
  { key: "entranceDoorType", label: "درب ورودی" },
  { key: "interiorDoorType", label: "درب داخلی" },
  { key: "ceilingPlasterType", label: "گچ‌بری سقف" },
  { key: "emergencyWaterSourceType", label: "منبع آب اضطراری" },
  { key: "heatingType", label: "سیستم گرمایش" },
  { key: "coolerType", label: "سیستم سرمایش" },
  { key: "intercomType", label: "آیفون" },
  { key: "cctv", label: "دوربین مدار بسته" },
  { key: "tilingType", label: "کاشی‌کاری" },
  { key: "windowType", label: "پنجره" },
  { key: "facadeType", label: "نما" },
  { key: "parkingFloorWallCover", label: "پوشش کف و دیوار پارکینگ" },
  { key: "lighting", label: "روشنایی" },
  { key: "balconyCorridorRailing", label: "نرده بالکن/راهرو" },
  { key: "fireExtinguisher", label: "اطفای حریق" },
  { key: "elevator", label: "آسانسور" },
  { key: "waterMotor", label: "موتور آب" },
  { key: "utilitiesScore", label: "امتیاز انشعابات" },
  { key: "loan", label: "وام" },
  { key: "loanType", label: "نوع وام" },
  { key: "loanInstallmentAmount", label: "قسط وام (ریال)" },
  { key: "totalAmount", label: "مبلغ کل (ریال)" },
  { key: "totalInWords", label: "مبلغ به حروف" },
  { key: "deliveryDate", label: "تاریخ تحویل" },
  { key: "deedTransferDate", label: "تاریخ انتقال سند" },
  { key: "selfDeclareFormNumber", label: "شماره فرم خوداظهاری" },
  { key: "voucherOrganizationNumber", label: "شماره دفترخانه / سازمان" },
];

const RESCISSION_FIELDS: {
  key: keyof ContractWizardState["rescission"];
  label: string;
}[] = [
  { key: "originalContractNumber", label: "شماره قرارداد اصلی" },
  { key: "originalContractDate", label: "تاریخ قرارداد اصلی" },
  { key: "originalAgencyName", label: "نام آژانس قرارداد اصلی" },
  { key: "shareUnits", label: "دانگ" },
  { key: "areaSqm", label: "متراژ (مترمربع)" },
  { key: "county", label: "شهرستان" },
  { key: "ownershipNumber", label: "شماره مالکیت" },
  { key: "aggregationClause", label: "بند تجمیع" },
  { key: "deliveryClause", label: "بند تحویل" },
  { key: "price", label: "مبلغ (ریال)" },
  { key: "paymentType", label: "نحوه پرداخت" },
];

const CJV_FIELDS: {
  key: keyof ContractWizardState["cjv"];
  label: string;
}[] = [
  { key: "propertyDescription", label: "شرح ملک" },
  { key: "shareUnits", label: "دانگ" },
  { key: "areaSqm", label: "متراژ (مترمربع)" },
  { key: "totalAmount", label: "مبلغ کل (ریال)" },
  { key: "totalInWords", label: "مبلغ به حروف" },
  { key: "governmentalCosts", label: "هزینه‌های دولتی" },
  { key: "constructionCosts", label: "هزینه‌های ساخت" },
  { key: "facilityRightsCosts", label: "حقوق تسهیلات" },
  { key: "destructionCost", label: "هزینه تخریب" },
  { key: "firstPartyShare", label: "سهم طرف اول" },
  { key: "secondPartyShare", label: "سهم طرف دوم" },
  { key: "startDateInWords", label: "تاریخ شروع (به حروف)" },
  { key: "endDateInWords", label: "تاریخ پایان (به حروف)" },
  { key: "costDetailsPrepareDate", label: "تاریخ تهیه جزئیات هزینه" },
  { key: "voucherTransferDate", label: "تاریخ انتقال سند" },
  { key: "shareUnitsToTransfer", label: "دانگ قابل انتقال" },
  {
    key: "delayPenaltyFirstPartyPerDay",
    label: "وجه التزام تأخیر طرف اول (روزانه)",
  },
  {
    key: "delayPenaltySecondPartyPerDay",
    label: "وجه التزام تأخیر طرف دوم (روزانه)",
  },
];

function LawyerCard({
  title,
  lawyer,
  onChange,
}: {
  title: string;
  lawyer: LawyerForm;
  onChange: (next: LawyerForm) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 md:grid-cols-2">
        {LAWYER_FIELDS.map(({ key, label }) => (
          <Field key={key} label={label}>
            <Input
              value={lawyer[key]}
              onChange={(e) => onChange({ ...lawyer, [key]: e.target.value })}
            />
          </Field>
        ))}
      </CardContent>
    </Card>
  );
}

export function ContractWizard({
  contractId,
  initialState,
}: {
  contractId?: string;
  initialState?: ContractWizardState;
} = {}) {
  const router = useRouter();
  const isEdit = Boolean(contractId);
  const [state, setState] = useState<ContractWizardState>(
    () => initialState ?? createInitialWizardState(),
  );
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
      if (!state.contractNumber.trim()) return "وارد کردن شماره قرارداد الزامی است";
    }
    if (state.step === "property") {
      if (!state.propertyId) return "یک ملک را انتخاب یا ثبت کنید";
    }
    if (state.step === "parties") {
      if (!state.firstPartyId || !state.secondPartyId) {
        return "طرف اول و طرف دوم را انتخاب کنید";
      }
      if (state.firstPartyId === state.secondPartyId) {
        return "طرف اول و طرف دوم باید متفاوت باشند";
      }
    }
    if (state.step === "terms") {
      if (state.contractType === "SALE" && !state.sale.totalAmount.trim()) {
        return "وارد کردن مبلغ کل مبایعه‌نامه الزامی است";
      }
      if (state.contractType === "RENT" && !state.rent.monthlyAmount.trim()) {
        return "وارد کردن اجاره ماهانه الزامی است";
      }
      if (
        state.contractType === "GOODWILL" &&
        !state.goodwill.totalAmount.trim()
      ) {
        return "وارد کردن مبلغ سرقفلی الزامی است";
      }
      if (
        state.contractType === "PRE_SALE" &&
        !state.presale.totalAmount.trim()
      ) {
        return "وارد کردن مبلغ کل پیش‌فروش الزامی است";
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
      toast.error("ابتدا مراحل قبلی را تکمیل کنید");
      return;
    }
    setSaving(true);
    try {
      const payload = buildCreateContractPayload(state);
      if (isEdit && contractId) {
        await contractsApi.update(contractId, payload);
        toast.success("تغییرات قرارداد ذخیره شد");
        router.push(`/contracts/${contractId}`);
      } else {
        const created = await contractsApi.create(payload);
        toast.success("قرارداد ذخیره شد");
        router.push(`/contracts/${created.id}`);
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "ذخیره قرارداد انجام نشد");
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
        title={isEdit ? "ویرایش قرارداد" : "قرارداد جدید"}
        description={
          isEdit
            ? "شرایط، طرفین و مبالغ قرارداد را به‌روزرسانی کنید."
            : "ثبت گام‌به‌گام با شرایط مالی و پیش‌نمایش چاپی قرارداد."
        }
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
            <CardTitle>اطلاعات پایه قرارداد</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <Field label="نوع قرارداد">
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
                      {contractTypeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="شماره قرارداد">
              <Input
                value={state.contractNumber}
                onChange={(e) => patch({ contractNumber: e.target.value })}
              />
            </Field>
            <Field label="شرح قرارداد">
              <Input
                value={state.description}
                onChange={(e) => patch({ description: e.target.value })}
              />
            </Field>
            <Field label="تاریخ قرارداد">
              <Input
                value={state.contractDate}
                onChange={(e) => patch({ contractDate: e.target.value })}
                placeholder="1404/01/15"
              />
            </Field>
            <Field label="ساعت قرارداد">
              <Input
                value={state.contractTime}
                onChange={(e) => patch({ contractTime: e.target.value })}
                placeholder="10:30"
              />
            </Field>
            <Field label="درصد کمیسیون">
              <Input
                type="number"
                value={state.commissionPercentage}
                onChange={(e) =>
                  patch({ commissionPercentage: e.target.value })
                }
              />
            </Field>
            <Field label="مبلغ کمیسیون (ریال)">
              <Input
                type="number"
                value={state.commissionAmount}
                onChange={(e) => patch({ commissionAmount: e.target.value })}
              />
            </Field>
            <Field label="درصد مالیات">
              <Input
                type="number"
                value={state.taxPercentage}
                onChange={(e) => patch({ taxPercentage: e.target.value })}
              />
            </Field>
            <Field label="مبلغ مالیات (ریال)">
              <Input
                type="number"
                value={state.taxAmount}
                onChange={(e) => patch({ taxAmount: e.target.value })}
              />
            </Field>
            <Field label="کمیسیون طرف اول (ریال)">
              <Input
                type="number"
                value={state.firstPartyCommissionAmount}
                onChange={(e) =>
                  patch({ firstPartyCommissionAmount: e.target.value })
                }
              />
            </Field>
            <Field label="کمیسیون طرف دوم (ریال)">
              <Input
                type="number"
                value={state.secondPartyCommissionAmount}
                onChange={(e) =>
                  patch({ secondPartyCommissionAmount: e.target.value })
                }
              />
            </Field>
            <Field label="قوانین کمیسیون شهر">
              <Input
                value={state.commissionCityRules}
                onChange={(e) =>
                  patch({ commissionCityRules: e.target.value })
                }
              />
            </Field>
            <Field label="شماره فاکتور کمیسیون">
              <Input
                value={state.commissionFactorNumber}
                onChange={(e) =>
                  patch({ commissionFactorNumber: e.target.value })
                }
              />
            </Field>
            <Field label="شماره فاکتور طرف اول">
              <Input
                value={state.firstPartyFactorNumber}
                onChange={(e) =>
                  patch({ firstPartyFactorNumber: e.target.value })
                }
              />
            </Field>
            <Field label="شماره فاکتور طرف دوم">
              <Input
                value={state.secondPartyFactorNumber}
                onChange={(e) =>
                  patch({ secondPartyFactorNumber: e.target.value })
                }
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
        <div className="space-y-5">
          <PartyPicker
            label="طرف اول"
            selected={state.firstParty}
            onSelect={(party) =>
              patch({ firstParty: party, firstPartyId: party.id })
            }
          />
          <PartyPicker
            label="طرف دوم"
            selected={state.secondParty}
            onSelect={(party) =>
              patch({ secondParty: party, secondPartyId: party.id })
            }
          />
          <Card>
            <CardHeader>
              <CardTitle>شاهدان (اختیاری)</CardTitle>
            </CardHeader>
            <CardContent>
              <PartyPicker
                label="افزودن شاهد"
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

      {state.step === "lawyers" ? (
        <div className="space-y-5">
          <p className="text-sm text-muted-foreground">
            وکیل طرفین اختیاری است؛ می‌توانید این مرحله را رد کنید.
          </p>
          <LawyerCard
            title="وکیل طرف اول (اختیاری)"
            lawyer={state.lawyers.firstPartyLawyer}
            onChange={(firstPartyLawyer) =>
              patch({
                lawyers: { ...state.lawyers, firstPartyLawyer },
              })
            }
          />
          <LawyerCard
            title="وکیل طرف دوم (اختیاری)"
            lawyer={state.lawyers.secondPartyLawyer}
            onChange={(secondPartyLawyer) =>
              patch({
                lawyers: { ...state.lawyers, secondPartyLawyer },
              })
            }
          />
        </div>
      ) : null}

      {state.step === "terms" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              شرایط — {contractTypeLabels[state.contractType]}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            {state.contractType === "SALE" ? (
              <>
                {SALE_FIELDS.map(({ key, label }) => (
                  <Field key={key} label={label}>
                    <Input
                      value={state.sale[key]}
                      onChange={(e) =>
                        patch({
                          sale: { ...state.sale, [key]: e.target.value },
                        })
                      }
                    />
                  </Field>
                ))}
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
                {RENT_FIELDS.map(({ key, label }) => (
                  <Field key={key} label={label}>
                    <Input
                      value={state.rent[key]}
                      onChange={(e) =>
                        patch({
                          rent: { ...state.rent, [key]: e.target.value },
                        })
                      }
                    />
                  </Field>
                ))}
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

            {state.contractType === "GOODWILL" ? (
              <>
                {GOODWILL_FIELDS.map(({ key, label }) => (
                  <Field key={key} label={label}>
                    <Input
                      value={state.goodwill[key]}
                      onChange={(e) =>
                        patch({
                          goodwill: {
                            ...state.goodwill,
                            [key]: e.target.value,
                          },
                        })
                      }
                    />
                  </Field>
                ))}
                <div className="md:col-span-2">
                  <NotesField
                    value={state.goodwill.notes}
                    onChange={(notes) =>
                      patch({ goodwill: { ...state.goodwill, notes } })
                    }
                  />
                </div>
              </>
            ) : null}

            {state.contractType === "PRE_SALE" ? (
              <>
                {PRESALE_FIELDS.map(({ key, label }) => (
                  <Field key={key} label={label}>
                    <Input
                      value={state.presale[key]}
                      onChange={(e) =>
                        patch({
                          presale: {
                            ...state.presale,
                            [key]: e.target.value,
                          },
                        })
                      }
                    />
                  </Field>
                ))}
                <div className="md:col-span-2">
                  <NotesField
                    value={state.presale.notes}
                    onChange={(notes) =>
                      patch({ presale: { ...state.presale, notes } })
                    }
                  />
                </div>
              </>
            ) : null}

            {state.contractType === "MUTUAL_RESCISSION" ? (
              <>
                {RESCISSION_FIELDS.map(({ key, label }) => (
                  <Field key={key} label={label}>
                    <Input
                      value={state.rescission[key]}
                      onChange={(e) =>
                        patch({
                          rescission: {
                            ...state.rescission,
                            [key]: e.target.value,
                          },
                        })
                      }
                    />
                  </Field>
                ))}
                <div className="md:col-span-2">
                  <NotesField
                    value={state.rescission.notes}
                    onChange={(notes) =>
                      patch({ rescission: { ...state.rescission, notes } })
                    }
                  />
                </div>
              </>
            ) : null}

            {state.contractType === "CONSTRUCTION_JOINT_VENTURE" ? (
              <>
                {CJV_FIELDS.map(({ key, label }) => (
                  <Field key={key} label={label}>
                    <Input
                      value={state.cjv[key]}
                      onChange={(e) =>
                        patch({
                          cjv: { ...state.cjv, [key]: e.target.value },
                        })
                      }
                    />
                  </Field>
                ))}
                <div className="md:col-span-2">
                  <NotesField
                    value={state.cjv.notes}
                    onChange={(notes) =>
                      patch({ cjv: { ...state.cjv, notes } })
                    }
                  />
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {state.step === "review" ? (
        <div className="space-y-5">
          <Card>
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
              <Button type="button" disabled={saving} onClick={() => void onSave()}>
                {saving ? messages.saving : "ذخیره قرارداد"}
              </Button>
            </CardContent>
          </Card>

          <div id="contract-print-root" className="rounded-xl border bg-muted/30 p-4">
            <ContractPreview
              state={state}
              mode={previewMode}
              organizationId={
                state.property?.organizationId ?? undefined
              }
            />
          </div>
        </div>
      ) : null}

      <div className="mt-8 flex justify-between">
        <Button
          type="button"
          variant="outline"
          disabled={state.step === "basics"}
          onClick={back}
        >
          <ChevronRight className="size-4" />
          {messages.back}
        </Button>
        {state.step !== "review" ? (
          <Button type="button" onClick={onNext}>
            {state.step === "lawyers" ? "ادامه (رد کردن وکلا)" : messages.next}
            <ChevronLeft className="size-4" />
          </Button>
        ) : (
          <Button type="button" disabled={saving} onClick={() => void onSave()}>
            {saving ? messages.saving : "ذخیره قرارداد"}
          </Button>
        )}
      </div>
    </div>
  );
}
