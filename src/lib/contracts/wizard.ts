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
  | "lawyers"
  | "terms"
  | "review";

export interface LawyerForm {
  name: string;
  fatherName: string;
  identityNumber: string;
  birthPlace: string;
  birthDate: string;
  identityExportPlace: string;
  nationalCode: string;
  address: string;
  postalCode: string;
  cause: string;
}

export interface SaleTermsForm {
  shareUnits: string;
  totalAmount: string;
  totalInWords: string;
  prePaymentAmount: string;
  prePaymentChequeNumber: string;
  prePaymentBankName: string;
  prePaymentBankBranch: string;
  remainderAmount: string;
  voucherRegistrationDate: string;
  voucherOrganizationNumber: string;
  deliveryDate: string;
  cancelationPenalty: string;
  breachPenalty: string;
  notaryFeePayer: string;
  delayPenaltyFirstPartyPerDay: string;
  delayPenaltySecondPartyPerDay: string;
  pricePerSqm: string;
  notes: string;
}

export interface RentTermsForm {
  shareUnits: string;
  durationMonths: string;
  fromDate: string;
  toDate: string;
  monthlyAmount: string;
  monthlyInWords: string;
  mortgageAmount: string;
  mortgageInWords: string;
  totalInWords: string;
  prePaymentAmount: string;
  prePaymentChequeNumber: string;
  prePaymentBankName: string;
  prePaymentBankBranch: string;
  remainderAmount: string;
  remainderDueDate: string;
  deliveryDate: string;
  cancelationPenalty: string;
  breachPenalty: string;
  notaryFeePayer: string;
  delayPenaltyFirstPartyPerDay: string;
  delayPenaltySecondPartyPerDay: string;
  notes: string;
}

export interface GoodwillTermsForm {
  shareUnits: string;
  pricePerSqm: string;
  totalAmount: string;
  prePaymentAmount: string;
  prePaymentChequeNumber: string;
  prePaymentBankName: string;
  prePaymentBankBranch: string;
  remainderAmount: string;
  remainderDueDate: string;
  penaltyAmount: string;
  deliveryDate: string;
  notes: string;
}

export interface PresaleTermsForm {
  renovationCode: string;
  technicalIdNumber: string;
  insuranceNumber: string;
  buildingPermitNumber: string;
  buildingPermitDate: string;
  equipped: string;
  totalFloors: string;
  totalUnits: string;
  areaSqm: string;
  storage: string;
  orientation: string;
  parkingNumberAndArea: string;
  flooringType: string;
  cabinetAndFaucetType: string;
  bathroomType: string;
  switchOutletType: string;
  entranceDoorType: string;
  interiorDoorType: string;
  ceilingPlasterType: string;
  emergencyWaterSourceType: string;
  heatingType: string;
  coolerType: string;
  intercomType: string;
  cctv: string;
  tilingType: string;
  windowType: string;
  facadeType: string;
  parkingFloorWallCover: string;
  lighting: string;
  balconyCorridorRailing: string;
  fireExtinguisher: string;
  elevator: string;
  waterMotor: string;
  utilitiesScore: string;
  loan: string;
  loanType: string;
  loanInstallmentAmount: string;
  totalAmount: string;
  totalInWords: string;
  deliveryDate: string;
  deedTransferDate: string;
  selfDeclareFormNumber: string;
  voucherOrganizationNumber: string;
  notes: string;
}

export interface RescissionTermsForm {
  originalContractNumber: string;
  originalContractDate: string;
  originalAgencyName: string;
  shareUnits: string;
  areaSqm: string;
  county: string;
  ownershipNumber: string;
  aggregationClause: string;
  deliveryClause: string;
  price: string;
  paymentType: string;
  notes: string;
}

export interface CjvTermsForm {
  propertyDescription: string;
  shareUnits: string;
  areaSqm: string;
  totalAmount: string;
  totalInWords: string;
  governmentalCosts: string;
  constructionCosts: string;
  facilityRightsCosts: string;
  destructionCost: string;
  firstPartyShare: string;
  secondPartyShare: string;
  startDateInWords: string;
  endDateInWords: string;
  costDetailsPrepareDate: string;
  voucherTransferDate: string;
  shareUnitsToTransfer: string;
  delayPenaltyFirstPartyPerDay: string;
  delayPenaltySecondPartyPerDay: string;
  notes: string;
}

