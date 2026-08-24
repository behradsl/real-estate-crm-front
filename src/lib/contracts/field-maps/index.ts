import type { ContractType } from "@/lib/api/types";
import type { ContractWizardState } from "@/lib/contracts/wizard";
import { partyDisplayName } from "@/lib/contracts/wizard";
import { constructionJvFieldMap, goodwillFieldMap, mutualRescissionFieldMap, preSaleFieldMap } from "./generic";
import { rentFieldMap } from "./rent";
import { saleFieldMap } from "./sale";
import type { TemplateFieldMap } from "./types";

export function getFieldMap(type: ContractType): TemplateFieldMap {
  switch (type) {
    case "SALE":
      return saleFieldMap;
    case "RENT":
      return rentFieldMap;
    case "GOODWILL":
      return goodwillFieldMap;
    case "PRE_SALE":
      return preSaleFieldMap;
    case "MUTUAL_RESCISSION":
      return mutualRescissionFieldMap;
    case "CONSTRUCTION_JOINT_VENTURE":
      return constructionJvFieldMap;
    default:
      return saleFieldMap;
  }
}

function partyAddress(party: ContractWizardState["firstParty"]) {
  if (!party?.address) return "";
  const a = party.address;
  return [a.city, a.province, a.details, a.plaque].filter(Boolean).join("، ");
}

function propertyAddress(property: ContractWizardState["property"]) {
  if (!property?.address) return "";
  const a = property.address;
  return [a.city, a.province, a.details, a.plaque].filter(Boolean).join("، ");
}

/** Flatten wizard state into field-id → display string. */
export function valuesFromWizardState(
  state: ContractWizardState,
): Record<string, string> {
  const deed = state.property?.deedInfo;
  const values: Record<string, string> = {
    contractNumber: state.contractNumber,
    commissionAmount: state.commissionAmount || state.commissionPercentage,
    taxAmount: state.taxAmount || state.taxPercentage,

    "firstParty.name": partyDisplayName(state.firstParty),
    "firstParty.fatherName": state.firstParty?.fatherName ?? "",
    "firstParty.identityNumber": state.firstParty?.identityNumber ?? "",
    "firstParty.identityExportPlace":
      state.firstParty?.identityExportPlace ?? "",
    "firstParty.nationalCode": state.firstParty?.nationalCode ?? "",
    "firstParty.birthPlace": state.firstParty?.birthPlace ?? "",
    "firstParty.address": partyAddress(state.firstParty),
    "firstParty.phone": state.firstParty?.phone ?? "",

    "secondParty.name": partyDisplayName(state.secondParty),
    "secondParty.fatherName": state.secondParty?.fatherName ?? "",
    "secondParty.identityNumber": state.secondParty?.identityNumber ?? "",
    "secondParty.nationalCode": state.secondParty?.nationalCode ?? "",
    "secondParty.address": partyAddress(state.secondParty),
    "secondParty.phone": state.secondParty?.phone ?? "",

    "property.title": state.property?.title ?? "",
    "property.areaSqm":
      state.property?.areaSqm != null ? String(state.property.areaSqm) : "",
    "property.cadastralNumber": deed?.cadastralNumber ?? "",
    "property.address": propertyAddress(state.property),
    "property.postalCode":
      deed?.postalCode ?? state.property?.address?.postalCode ?? "",

    "sale.shareUnits": state.sale.shareUnits,
    "sale.totalRials": state.sale.totalRials,
    "sale.totalInWords": state.sale.totalInWords,
    "sale.downPaymentRials": state.sale.downPaymentRials,
    "sale.downPaymentBank": state.sale.downPaymentBank,
    "sale.remainingRials": state.sale.remainingRials,
    "sale.remainingDueAt": state.sale.remainingDueAt,
    "sale.notaryOffice": state.sale.notaryOffice,
    "sale.officialDeedDueAt": state.sale.officialDeedDueAt,
    "sale.deliveryDueAt": state.sale.deliveryDueAt,
    "sale.delayPenaltyPerDayRials": state.sale.delayPenaltyPerDayRials,
    "sale.notes": state.sale.notes,

    "rent.shareUnits": state.rent.shareUnits,
    "rent.startDate": state.rent.startDate,
    "rent.endDate": state.rent.endDate,
    "rent.durationMonths": state.rent.durationMonths,
    "rent.totalRials": state.rent.totalRials,
    "rent.monthlyRials": state.rent.monthlyRials,
    "rent.monthlyInWords": state.rent.monthlyInWords,
    "rent.securityDepositRials": state.rent.securityDepositRials,
    "rent.bankName": state.rent.bankName,
    "rent.accountNumber": state.rent.accountNumber,
    "rent.delayPenaltyPerDayRials": state.rent.delayPenaltyPerDayRials,
    "rent.notes": state.rent.notes,

    "generic.shareUnits": state.generic.shareUnits,
    "generic.totalRials": state.generic.totalRials,
    "generic.monthlyRials": state.generic.monthlyRials,
    "generic.depositRials": state.generic.depositRials,

    "sign.firstParty": partyDisplayName(state.firstParty),
    "sign.secondParty": partyDisplayName(state.secondParty),
    "sign.witness1": partyDisplayName(state.witnesses[0]),
    "sign.witness2": partyDisplayName(state.witnesses[1]),
  };

  return values;
}

export * from "./types";
