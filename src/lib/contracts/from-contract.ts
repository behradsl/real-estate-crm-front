import type {
  Contract,
  ContractType,
  JsonObject,
  Party,
  Property,
} from "@/lib/api/types";
import {
  createInitialWizardState,
  defaultCjvTerms,
  defaultGenericTerms,
  defaultGoodwillTerms,
  defaultLawyerForm,
  defaultPresaleTerms,
  defaultRentTerms,
  defaultRescissionTerms,
  defaultSaleTerms,
  type CjvTermsForm,
  type ContractWizardState,
  type GoodwillTermsForm,
  type LawyerForm,
  type PresaleTermsForm,
  type RentTermsForm,
  type RescissionTermsForm,
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

function hydrateLawyer(raw: unknown): LawyerForm {
  const r = asRecord(raw);
  return {
    ...defaultLawyerForm(),
    name: str(r.name),
    fatherName: str(r.fatherName),
    identityNumber: str(r.identityNumber),
    birthPlace: str(r.birthPlace),
    birthDate: str(r.birthDate),
    identityExportPlace: str(r.identityExportPlace),
    nationalCode: str(r.nationalCode),
    address: str(r.address),
    postalCode: str(r.postalCode),
    cause: str(r.cause),
  };
}

function hydrateSale(terms: JsonObject, contract: Contract): SaleTermsForm {
  const sale = asRecord(terms.sale);
  const property = asRecord(terms.property);
  if (Object.keys(sale).length > 0 || terms.type === "SALE") {
    const hasNew = "totalAmount" in sale || "prePaymentAmount" in sale;
    if (hasNew || Object.keys(sale).length > 0) {
      return {
        ...defaultSaleTerms(),
        shareUnits: str(
          property.shareUnits ?? terms.shareUnits ?? defaultSaleTerms().shareUnits,
        ),
        totalAmount: str(sale.totalAmount ?? contract.totalAmount),
        totalInWords: str(sale.totalInWords),
        prePaymentAmount: str(sale.prePaymentAmount),
        prePaymentChequeNumber: str(sale.prePaymentChequeNumber),
        prePaymentBankName: str(sale.prePaymentBankName),
        prePaymentBankBranch: str(sale.prePaymentBankBranch),
        remainderAmount: str(sale.remainderAmount),
        voucherRegistrationDate: str(sale.voucherRegistrationDate),
        voucherOrganizationNumber: str(sale.voucherOrganizationNumber),
        deliveryDate: str(sale.deliveryDate ?? contract.deliveryDate),
        cancelationPenalty: str(sale.cancelationPenalty),
        breachPenalty: str(sale.breachPenalty),
        notaryFeePayer: str(sale.notaryFeePayer),
        delayPenaltyFirstPartyPerDay: str(sale.delayPenaltyFirstPartyPerDay),
        delayPenaltySecondPartyPerDay: str(sale.delayPenaltySecondPartyPerDay),
        pricePerSqm: str(property.pricePerSqm),
        notes: str(terms.notes),
      };
    }
  }

  const price = asRecord(terms.price);
  const payments = Array.isArray(price.payments)
    ? (price.payments as JsonObject[])
    : [];
  const down = asRecord(payments[0]);
  const remain = asRecord(payments[1]);
  const transfer = asRecord(terms.transfer);
  const penalties = asRecord(terms.penalties);
  return {
    ...defaultSaleTerms(),
    shareUnits: str(terms.shareUnits),
    totalAmount: str(price.totalRials ?? contract.totalAmount),
    totalInWords: str(price.totalInWords),
    prePaymentAmount: str(down.amountRials),
    prePaymentChequeNumber: "",
    prePaymentBankName: str(down.bankName),
    prePaymentBankBranch: "",
    remainderAmount: str(remain.amountRials),
    voucherRegistrationDate: str(remain.dueAt),
    voucherOrganizationNumber: str(transfer.notaryOffice),
    deliveryDate: str(transfer.deliveryDueAt ?? contract.deliveryDate),
    cancelationPenalty: "",
    breachPenalty: "",
    notaryFeePayer: "",
    delayPenaltyFirstPartyPerDay: str(penalties.delayPenaltyPerDayRials),
    delayPenaltySecondPartyPerDay: str(penalties.delayPenaltyPerDayRials),
    pricePerSqm: "",
    notes: str(terms.notes),
  };
}

function hydrateRent(terms: JsonObject, contract: Contract): RentTermsForm {
  const rent = asRecord(terms.rent);
  const property = asRecord(terms.property);
  const hasNew =
    "monthlyAmount" in rent ||
    "fromDate" in rent ||
    "mortgageAmount" in rent;

  if (hasNew || ("durationMonths" in rent && !("monthlyRials" in rent))) {
    return {
      ...defaultRentTerms(),
      shareUnits: str(
        property.shareUnits ?? terms.shareUnits ?? defaultRentTerms().shareUnits,
      ),
      durationMonths: str(rent.durationMonths),
      fromDate: str(rent.fromDate ?? contract.startDate),
      toDate: str(rent.toDate ?? contract.endDate),
      monthlyAmount: str(rent.monthlyAmount ?? contract.monthlyAmount),
      monthlyInWords: str(rent.monthlyInWords),
      mortgageAmount: str(rent.mortgageAmount ?? contract.depositAmount),
      mortgageInWords: str(rent.mortgageInWords),
      totalInWords: str(rent.totalInWords),
      prePaymentAmount: str(rent.prePaymentAmount),
      prePaymentChequeNumber: str(rent.prePaymentChequeNumber),
      prePaymentBankName: str(rent.prePaymentBankName),
      prePaymentBankBranch: str(rent.prePaymentBankBranch),
      remainderAmount: str(rent.remainderAmount),
      remainderDueDate: str(rent.remainderDueDate),
      deliveryDate: str(rent.deliveryDate ?? contract.deliveryDate),
      cancelationPenalty: str(rent.cancelationPenalty),
      breachPenalty: str(rent.breachPenalty),
      notaryFeePayer: str(rent.notaryFeePayer),
      delayPenaltyFirstPartyPerDay: str(rent.delayPenaltyFirstPartyPerDay),
      delayPenaltySecondPartyPerDay: str(rent.delayPenaltySecondPartyPerDay),
      notes: str(terms.notes),
    };
  }

  const duration = asRecord(terms.duration);
  const paymentMethod = asRecord(rent.paymentMethod);
  const penalties = asRecord(terms.penalties);
  return {
    ...defaultRentTerms(),
    shareUnits: str(terms.shareUnits),
    durationMonths: str(duration.value),
    fromDate: str(duration.startDate ?? contract.startDate),
    toDate: str(duration.endDate ?? contract.endDate),
    monthlyAmount: str(rent.monthlyRials ?? contract.monthlyAmount),
    monthlyInWords: str(rent.monthlyInWords),
    mortgageAmount: str(rent.securityDepositRials ?? contract.depositAmount),
    mortgageInWords: "",
    totalInWords: "",
    prePaymentAmount: "",
    prePaymentChequeNumber: "",
    prePaymentBankName: str(paymentMethod.bankName),
    prePaymentBankBranch: "",
    remainderAmount: "",
    remainderDueDate: "",
    deliveryDate: str(contract.deliveryDate),
    cancelationPenalty: "",
    breachPenalty: "",
    notaryFeePayer: "",
    delayPenaltyFirstPartyPerDay: str(penalties.delayPenaltyPerDayRials),
    delayPenaltySecondPartyPerDay: str(penalties.delayPenaltyPerDayRials),
    notes: str(terms.notes),
  };
}

function hydrateGoodwill(
  terms: JsonObject,
  contract: Contract,
): GoodwillTermsForm {
  const goodwill = asRecord(terms.goodwill);
  const property = asRecord(terms.property);
  const financials = asRecord(terms.financials);
  const schedule = asRecord(terms.schedule);

  if (Object.keys(goodwill).length > 0) {
    return {
      ...defaultGoodwillTerms(),
      shareUnits: str(
        property.shareUnits ??
          terms.shareUnits ??
          defaultGoodwillTerms().shareUnits,
      ),
      pricePerSqm: str(property.pricePerSqm),
      totalAmount: str(goodwill.totalAmount ?? contract.totalAmount),
      prePaymentAmount: str(goodwill.prePaymentAmount),
      prePaymentChequeNumber: str(goodwill.prePaymentChequeNumber),
      prePaymentBankName: str(goodwill.prePaymentBankName),
      prePaymentBankBranch: str(goodwill.prePaymentBankBranch),
      remainderAmount: str(goodwill.remainderAmount),
      remainderDueDate: str(goodwill.remainderDueDate),
      penaltyAmount: str(goodwill.penaltyAmount),
      deliveryDate: str(goodwill.deliveryDate ?? contract.deliveryDate),
      notes: str(terms.notes),
    };
  }

  return {
    ...defaultGoodwillTerms(),
    shareUnits: str(terms.shareUnits ?? defaultGoodwillTerms().shareUnits),
    pricePerSqm: "",
    totalAmount: str(financials.totalRials ?? contract.totalAmount),
    prePaymentAmount: "",
    prePaymentChequeNumber: "",
    prePaymentBankName: "",
    prePaymentBankBranch: "",
    remainderAmount: "",
    remainderDueDate: "",
    penaltyAmount: "",
    deliveryDate: str(schedule.deliveryDueAt ?? contract.deliveryDate),
    notes: str(terms.notes),
  };
}

function hydratePresale(
  terms: JsonObject,
  contract: Contract,
): PresaleTermsForm {
  const presale = asRecord(terms.presale);
  const financials = asRecord(terms.financials);
  const schedule = asRecord(terms.schedule);
  const base = defaultPresaleTerms();

  if (Object.keys(presale).length > 0) {
    return {
      ...base,
      renovationCode: str(presale.renovationCode),
      technicalIdNumber: str(presale.technicalIdNumber),
      insuranceNumber: str(presale.insuranceNumber),
      buildingPermitNumber: str(presale.buildingPermitNumber),
      buildingPermitDate: str(presale.buildingPermitDate),
      equipped: str(presale.equipped),
      totalFloors: str(presale.totalFloors),
      totalUnits: str(presale.totalUnits),
      areaSqm: str(presale.areaSqm),
      storage: str(presale.storage),
      orientation: str(presale.orientation),
      parkingNumberAndArea: str(presale.parkingNumberAndArea),
      flooringType: str(presale.flooringType),
      cabinetAndFaucetType: str(presale.cabinetAndFaucetType),
      bathroomType: str(presale.bathroomType),
      switchOutletType: str(presale.switchOutletType),
      entranceDoorType: str(presale.entranceDoorType),
      interiorDoorType: str(presale.interiorDoorType),
      ceilingPlasterType: str(presale.ceilingPlasterType),
      emergencyWaterSourceType: str(presale.emergencyWaterSourceType),
      heatingType: str(presale.heatingType),
      coolerType: str(presale.coolerType),
      intercomType: str(presale.intercomType),
      cctv: str(presale.cctv),
      tilingType: str(presale.tilingType),
      windowType: str(presale.windowType),
      facadeType: str(presale.facadeType),
      parkingFloorWallCover: str(presale.parkingFloorWallCover),
      lighting: str(presale.lighting),
      balconyCorridorRailing: str(presale.balconyCorridorRailing),
      fireExtinguisher: str(presale.fireExtinguisher),
      elevator: str(presale.elevator),
      waterMotor: str(presale.waterMotor),
      utilitiesScore: str(presale.utilitiesScore),
      loan: str(presale.loan),
      loanType: str(presale.loanType),
      loanInstallmentAmount: str(presale.loanInstallmentAmount),
      totalAmount: str(presale.totalAmount ?? contract.totalAmount),
      totalInWords: str(presale.totalInWords),
      deliveryDate: str(presale.deliveryDate ?? contract.deliveryDate),
      deedTransferDate: str(
        presale.deedTransferDate ?? contract.officialDeedDate,
      ),
      selfDeclareFormNumber: str(presale.selfDeclareFormNumber),
      voucherOrganizationNumber: str(presale.voucherOrganizationNumber),
      notes: str(terms.notes),
    };
  }

  return {
    ...base,
    totalAmount: str(financials.totalRials ?? contract.totalAmount),
    deliveryDate: str(schedule.deliveryDueAt ?? contract.deliveryDate),
    deedTransferDate: str(
      schedule.officialDeedDueAt ?? contract.officialDeedDate,
    ),
    notes: str(terms.notes),
  };
}

function hydrateRescission(
  terms: JsonObject,
  contract: Contract,
): RescissionTermsForm {
  const rescission = asRecord(terms.rescission);
  const property = asRecord(terms.property);
  const financials = asRecord(terms.financials);

  if (Object.keys(rescission).length > 0) {
    return {
      ...defaultRescissionTerms(),
      originalContractNumber: str(rescission.originalContractNumber),
      originalContractDate: str(rescission.originalContractDate),
      originalAgencyName: str(rescission.originalAgencyName),
      shareUnits: str(
        property.shareUnits ??
          terms.shareUnits ??
          defaultRescissionTerms().shareUnits,
      ),
      areaSqm: str(property.areaSqm),
      county: str(property.county),
      ownershipNumber: str(property.ownershipNumber),
      aggregationClause: str(rescission.aggregationClause),
      deliveryClause: str(rescission.deliveryClause),
      price: str(rescission.price ?? contract.totalAmount),
      paymentType: str(rescission.paymentType),
      notes: str(terms.notes),
    };
  }

  return {
    ...defaultRescissionTerms(),
    shareUnits: str(terms.shareUnits ?? defaultRescissionTerms().shareUnits),
    price: str(financials.totalRials ?? contract.totalAmount),
    notes: str(terms.notes),
  };
}

function hydrateCjv(terms: JsonObject, contract: Contract): CjvTermsForm {
  const cjv = asRecord(terms.cjv);
  const property = asRecord(terms.property);
  const financials = asRecord(terms.financials);

  if (Object.keys(cjv).length > 0) {
    return {
      ...defaultCjvTerms(),
      propertyDescription: str(cjv.propertyDescription),
      shareUnits: str(
        property.shareUnits ?? terms.shareUnits ?? defaultCjvTerms().shareUnits,
      ),
      areaSqm: str(property.areaSqm),
      totalAmount: str(cjv.totalAmount ?? contract.totalAmount),
      totalInWords: str(cjv.totalInWords),
      governmentalCosts: str(cjv.governmentalCosts),
      constructionCosts: str(cjv.constructionCosts),
      facilityRightsCosts: str(cjv.facilityRightsCosts),
      destructionCost: str(cjv.destructionCost),
      firstPartyShare: str(cjv.firstPartyShare),
      secondPartyShare: str(cjv.secondPartyShare),
      startDateInWords: str(cjv.startDateInWords),
      endDateInWords: str(cjv.endDateInWords),
      costDetailsPrepareDate: str(cjv.costDetailsPrepareDate),
      voucherTransferDate: str(cjv.voucherTransferDate),
      shareUnitsToTransfer: str(cjv.shareUnitsToTransfer),
      delayPenaltyFirstPartyPerDay: str(cjv.delayPenaltyFirstPartyPerDay),
      delayPenaltySecondPartyPerDay: str(cjv.delayPenaltySecondPartyPerDay),
      notes: str(terms.notes),
    };
  }

  return {
    ...defaultCjvTerms(),
    shareUnits: str(terms.shareUnits ?? defaultCjvTerms().shareUnits),
    totalAmount: str(financials.totalRials ?? contract.totalAmount),
    notes: str(terms.notes),
  };
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

  const commission = asRecord(terms.commission);
  const contractMeta = asRecord(terms.contract);
  base.commissionCityRules = str(commission.cityRules);
  base.commissionFactorNumber = str(commission.factorNumber);
  base.firstPartyFactorNumber = str(commission.firstPartyFactorNumber);
  base.secondPartyFactorNumber = str(commission.secondPartyFactorNumber);
  if (commission.firstPartyAmount != null) {
    base.firstPartyCommissionAmount = str(commission.firstPartyAmount);
  }
  if (commission.secondPartyAmount != null) {
    base.secondPartyCommissionAmount = str(commission.secondPartyAmount);
  }
  base.contractDate = str(contractMeta.date);
  base.contractTime = str(contractMeta.time);

  const lawyers = asRecord(terms.lawyers);
  base.lawyers = {
    firstPartyLawyer: hydrateLawyer(lawyers.firstParty),
    secondPartyLawyer: hydrateLawyer(lawyers.secondParty),
  };

  if (type === "SALE") {
    base.sale = hydrateSale(terms, contract);
  } else if (type === "RENT") {
    base.rent = hydrateRent(terms, contract);
  } else if (type === "GOODWILL") {
    base.goodwill = hydrateGoodwill(terms, contract);
  } else if (type === "PRE_SALE") {
    base.presale = hydratePresale(terms, contract);
  } else if (type === "MUTUAL_RESCISSION") {
    base.rescission = hydrateRescission(terms, contract);
  } else if (type === "CONSTRUCTION_JOINT_VENTURE") {
    base.cjv = hydrateCjv(terms, contract);
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
