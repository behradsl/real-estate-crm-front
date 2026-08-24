import type {
  Contract,
  ContractType,
  JsonObject,
  Party,
  Property,
} from "@/lib/api/types";
import {
  createInitialWizardState,
  defaultGenericTerms,
  defaultRentTerms,
  defaultSaleTerms,
  type ContractWizardState,
  type RentTermsForm,
  type SaleTermsForm,
} from "@/lib/contracts/wizard";

function partyByRole(contract: Contract, role: string): Party | null {
  return contract.parties?.find((p) => p.role === role)?.party ?? null;
}

function asRecord(value: unknown): JsonObject {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonObject)
    : {};
}

function str(value: unknown): string {
  return value == null ? "" : String(value);
}

export function contractToWizardState(contract: Contract): ContractWizardState {
  const terms = asRecord(contract.termsAndConditions);
  const type = contract.contractType as ContractType;
  const firstParty = partyByRole(contract, "FIRST_PARTY");
  const secondParty = partyByRole(contract, "SECOND_PARTY");
  const witnesses =
    contract.parties
      ?.filter((p) => p.role === "WITNESS")
      .map((p) => p.party) ?? [];

  const base = createInitialWizardState();
  base.step = "review";
  base.contractType = type;
  base.contractNumber = contract.contractNumber;
  base.description = contract.description ?? "";
  base.commissionPercentage = contract.commissionPercentage ?? "";
  base.commissionAmount = contract.commissionAmount ?? "";
  base.taxPercentage = contract.taxPercentage ?? "";
  base.taxAmount = contract.taxAmount ?? "";
  base.firstPartyCommissionAmount =
    contract.firstPartyCommissionAmount ?? "";
  base.secondPartyCommissionAmount =
    contract.secondPartyCommissionAmount ?? "";
  base.propertyId = contract.propertyId;
  base.property = (contract.property as Property | undefined) ?? null;
  base.firstPartyId = firstParty?.id ?? "";
  base.secondPartyId = secondParty?.id ?? "";
  base.firstParty = firstParty;
  base.secondParty = secondParty;
  base.witnessIds = witnesses.map((w) => w.id);
  base.witnesses = witnesses;

  if (type === "SALE") {
    const price = asRecord(terms.price);
    const payments = Array.isArray(price.payments)
      ? (price.payments as JsonObject[])
      : [];
    const down = asRecord(payments[0]);
    const remain = asRecord(payments[1]);
    const transfer = asRecord(terms.transfer);
    const penalties = asRecord(terms.penalties);
    const sale: SaleTermsForm = {
      ...defaultSaleTerms(),
      shareUnits: str(terms.shareUnits),
      totalRials: str(price.totalRials ?? contract.totalAmount),
      totalInWords: str(price.totalInWords),
      downPaymentRials: str(down.amountRials),
      downPaymentMethod: str(down.method || "CASH"),
      downPaymentBank: str(down.bankName),
      remainingRials: str(remain.amountRials),
      remainingDueAt: str(remain.dueAt),
      notaryOffice: str(transfer.notaryOffice),
      officialDeedDueAt: str(transfer.officialDeedDueAt),
      deliveryDueAt: str(transfer.deliveryDueAt),
      delayPenaltyPerDayRials: str(penalties.delayPenaltyPerDayRials),
      notes: str(terms.notes),
    };
    base.sale = sale;
  } else if (type === "RENT") {
    const duration = asRecord(terms.duration);
    const rent = asRecord(terms.rent);
    const paymentMethod = asRecord(rent.paymentMethod);
    const penalties = asRecord(terms.penalties);
    const rentForm: RentTermsForm = {
      ...defaultRentTerms(),
      shareUnits: str(terms.shareUnits),
      startDate: str(duration.startDate),
      endDate: str(duration.endDate),
      durationMonths: str(duration.value),
      totalRials: str(rent.totalRials ?? contract.totalAmount),
      monthlyRials: str(rent.monthlyRials ?? contract.monthlyAmount),
      monthlyInWords: str(rent.monthlyInWords),
      securityDepositRials: str(
        rent.securityDepositRials ?? contract.depositAmount,
      ),
      paymentDayOfMonth: str(rent.paymentDayOfMonth),
      bankName: str(paymentMethod.bankName),
      accountNumber: str(paymentMethod.accountNumber),
      delayPenaltyPerDayRials: str(penalties.delayPenaltyPerDayRials),
      notes: str(terms.notes),
    };
    base.rent = rentForm;
  } else {
    const financials = asRecord(terms.financials);
    const schedule = asRecord(terms.schedule);
    base.generic = {
      ...defaultGenericTerms(),
      shareUnits: str(terms.shareUnits),
      totalRials: str(financials.totalRials ?? contract.totalAmount),
      monthlyRials: str(financials.monthlyRials ?? contract.monthlyAmount),
      depositRials: str(financials.depositRials ?? contract.depositAmount),
      startDate: str(schedule.startDate),
      endDate: str(schedule.endDate),
      deliveryDueAt: str(schedule.deliveryDueAt),
      officialDeedDueAt: str(schedule.officialDeedDueAt),
      notes: str(terms.notes),
    };
  }

  return base;
}
