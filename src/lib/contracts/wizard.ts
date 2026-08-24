import type {
  ContractType,
  CreateContractInput,
  JsonObject,
  Party,
  Property,
} from "@/lib/api/types";

export type WizardStep =
  | "basics"
  | "property"
  | "parties"
  | "terms"
  | "review";

export interface SaleTermsForm {
  shareUnits: string;
  totalRials: string;
  totalInWords: string;
  downPaymentRials: string;
  downPaymentMethod: string;
  downPaymentBank: string;
  remainingRials: string;
  remainingDueAt: string;
  notaryOffice: string;
  officialDeedDueAt: string;
  deliveryDueAt: string;
  delayPenaltyPerDayRials: string;
  notes: string;
}

export interface RentTermsForm {
  shareUnits: string;
  startDate: string;
  endDate: string;
  durationMonths: string;
  totalRials: string;
  monthlyRials: string;
  monthlyInWords: string;
  securityDepositRials: string;
  paymentDayOfMonth: string;
  bankName: string;
  accountNumber: string;
  delayPenaltyPerDayRials: string;
  notes: string;
}

export interface GenericTermsForm {
  shareUnits: string;
  totalRials: string;
  monthlyRials: string;
  depositRials: string;
  startDate: string;
  endDate: string;
  deliveryDueAt: string;
  officialDeedDueAt: string;
  notes: string;
}

export interface ContractWizardState {
  step: WizardStep;
  contractType: ContractType;
  contractNumber: string;
  description: string;
  commissionPercentage: string;
  commissionAmount: string;
  taxPercentage: string;
  taxAmount: string;
  firstPartyCommissionAmount: string;
  secondPartyCommissionAmount: string;
  propertyId: string;
  property: Property | null;
  firstPartyId: string;
  secondPartyId: string;
  witnessIds: string[];
  firstParty: Party | null;
  secondParty: Party | null;
  witnesses: Party[];
  sale: SaleTermsForm;
  rent: RentTermsForm;
  generic: GenericTermsForm;
}

export const WIZARD_STEPS: { id: WizardStep; label: string }[] = [
  { id: "basics", label: "Basics" },
  { id: "property", label: "Property" },
  { id: "parties", label: "Parties" },
  { id: "terms", label: "Terms" },
  { id: "review", label: "Review & print" },
];

export function defaultSaleTerms(): SaleTermsForm {
  return {
    shareUnits: "6",
    totalRials: "15000000000",
    totalInWords: "پانزده میلیارد ریال",
    downPaymentRials: "2000000000",
    downPaymentMethod: "CASH",
    downPaymentBank: "",
    remainingRials: "13000000000",
    remainingDueAt: "1404/02/20",
    notaryOffice: "دفترخانه شماره ۱۲ همدان",
    officialDeedDueAt: "1404/02/20",
    deliveryDueAt: "1404/02/25",
    delayPenaltyPerDayRials: "5000000",
    notes: "",
  };
}

export function defaultRentTerms(): RentTermsForm {
  return {
    shareUnits: "6",
    startDate: "1404/01/01",
    endDate: "1405/01/01",
    durationMonths: "12",
    totalRials: "1200000000",
    monthlyRials: "100000000",
    monthlyInWords: "یکصد میلیون ریال",
    securityDepositRials: "500000000",
    paymentDayOfMonth: "5",
    bankName: "ملی",
    accountNumber: "",
    delayPenaltyPerDayRials: "2000000",
    notes: "",
  };
}

export function defaultGenericTerms(): GenericTermsForm {
  return {
    shareUnits: "6",
    totalRials: "",
    monthlyRials: "",
    depositRials: "",
    startDate: "",
    endDate: "",
    deliveryDueAt: "",
    officialDeedDueAt: "",
    notes: "",
  };
}

/** Share units (دانگ) apply to sale, rent, goodwill, and construction JV — not deed. */
export function contractTypeHasShareUnits(type: ContractType): boolean {
  return (
    type === "SALE" ||
    type === "RENT" ||
    type === "GOODWILL" ||
    type === "CONSTRUCTION_JOINT_VENTURE"
  );
}

export function createInitialWizardState(): ContractWizardState {
  return {
    step: "basics",
    contractType: "SALE",
    contractNumber: `CNT-SALE-${Date.now().toString().slice(-6)}`,
    description: "",
    commissionPercentage: "1.5",
    commissionAmount: "",
    taxPercentage: "9",
    taxAmount: "",
    firstPartyCommissionAmount: "",
    secondPartyCommissionAmount: "",
    propertyId: "",
    property: null,
    firstPartyId: "",
    secondPartyId: "",
    witnessIds: [],
    firstParty: null,
    secondParty: null,
    witnesses: [],
    sale: defaultSaleTerms(),
    rent: defaultRentTerms(),
    generic: defaultGenericTerms(),
  };
}

function num(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : undefined;
}

function jalaliOrIsoToIso(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  // If already ISO-like, keep; otherwise store as noon UTC placeholder date string
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return new Date(trimmed).toISOString();
  }
  // Persian dates stay in terms JSON; CRM date columns only set for ISO inputs
  return undefined;
}