/** Unused fallback kept for seed-map aliases / legacy hydration. */
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
  commissionCityRules: string;
  commissionFactorNumber: string;
  firstPartyFactorNumber: string;
  secondPartyFactorNumber: string;
  contractDate: string;
  contractTime: string;
  propertyId: string;
  property: Property | null;
  firstPartyId: string;
  secondPartyId: string;
  witnessIds: string[];
  firstParty: Party | null;
  secondParty: Party | null;
  witnesses: Party[];
  lawyers: {
    firstPartyLawyer: LawyerForm;
    secondPartyLawyer: LawyerForm;
  };
  sale: SaleTermsForm;
  rent: RentTermsForm;
  goodwill: GoodwillTermsForm;
  presale: PresaleTermsForm;
  rescission: RescissionTermsForm;
  cjv: CjvTermsForm;
  generic: GenericTermsForm;
}

export const WIZARD_STEPS: { id: WizardStep; label: string }[] = [
  { id: "basics", label: "اطلاعات پایه" },
  { id: "property", label: "ملک" },
  { id: "parties", label: "طرفین" },
  { id: "lawyers", label: "وکلا" },
  { id: "terms", label: "شرایط" },
  { id: "review", label: "بازبینی و چاپ" },
];

export function defaultLawyerForm(): LawyerForm {
  return {
    name: "",
    fatherName: "",
    identityNumber: "",
    birthPlace: "",
    birthDate: "",
    identityExportPlace: "",
    nationalCode: "",
    address: "",
    postalCode: "",
    cause: "",
  };
}

export function defaultSaleTerms(): SaleTermsForm {
  return {
    shareUnits: "6",
    totalAmount: "",
    totalInWords: "",
    prePaymentAmount: "",
    prePaymentChequeNumber: "",
    prePaymentBankName: "",
    prePaymentBankBranch: "",
    remainderAmount: "",
    voucherRegistrationDate: "",
    voucherOrganizationNumber: "",
    deliveryDate: "",
    cancelationPenalty: "",
    breachPenalty: "",
    notaryFeePayer: "",
    delayPenaltyFirstPartyPerDay: "",
    delayPenaltySecondPartyPerDay: "",
    pricePerSqm: "",
    notes: "",
  };
}

export function defaultRentTerms(): RentTermsForm {
  return {
    shareUnits: "6",
    durationMonths: "12",
    fromDate: "",
    toDate: "",
    monthlyAmount: "",
    monthlyInWords: "",
    mortgageAmount: "",
    mortgageInWords: "",
    totalInWords: "",
    prePaymentAmount: "",
    prePaymentChequeNumber: "",
    prePaymentBankName: "",
    prePaymentBankBranch: "",
    remainderAmount: "",
    remainderDueDate: "",
    deliveryDate: "",
    cancelationPenalty: "",
    breachPenalty: "",
    notaryFeePayer: "",
    delayPenaltyFirstPartyPerDay: "",
    delayPenaltySecondPartyPerDay: "",
    notes: "",
  };
}

export function defaultGoodwillTerms(): GoodwillTermsForm {
  return {
    shareUnits: "6",
    pricePerSqm: "",
    totalAmount: "",
    prePaymentAmount: "",
    prePaymentChequeNumber: "",
    prePaymentBankName: "",
    prePaymentBankBranch: "",
    remainderAmount: "",
    remainderDueDate: "",
    penaltyAmount: "",
    deliveryDate: "",
    notes: "",
  };
}

