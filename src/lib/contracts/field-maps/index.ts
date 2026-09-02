import type { ContractType } from "@/lib/api/types";
import type { ContractWizardState, LawyerForm } from "@/lib/contracts/wizard";
import { partyDisplayName } from "@/lib/contracts/wizard";
import { propertyTypeLabels } from "@/lib/labels";
import {
  constructionJvFieldMap,
  goodwillFieldMap,
  mutualRescissionFieldMap,
  preSaleFieldMap,
} from "./generic";
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

function lawyerValues(
  prefix: "firstParty" | "secondParty",
  lawyer: LawyerForm,
): Record<string, string> {
  return {
    [`${prefix}.lawyer.name`]: lawyer.name,
    [`${prefix}.lawyer.fatherName`]: lawyer.fatherName,
    [`${prefix}.lawyer.identityNumber`]: lawyer.identityNumber,
    [`${prefix}.lawyer.birthPlace`]: lawyer.birthPlace,
    [`${prefix}.lawyer.birthDate`]: lawyer.birthDate,
    [`${prefix}.lawyer.identityExportPlace`]: lawyer.identityExportPlace,
    [`${prefix}.lawyer.nationalCode`]: lawyer.nationalCode,
    [`${prefix}.lawyer.address`]: lawyer.address,
    [`${prefix}.lawyer.postalCode`]: lawyer.postalCode,
    [`${prefix}.lawyer.cause`]: lawyer.cause,
  };
}

function partyValues(
  prefix: "firstParty" | "secondParty",
  party: ContractWizardState["firstParty"],
): Record<string, string> {
  return {
    [`${prefix}.name`]: partyDisplayName(party),
    [`${prefix}.fatherName`]: party?.fatherName ?? "",
    [`${prefix}.identityNumber`]: party?.identityNumber ?? "",
    [`${prefix}.identityExportPlace`]: party?.identityExportPlace ?? "",
    [`${prefix}.nationalCode`]: party?.nationalCode ?? "",
    [`${prefix}.birthPlace`]: party?.birthPlace ?? "",
    [`${prefix}.birthDate`]: party?.birthDate ?? "",
    [`${prefix}.address`]: partyAddress(party),
    [`${prefix}.postalCode`]: party?.address?.postalCode ?? "",
    [`${prefix}.phone`]: party?.phone ?? "",
  };
}