export function buildTermsAndConditions(state: ContractWizardState): JsonObject {
  if (state.contractType === "SALE") {
    const s = state.sale;
    return {
      type: "SALE",
      shareUnits: num(s.shareUnits),
      price: {
        totalRials: num(s.totalRials),
        totalInWords: s.totalInWords,
        currency: "IRR",
        payments: [
          {
            label: "بیعانه",
            amountRials: num(s.downPaymentRials),
            method: s.downPaymentMethod,
            bankName: s.downPaymentBank || undefined,
          },
          {
            label: "باقیمانده در دفترخانه",
            amountRials: num(s.remainingRials),
            dueAt: s.remainingDueAt,
            method: "BANK",
          },
        ],
      },
      transfer: {
        notaryOffice: s.notaryOffice,
        officialDeedDueAt: s.officialDeedDueAt,
        deliveryDueAt: s.deliveryDueAt,
      },
      penalties: {
        delayPenaltyPerDayRials: num(s.delayPenaltyPerDayRials),
      },
      notes: s.notes || undefined,
    };
  }

  if (state.contractType === "RENT") {
    const r = state.rent;
    return {
      type: "RENT",
      shareUnits: num(r.shareUnits),
      duration: {
        startDate: r.startDate,
        endDate: r.endDate,
        unit: "MONTH",
        value: num(r.durationMonths),
      },
      rent: {
        totalRials: num(r.totalRials),
        monthlyRials: num(r.monthlyRials),
        monthlyInWords: r.monthlyInWords,
        securityDepositRials: num(r.securityDepositRials),
        paymentDayOfMonth: num(r.paymentDayOfMonth),
        paymentMethod: {
          type: "BANK",
          bankName: r.bankName || undefined,
          accountNumber: r.accountNumber || undefined,
        },
      },
      penalties: {
        delayPenaltyPerDayRials: num(r.delayPenaltyPerDayRials),
      },
      notes: r.notes || undefined,
    };
  }

  const g = state.generic;
  return {
    type: state.contractType,
    ...(contractTypeHasShareUnits(state.contractType)
      ? { shareUnits: num(g.shareUnits) }
      : {}),
    financials: {
      totalRials: num(g.totalRials),
      monthlyRials: num(g.monthlyRials),
      depositRials: num(g.depositRials),
    },
    schedule: {
      startDate: g.startDate || undefined,
      endDate: g.endDate || undefined,
      deliveryDueAt: g.deliveryDueAt || undefined,
      officialDeedDueAt: g.officialDeedDueAt || undefined,
    },
    notes: g.notes || undefined,
  };
}

export function buildCreateContractPayload(
  state: ContractWizardState,
): CreateContractInput {
  const termsAndConditions = buildTermsAndConditions(state);
  const base: CreateContractInput = {
    contractType: state.contractType,
    contractNumber: state.contractNumber.trim(),
    propertyId: state.propertyId,
    firstPartyId: state.firstPartyId,
    secondPartyId: state.secondPartyId,
    witnessIds: state.witnessIds.length ? state.witnessIds : undefined,
    description: state.description.trim() || undefined,
    commissionPercentage: num(state.commissionPercentage),
    commissionAmount: num(state.commissionAmount),
    taxPercentage: num(state.taxPercentage),
    taxAmount: num(state.taxAmount),
    firstPartyCommissionAmount: num(state.firstPartyCommissionAmount),
    secondPartyCommissionAmount: num(state.secondPartyCommissionAmount),
    termsAndConditions,
  };

  if (state.contractType === "SALE") {
    return {
      ...base,
      totalAmount: num(state.sale.totalRials),
      deliveryDate: jalaliOrIsoToIso(state.sale.deliveryDueAt),
      officialDeedDate: jalaliOrIsoToIso(state.sale.officialDeedDueAt),
    };
  }

  if (state.contractType === "RENT") {
    return {
      ...base,
      totalAmount: num(state.rent.totalRials),
      monthlyAmount: num(state.rent.monthlyRials),
      depositAmount: num(state.rent.securityDepositRials),
      startDate: jalaliOrIsoToIso(state.rent.startDate),
      endDate: jalaliOrIsoToIso(state.rent.endDate),
    };
  }

  return {
    ...base,
    totalAmount: num(state.generic.totalRials),
    monthlyAmount: num(state.generic.monthlyRials),
    depositAmount: num(state.generic.depositRials),
    startDate: jalaliOrIsoToIso(state.generic.startDate),
    endDate: jalaliOrIsoToIso(state.generic.endDate),
    deliveryDate: jalaliOrIsoToIso(state.generic.deliveryDueAt),
    officialDeedDate: jalaliOrIsoToIso(state.generic.officialDeedDueAt),
  };
}

export function partyDisplayName(party: Party | null | undefined): string {
  if (!party) return "—";
  if (party.type === "COMPANY") return party.companyName ?? "شرکت";
  return (
    [party.firstName, party.lastName].filter(Boolean).join(" ") || "شخص"
  );
}