export function defaultPresaleTerms(): PresaleTermsForm {
  return {
    renovationCode: "",
    technicalIdNumber: "",
    insuranceNumber: "",
    buildingPermitNumber: "",
    buildingPermitDate: "",
    equipped: "",
    totalFloors: "",
    totalUnits: "",
    areaSqm: "",
    storage: "",
    orientation: "",
    parkingNumberAndArea: "",
    flooringType: "",
    cabinetAndFaucetType: "",
    bathroomType: "",
    switchOutletType: "",
    entranceDoorType: "",
    interiorDoorType: "",
    ceilingPlasterType: "",
    emergencyWaterSourceType: "",
    heatingType: "",
    coolerType: "",
    intercomType: "",
    cctv: "",
    tilingType: "",
    windowType: "",
    facadeType: "",
    parkingFloorWallCover: "",
    lighting: "",
    balconyCorridorRailing: "",
    fireExtinguisher: "",
    elevator: "",
    waterMotor: "",
    utilitiesScore: "",
    loan: "",
    loanType: "",
    loanInstallmentAmount: "",
    totalAmount: "",
    totalInWords: "",
    deliveryDate: "",
    deedTransferDate: "",
    selfDeclareFormNumber: "",
    voucherOrganizationNumber: "",
    notes: "",
  };
}

export function defaultRescissionTerms(): RescissionTermsForm {
  return {
    originalContractNumber: "",
    originalContractDate: "",
    originalAgencyName: "",
    shareUnits: "6",
    areaSqm: "",
    county: "",
    ownershipNumber: "",
    aggregationClause: "",
    deliveryClause: "",
    price: "",
    paymentType: "",
    notes: "",
  };
}

export function defaultCjvTerms(): CjvTermsForm {
  return {
    propertyDescription: "",
    shareUnits: "6",
    areaSqm: "",
    totalAmount: "",
    totalInWords: "",
    governmentalCosts: "",
    constructionCosts: "",
    facilityRightsCosts: "",
    destructionCost: "",
    firstPartyShare: "",
    secondPartyShare: "",
    startDateInWords: "",
    endDateInWords: "",
    costDetailsPrepareDate: "",
    voucherTransferDate: "",
    shareUnitsToTransfer: "",
    delayPenaltyFirstPartyPerDay: "",
    delayPenaltySecondPartyPerDay: "",
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

export function contractTypeHasShareUnits(type: ContractType): boolean {
  return (
    type === "SALE" ||
    type === "RENT" ||
    type === "GOODWILL" ||
    type === "CONSTRUCTION_JOINT_VENTURE" ||
    type === "MUTUAL_RESCISSION"
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
    commissionCityRules: "",
    commissionFactorNumber: "",
    firstPartyFactorNumber: "",
    secondPartyFactorNumber: "",
    contractDate: "",
    contractTime: "",
    propertyId: "",
    property: null,
    firstPartyId: "",
    secondPartyId: "",
    witnessIds: [],
    firstParty: null,
    secondParty: null,
    witnesses: [],
    lawyers: {
      firstPartyLawyer: defaultLawyerForm(),
      secondPartyLawyer: defaultLawyerForm(),
    },
    sale: defaultSaleTerms(),
    rent: defaultRentTerms(),
    goodwill: defaultGoodwillTerms(),
    presale: defaultPresaleTerms(),
    rescission: defaultRescissionTerms(),
    cjv: defaultCjvTerms(),
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
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return new Date(trimmed).toISOString();
  }
  return undefined;
}

function pickFilled(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === "") continue;
    out[k] = v;
  }
  return out;
}

function strOrUndef(value: string): string | undefined {
  const t = value.trim();
  return t || undefined;
}

function lawyerToJson(lawyer: LawyerForm): Record<string, unknown> | undefined {
  const picked = pickFilled({ ...lawyer });
  return Object.keys(picked).length ? picked : undefined;
}