/** Flatten wizard state into field-id → display string (catalog keys + legacy aliases). */
export function valuesFromWizardState(
  state: ContractWizardState,
): Record<string, string> {
  const deed = state.property?.deedInfo;
  const property = state.property;
  const parkingLabel =
    property?.parking == null
      ? ""
      : property.parking
        ? property.parkingCount != null
          ? String(property.parkingCount)
          : "دارد"
        : "ندارد";
  const storageLabel =
    property?.storage == null
      ? ""
      : property.storage
        ? property.storageCount != null
          ? String(property.storageCount)
          : "دارد"
        : "ندارد";

  const shareUnits =
    state.contractType === "SALE"
      ? state.sale.shareUnits
      : state.contractType === "RENT"
        ? state.rent.shareUnits
        : state.contractType === "GOODWILL"
          ? state.goodwill.shareUnits
          : state.contractType === "MUTUAL_RESCISSION"
            ? state.rescission.shareUnits
            : state.contractType === "CONSTRUCTION_JOINT_VENTURE"
              ? state.cjv.shareUnits
              : state.generic.shareUnits;

  const pricePerSqm =
    state.contractType === "SALE"
      ? state.sale.pricePerSqm
      : state.contractType === "GOODWILL"
        ? state.goodwill.pricePerSqm
        : state.sale.pricePerSqm;

  const areaOverride =
    state.contractType === "MUTUAL_RESCISSION"
      ? state.rescission.areaSqm
      : state.contractType === "CONSTRUCTION_JOINT_VENTURE"
        ? state.cjv.areaSqm
        : state.contractType === "PRE_SALE"
          ? state.presale.areaSqm
          : "";

  const values: Record<string, string> = {
    // Legacy seed-map aliases
    contractNumber: state.contractNumber,
    commissionAmount: state.commissionAmount || state.commissionPercentage,
    taxAmount: state.taxAmount || state.taxPercentage,

    ...partyValues("firstParty", state.firstParty),
    ...lawyerValues("firstParty", state.lawyers.firstPartyLawyer),
    ...partyValues("secondParty", state.secondParty),
    ...lawyerValues("secondParty", state.lawyers.secondPartyLawyer),

    "property.shareUnits": shareUnits,
    "property.type": property
      ? propertyTypeLabels[property.propertyType]
      : "",
    "property.cadastralNumber": deed?.cadastralNumber ?? "",
    "property.subParcelNumber": deed?.subParcelNumber ?? "",
    "property.mainParcelNumber": deed?.mainParcelNumber ?? "",
    "property.yearBuilt":
      property?.yearBuilt != null ? String(property.yearBuilt) : "",
    "property.cadastralDistrict": deed?.cadastralDistrict ?? "",
    "property.registrationArea": deed?.registrationArea ?? "",
    "property.areaSqm":
      areaOverride ||
      (property?.areaSqm != null
        ? String(property.areaSqm)
        : deed?.areaSqm != null
          ? String(deed.areaSqm)
          : ""),
    "property.pricePerSqm": pricePerSqm,
    "property.parking": parkingLabel,
    "property.storage":
      state.contractType === "PRE_SALE" && state.presale.storage
        ? state.presale.storage
        : storageLabel,
    "property.address": propertyAddress(property),
    "property.postalCode":
      deed?.postalCode ?? property?.address?.postalCode ?? "",
    "property.deedSerialNumber": deed?.deedSerialNumber ?? "",
    "property.ownerName": "",
    "property.bedrooms":
      property?.bedrooms != null ? String(property.bedrooms) : "",
    "property.title": property?.title ?? "",
    "property.county": state.rescission.county,
    "property.ownershipNumber": state.rescission.ownershipNumber,

    "sale.totalAmount": state.sale.totalAmount,
    "sale.totalInWords": state.sale.totalInWords,
    "sale.prePaymentAmount": state.sale.prePaymentAmount,
    "sale.prePaymentChequeNumber": state.sale.prePaymentChequeNumber,
    "sale.prePaymentBankName": state.sale.prePaymentBankName,
    "sale.prePaymentBankBranch": state.sale.prePaymentBankBranch,
    "sale.remainderAmount": state.sale.remainderAmount,
    "sale.voucherRegistrationDate": state.sale.voucherRegistrationDate,
    "sale.voucherOrganizationNumber": state.sale.voucherOrganizationNumber,
    "sale.deliveryDate": state.sale.deliveryDate,
    "sale.cancelationPenalty": state.sale.cancelationPenalty,
    "sale.breachPenalty": state.sale.breachPenalty,
    "sale.notaryFeePayer": state.sale.notaryFeePayer,
    "sale.delayPenaltyFirstPartyPerDay":
      state.sale.delayPenaltyFirstPartyPerDay,
    "sale.delayPenaltySecondPartyPerDay":
      state.sale.delayPenaltySecondPartyPerDay,
    // Legacy sale aliases used by seed maps
    "sale.shareUnits": state.sale.shareUnits,
    "sale.totalRials": state.sale.totalAmount,
    "sale.downPaymentRials": state.sale.prePaymentAmount,
    "sale.downPaymentBank": state.sale.prePaymentBankName,
    "sale.remainingRials": state.sale.remainderAmount,
    "sale.remainingDueAt": state.sale.voucherRegistrationDate,
    "sale.notaryOffice": state.sale.voucherOrganizationNumber,
    "sale.officialDeedDueAt": state.sale.voucherRegistrationDate,
    "sale.deliveryDueAt": state.sale.deliveryDate,
    "sale.delayPenaltyPerDayRials": state.sale.delayPenaltyFirstPartyPerDay,
    "sale.notes": state.sale.notes,

    "rent.durationMonths": state.rent.durationMonths,
    "rent.fromDate": state.rent.fromDate,
    "rent.toDate": state.rent.toDate,
    "rent.monthlyAmount": state.rent.monthlyAmount,
    "rent.monthlyInWords": state.rent.monthlyInWords,
    "rent.mortgageAmount": state.rent.mortgageAmount,
    "rent.mortgageInWords": state.rent.mortgageInWords,
    "rent.totalInWords": state.rent.totalInWords,
    "rent.prePaymentAmount": state.rent.prePaymentAmount,
    "rent.prePaymentChequeNumber": state.rent.prePaymentChequeNumber,
    "rent.prePaymentBankName": state.rent.prePaymentBankName,
    "rent.prePaymentBankBranch": state.rent.prePaymentBankBranch,
    "rent.remainderAmount": state.rent.remainderAmount,
    "rent.remainderDueDate": state.rent.remainderDueDate,
    "rent.deliveryDate": state.rent.deliveryDate,
    "rent.cancelationPenalty": state.rent.cancelationPenalty,
    "rent.breachPenalty": state.rent.breachPenalty,
    "rent.notaryFeePayer": state.rent.notaryFeePayer,
    "rent.delayPenaltyFirstPartyPerDay":
      state.rent.delayPenaltyFirstPartyPerDay,
    "rent.delayPenaltySecondPartyPerDay":
      state.rent.delayPenaltySecondPartyPerDay,
    // Legacy rent aliases
    "rent.shareUnits": state.rent.shareUnits,
    "rent.startDate": state.rent.fromDate,
    "rent.endDate": state.rent.toDate,
    "rent.totalRials": state.rent.totalInWords,
    "rent.monthlyRials": state.rent.monthlyAmount,
    "rent.securityDepositRials": state.rent.mortgageAmount,
    "rent.bankName": state.rent.prePaymentBankName,
    "rent.accountNumber": "",
    "rent.delayPenaltyPerDayRials": state.rent.delayPenaltyFirstPartyPerDay,
    "rent.notes": state.rent.notes,
    "rent.paymentDayOfMonth": "",

    "goodwill.totalAmount": state.goodwill.totalAmount,
    "goodwill.prePaymentAmount": state.goodwill.prePaymentAmount,
    "goodwill.prePaymentChequeNumber": state.goodwill.prePaymentChequeNumber,
    "goodwill.prePaymentBankName": state.goodwill.prePaymentBankName,
    "goodwill.prePaymentBankBranch": state.goodwill.prePaymentBankBranch,
    "goodwill.remainderAmount": state.goodwill.remainderAmount,
    "goodwill.remainderDueDate": state.goodwill.remainderDueDate,
    "goodwill.penaltyAmount": state.goodwill.penaltyAmount,
    "goodwill.deliveryDate": state.goodwill.deliveryDate,

    "presale.renovationCode": state.presale.renovationCode,
    "presale.technicalIdNumber": state.presale.technicalIdNumber,
    "presale.insuranceNumber": state.presale.insuranceNumber,
    "presale.buildingPermitNumber": state.presale.buildingPermitNumber,
    "presale.buildingPermitDate": state.presale.buildingPermitDate,
    "presale.equipped": state.presale.equipped,
    "presale.totalFloors": state.presale.totalFloors,
    "presale.totalUnits": state.presale.totalUnits,
    "presale.areaSqm": state.presale.areaSqm,
    "presale.storage": state.presale.storage,
    "presale.orientation": state.presale.orientation,
    "presale.parkingNumberAndArea": state.presale.parkingNumberAndArea,
    "presale.flooringType": state.presale.flooringType,
    "presale.cabinetAndFaucetType": state.presale.cabinetAndFaucetType,
    "presale.bathroomType": state.presale.bathroomType,
    "presale.switchOutletType": state.presale.switchOutletType,
    "presale.entranceDoorType": state.presale.entranceDoorType,
    "presale.interiorDoorType": state.presale.interiorDoorType,
    "presale.ceilingPlasterType": state.presale.ceilingPlasterType,
    "presale.emergencyWaterSourceType": state.presale.emergencyWaterSourceType,
    "presale.heatingType": state.presale.heatingType,
    "presale.coolerType": state.presale.coolerType,
    "presale.intercomType": state.presale.intercomType,
    "presale.cctv": state.presale.cctv,
    "presale.tilingType": state.presale.tilingType,
    "presale.windowType": state.presale.windowType,
    "presale.facadeType": state.presale.facadeType,
    "presale.parkingFloorWallCover": state.presale.parkingFloorWallCover,
    "presale.lighting": state.presale.lighting,
    "presale.balconyCorridorRailing": state.presale.balconyCorridorRailing,
    "presale.fireExtinguisher": state.presale.fireExtinguisher,
    "presale.elevator": state.presale.elevator,
    "presale.waterMotor": state.presale.waterMotor,
    "presale.utilitiesScore": state.presale.utilitiesScore,
    "presale.loan": state.presale.loan,
    "presale.loanType": state.presale.loanType,
    "presale.loanInstallmentAmount": state.presale.loanInstallmentAmount,
    "presale.totalAmount": state.presale.totalAmount,
    "presale.totalInWords": state.presale.totalInWords,
    "presale.deliveryDate": state.presale.deliveryDate,
    "presale.deedTransferDate": state.presale.deedTransferDate,
    "presale.selfDeclareFormNumber": state.presale.selfDeclareFormNumber,
    "presale.voucherOrganizationNumber":
      state.presale.voucherOrganizationNumber,

    "rescission.originalContractNumber":
      state.rescission.originalContractNumber,
    "rescission.originalContractDate": state.rescission.originalContractDate,
    "rescission.originalAgencyName": state.rescission.originalAgencyName,
    "rescission.aggregationClause": state.rescission.aggregationClause,
    "rescission.deliveryClause": state.rescission.deliveryClause,
    "rescission.price": state.rescission.price,
    "rescission.paymentType": state.rescission.paymentType,

    "cjv.propertyDescription": state.cjv.propertyDescription,
    "cjv.totalAmount": state.cjv.totalAmount,
    "cjv.totalInWords": state.cjv.totalInWords,
    "cjv.governmentalCosts": state.cjv.governmentalCosts,
    "cjv.constructionCosts": state.cjv.constructionCosts,
    "cjv.facilityRightsCosts": state.cjv.facilityRightsCosts,
    "cjv.destructionCost": state.cjv.destructionCost,
    "cjv.firstPartyShare": state.cjv.firstPartyShare,
    "cjv.secondPartyShare": state.cjv.secondPartyShare,
    "cjv.startDateInWords": state.cjv.startDateInWords,
    "cjv.endDateInWords": state.cjv.endDateInWords,
    "cjv.costDetailsPrepareDate": state.cjv.costDetailsPrepareDate,
    "cjv.voucherTransferDate": state.cjv.voucherTransferDate,
    "cjv.shareUnitsToTransfer": state.cjv.shareUnitsToTransfer,
    "cjv.delayPenaltyFirstPartyPerDay": state.cjv.delayPenaltyFirstPartyPerDay,
    "cjv.delayPenaltySecondPartyPerDay":
      state.cjv.delayPenaltySecondPartyPerDay,

    "generic.shareUnits": shareUnits,
    "generic.totalRials":
      state.contractType === "GOODWILL"
        ? state.goodwill.totalAmount
        : state.contractType === "PRE_SALE"
          ? state.presale.totalAmount
          : state.contractType === "MUTUAL_RESCISSION"
            ? state.rescission.price
            : state.contractType === "CONSTRUCTION_JOINT_VENTURE"
              ? state.cjv.totalAmount
              : state.generic.totalRials,
    "generic.monthlyRials": state.generic.monthlyRials,
    "generic.depositRials": state.generic.depositRials,

    "organization.name": "",
    "organization.licenseNumber": "",
    "organization.ownerName": "",
    "organization.address": "",
    "contract.date": state.contractDate,
    "contract.time": state.contractTime,
    "contract.description": state.description,
    "commission.cityRules": state.commissionCityRules,
    "commission.amount": state.commissionAmount,
    "commission.firstPartyAmount": state.firstPartyCommissionAmount,
    "commission.secondPartyAmount": state.secondPartyCommissionAmount,
    "commission.taxPercent": state.taxPercentage,
    "commission.amountWithTax": state.taxAmount,
    "commission.factorNumber": state.commissionFactorNumber,
    "commission.firstPartyFactorNumber": state.firstPartyFactorNumber,
    "commission.secondPartyFactorNumber": state.secondPartyFactorNumber,

    "sign.firstParty": partyDisplayName(state.firstParty),
    "sign.secondParty": partyDisplayName(state.secondParty),
    "sign.witness1": partyDisplayName(state.witnesses[0]),
    "sign.witness2": partyDisplayName(state.witnesses[1]),
  };

  return values;
}

export * from "./types";