export function buildTermsAndConditions(state: ContractWizardState): JsonObject {
  const lawyers = {
    firstParty: lawyerToJson(state.lawyers.firstPartyLawyer),
    secondParty: lawyerToJson(state.lawyers.secondPartyLawyer),
  };
  const lawyersBlock =
    lawyers.firstParty || lawyers.secondParty
      ? {
          lawyers: {
            ...(lawyers.firstParty ? { firstParty: lawyers.firstParty } : {}),
            ...(lawyers.secondParty
              ? { secondParty: lawyers.secondParty }
              : {}),
          },
        }
      : {};

  const commission = pickFilled({
    cityRules: state.commissionCityRules.trim() || undefined,
    amount: num(state.commissionAmount),
    firstPartyAmount: num(state.firstPartyCommissionAmount),
    secondPartyAmount: num(state.secondPartyCommissionAmount),
    taxPercent: num(state.taxPercentage),
    amountWithTax: num(state.taxAmount),
    factorNumber: state.commissionFactorNumber.trim() || undefined,
    firstPartyFactorNumber: state.firstPartyFactorNumber.trim() || undefined,
    secondPartyFactorNumber: state.secondPartyFactorNumber.trim() || undefined,
  });

  const contractMeta = pickFilled({
    date: state.contractDate.trim() || undefined,
    time: state.contractTime.trim() || undefined,
    description: state.description.trim() || undefined,
  });

  const shared = {
    ...lawyersBlock,
    ...(Object.keys(commission).length ? { commission } : {}),
    ...(Object.keys(contractMeta).length ? { contract: contractMeta } : {}),
  };

  if (state.contractType === "SALE") {
    const s = state.sale;
    return {
      type: "SALE",
      shareUnits: num(s.shareUnits),
      property: pickFilled({
        shareUnits: num(s.shareUnits),
        pricePerSqm: num(s.pricePerSqm),
      }),
      sale: pickFilled({
        totalAmount: num(s.totalAmount),
        totalInWords: strOrUndef(s.totalInWords),
        prePaymentAmount: num(s.prePaymentAmount),
        prePaymentChequeNumber: strOrUndef(s.prePaymentChequeNumber),
        prePaymentBankName: strOrUndef(s.prePaymentBankName),
        prePaymentBankBranch: strOrUndef(s.prePaymentBankBranch),
        remainderAmount: num(s.remainderAmount),
        voucherRegistrationDate: strOrUndef(s.voucherRegistrationDate),
        voucherOrganizationNumber: strOrUndef(s.voucherOrganizationNumber),
        deliveryDate: strOrUndef(s.deliveryDate),
        cancelationPenalty: strOrUndef(s.cancelationPenalty),
        breachPenalty: strOrUndef(s.breachPenalty),
        notaryFeePayer: strOrUndef(s.notaryFeePayer),
        delayPenaltyFirstPartyPerDay: num(s.delayPenaltyFirstPartyPerDay),
        delayPenaltySecondPartyPerDay: num(s.delayPenaltySecondPartyPerDay),
      }),
      ...shared,
      notes: strOrUndef(s.notes),
    };
  }

  if (state.contractType === "RENT") {
    const r = state.rent;
    return {
      type: "RENT",
      shareUnits: num(r.shareUnits),
      property: pickFilled({
        shareUnits: num(r.shareUnits),
      }),
      rent: pickFilled({
        durationMonths: num(r.durationMonths),
        fromDate: strOrUndef(r.fromDate),
        toDate: strOrUndef(r.toDate),
        monthlyAmount: num(r.monthlyAmount),
        monthlyInWords: strOrUndef(r.monthlyInWords),
        mortgageAmount: num(r.mortgageAmount),
        mortgageInWords: strOrUndef(r.mortgageInWords),
        totalInWords: strOrUndef(r.totalInWords),
        prePaymentAmount: num(r.prePaymentAmount),
        prePaymentChequeNumber: strOrUndef(r.prePaymentChequeNumber),
        prePaymentBankName: strOrUndef(r.prePaymentBankName),
        prePaymentBankBranch: strOrUndef(r.prePaymentBankBranch),
        remainderAmount: num(r.remainderAmount),
        remainderDueDate: strOrUndef(r.remainderDueDate),
        deliveryDate: strOrUndef(r.deliveryDate),
        cancelationPenalty: strOrUndef(r.cancelationPenalty),
        breachPenalty: strOrUndef(r.breachPenalty),
        notaryFeePayer: strOrUndef(r.notaryFeePayer),
        delayPenaltyFirstPartyPerDay: num(r.delayPenaltyFirstPartyPerDay),
        delayPenaltySecondPartyPerDay: num(r.delayPenaltySecondPartyPerDay),
      }),
      ...shared,
      notes: strOrUndef(r.notes),
    };
  }

  if (state.contractType === "GOODWILL") {
    const g = state.goodwill;
    return {
      type: "GOODWILL",
      shareUnits: num(g.shareUnits),
      property: pickFilled({
        shareUnits: num(g.shareUnits),
        pricePerSqm: num(g.pricePerSqm),
      }),
      goodwill: pickFilled({
        totalAmount: num(g.totalAmount),
        prePaymentAmount: num(g.prePaymentAmount),
        prePaymentChequeNumber: strOrUndef(g.prePaymentChequeNumber),
        prePaymentBankName: strOrUndef(g.prePaymentBankName),
        prePaymentBankBranch: strOrUndef(g.prePaymentBankBranch),
        remainderAmount: num(g.remainderAmount),
        remainderDueDate: strOrUndef(g.remainderDueDate),
        penaltyAmount: strOrUndef(g.penaltyAmount),
        deliveryDate: strOrUndef(g.deliveryDate),
      }),
      ...shared,
      notes: strOrUndef(g.notes),
    };
  }

  if (state.contractType === "PRE_SALE") {
    const p = state.presale;
    return {
      type: "PRE_SALE",
      presale: pickFilled({
        renovationCode: strOrUndef(p.renovationCode),
        technicalIdNumber: strOrUndef(p.technicalIdNumber),
        insuranceNumber: strOrUndef(p.insuranceNumber),
        buildingPermitNumber: strOrUndef(p.buildingPermitNumber),
        buildingPermitDate: strOrUndef(p.buildingPermitDate),
        equipped: strOrUndef(p.equipped),
        totalFloors: num(p.totalFloors),
        totalUnits: num(p.totalUnits),
        areaSqm: num(p.areaSqm),
        storage: strOrUndef(p.storage),
        orientation: strOrUndef(p.orientation),
        parkingNumberAndArea: strOrUndef(p.parkingNumberAndArea),
        flooringType: strOrUndef(p.flooringType),
        cabinetAndFaucetType: strOrUndef(p.cabinetAndFaucetType),
        bathroomType: strOrUndef(p.bathroomType),
        switchOutletType: strOrUndef(p.switchOutletType),
        entranceDoorType: strOrUndef(p.entranceDoorType),
        interiorDoorType: strOrUndef(p.interiorDoorType),
        ceilingPlasterType: strOrUndef(p.ceilingPlasterType),
        emergencyWaterSourceType: strOrUndef(p.emergencyWaterSourceType),
        heatingType: strOrUndef(p.heatingType),
        coolerType: strOrUndef(p.coolerType),
        intercomType: strOrUndef(p.intercomType),
        cctv: strOrUndef(p.cctv),
        tilingType: strOrUndef(p.tilingType),
        windowType: strOrUndef(p.windowType),
        facadeType: strOrUndef(p.facadeType),
        parkingFloorWallCover: strOrUndef(p.parkingFloorWallCover),
        lighting: strOrUndef(p.lighting),
        balconyCorridorRailing: strOrUndef(p.balconyCorridorRailing),
        fireExtinguisher: strOrUndef(p.fireExtinguisher),
        elevator: strOrUndef(p.elevator),
        waterMotor: strOrUndef(p.waterMotor),
        utilitiesScore: strOrUndef(p.utilitiesScore),
        loan: strOrUndef(p.loan),
        loanType: strOrUndef(p.loanType),
        loanInstallmentAmount: num(p.loanInstallmentAmount),
        totalAmount: num(p.totalAmount),
        totalInWords: strOrUndef(p.totalInWords),
        deliveryDate: strOrUndef(p.deliveryDate),
        deedTransferDate: strOrUndef(p.deedTransferDate),
        selfDeclareFormNumber: strOrUndef(p.selfDeclareFormNumber),
        voucherOrganizationNumber: strOrUndef(p.voucherOrganizationNumber),
      }),
      ...shared,
      notes: strOrUndef(p.notes),
    };
  }

  if (state.contractType === "MUTUAL_RESCISSION") {
    const r = state.rescission;
    return {
      type: "MUTUAL_RESCISSION",
      shareUnits: num(r.shareUnits),
      property: pickFilled({
        shareUnits: num(r.shareUnits),
        areaSqm: num(r.areaSqm),
        county: strOrUndef(r.county),
        ownershipNumber: strOrUndef(r.ownershipNumber),
      }),
      rescission: pickFilled({
        originalContractNumber: strOrUndef(r.originalContractNumber),
        originalContractDate: strOrUndef(r.originalContractDate),
        originalAgencyName: strOrUndef(r.originalAgencyName),
        aggregationClause: strOrUndef(r.aggregationClause),
        deliveryClause: strOrUndef(r.deliveryClause),
        price: num(r.price),
        paymentType: strOrUndef(r.paymentType),
      }),
      ...shared,
      notes: strOrUndef(r.notes),
    };
  }

  if (state.contractType === "CONSTRUCTION_JOINT_VENTURE") {
    const c = state.cjv;
    return {
      type: "CONSTRUCTION_JOINT_VENTURE",
      shareUnits: num(c.shareUnits),
      property: pickFilled({
        shareUnits: num(c.shareUnits),
        areaSqm: num(c.areaSqm),
      }),
      cjv: pickFilled({
        propertyDescription: strOrUndef(c.propertyDescription),
        totalAmount: num(c.totalAmount),
        totalInWords: strOrUndef(c.totalInWords),
        governmentalCosts: strOrUndef(c.governmentalCosts),
        constructionCosts: strOrUndef(c.constructionCosts),
        facilityRightsCosts: strOrUndef(c.facilityRightsCosts),
        destructionCost: strOrUndef(c.destructionCost),
        firstPartyShare: strOrUndef(c.firstPartyShare),
        secondPartyShare: strOrUndef(c.secondPartyShare),
        startDateInWords: strOrUndef(c.startDateInWords),
        endDateInWords: strOrUndef(c.endDateInWords),
        costDetailsPrepareDate: strOrUndef(c.costDetailsPrepareDate),
        voucherTransferDate: strOrUndef(c.voucherTransferDate),
        shareUnitsToTransfer: strOrUndef(c.shareUnitsToTransfer),
        delayPenaltyFirstPartyPerDay: num(c.delayPenaltyFirstPartyPerDay),
        delayPenaltySecondPartyPerDay: num(c.delayPenaltySecondPartyPerDay),
      }),
      ...shared,
      notes: strOrUndef(c.notes),
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
    ...shared,
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
      totalAmount: num(state.sale.totalAmount),
      deliveryDate: jalaliOrIsoToIso(state.sale.deliveryDate),
    };
  }

  if (state.contractType === "RENT") {
    return {
      ...base,
      monthlyAmount: num(state.rent.monthlyAmount),
      depositAmount: num(state.rent.mortgageAmount),
      startDate: jalaliOrIsoToIso(state.rent.fromDate),
      endDate: jalaliOrIsoToIso(state.rent.toDate),
      deliveryDate: jalaliOrIsoToIso(state.rent.deliveryDate),
    };
  }

  if (state.contractType === "GOODWILL") {
    return {
      ...base,
      totalAmount: num(state.goodwill.totalAmount),
      deliveryDate: jalaliOrIsoToIso(state.goodwill.deliveryDate),
    };
  }

  if (state.contractType === "PRE_SALE") {
    return {
      ...base,
      totalAmount: num(state.presale.totalAmount),
      deliveryDate: jalaliOrIsoToIso(state.presale.deliveryDate),
      officialDeedDate: jalaliOrIsoToIso(state.presale.deedTransferDate),
    };
  }

  if (state.contractType === "MUTUAL_RESCISSION") {
    return {
      ...base,
      totalAmount: num(state.rescission.price),
    };
  }

  if (state.contractType === "CONSTRUCTION_JOINT_VENTURE") {
    return {
      ...base,
      totalAmount: num(state.cjv.totalAmount),
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
