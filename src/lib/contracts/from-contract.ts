import type {
  Contract,
  ContractLawyer,
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

function hasKeys(value: unknown): boolean {
  return Object.keys(asRecord(value)).length > 0;
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

function lawyerBySide(
  lawyers: ContractLawyer[] | undefined,
  side: "FIRST_PARTY" | "SECOND_PARTY",
): ContractLawyer | undefined {
  return lawyers?.find((l) => l.side === side);
}

function hydrateSaleFromTyped(
  details: JsonObject,
  contract: Contract,
  notes: string,
): SaleTermsForm {
  return {
    ...defaultSaleTerms(),
    shareUnits: str(details.shareUnits ?? defaultSaleTerms().shareUnits),
    totalAmount: str(details.totalAmount ?? contract.totalAmount),
    totalInWords: str(details.totalInWords),
    prePaymentAmount: str(details.prePaymentAmount),
    prePaymentChequeNumber: str(details.prePaymentChequeNumber),
    prePaymentBankName: str(details.prePaymentBankName),
    prePaymentBankBranch: str(details.prePaymentBankBranch),
    remainderAmount: str(details.remainderAmount),
    voucherRegistrationDate: str(details.voucherRegistrationDate),
    voucherOrganizationNumber: str(details.voucherOrganizationNumber),
    deliveryDate: str(details.deliveryDate ?? contract.deliveryDate),
    cancelationPenalty: str(details.cancelationPenalty),
    breachPenalty: str(details.breachPenalty),
    notaryFeePayer: str(details.notaryFeePayer),
    delayPenaltyFirstPartyPerDay: str(details.delayPenaltyFirstPartyPerDay),
    delayPenaltySecondPartyPerDay: str(details.delayPenaltySecondPartyPerDay),
    pricePerSqm: str(details.pricePerSqm),
    notes,
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
        notes: str(terms.notes ?? contract.notes),
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
    notes: str(terms.notes ?? contract.notes),
  };
}

function hydrateRentFromTyped(
  details: JsonObject,
  contract: Contract,
  notes: string,
): RentTermsForm {
  return {
    ...defaultRentTerms(),
    shareUnits: str(details.shareUnits ?? defaultRentTerms().shareUnits),
    durationMonths: str(details.durationMonths),
    fromDate: str(details.fromDate ?? contract.startDate),
    toDate: str(details.toDate ?? contract.endDate),
    monthlyAmount: str(details.monthlyAmount ?? contract.monthlyAmount),
    monthlyInWords: str(details.monthlyInWords),
    mortgageAmount: str(details.mortgageAmount ?? contract.depositAmount),
    mortgageInWords: str(details.mortgageInWords),
    totalInWords: str(details.totalInWords),
    prePaymentAmount: str(details.prePaymentAmount),
    prePaymentChequeNumber: str(details.prePaymentChequeNumber),
    prePaymentBankName: str(details.prePaymentBankName),
    prePaymentBankBranch: str(details.prePaymentBankBranch),
    remainderAmount: str(details.remainderAmount),
    remainderDueDate: str(details.remainderDueDate),
    deliveryDate: str(details.deliveryDate ?? contract.deliveryDate),
    cancelationPenalty: str(details.cancelationPenalty),
    breachPenalty: str(details.breachPenalty),
    notaryFeePayer: str(details.notaryFeePayer),
    delayPenaltyFirstPartyPerDay: str(details.delayPenaltyFirstPartyPerDay),
    delayPenaltySecondPartyPerDay: str(details.delayPenaltySecondPartyPerDay),
    notes,
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
      notes: str(terms.notes ?? contract.notes),
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
    notes: str(terms.notes ?? contract.notes),
  };
}

function hydrateGoodwillFromTyped(
  details: JsonObject,
  contract: Contract,
  notes: string,
): GoodwillTermsForm {
  return {
    ...defaultGoodwillTerms(),
    shareUnits: str(details.shareUnits ?? defaultGoodwillTerms().shareUnits),
    pricePerSqm: str(details.pricePerSqm),
    totalAmount: str(details.totalAmount ?? contract.totalAmount),
    prePaymentAmount: str(details.prePaymentAmount),
    prePaymentChequeNumber: str(details.prePaymentChequeNumber),
    prePaymentBankName: str(details.prePaymentBankName),
    prePaymentBankBranch: str(details.prePaymentBankBranch),
    remainderAmount: str(details.remainderAmount),
    remainderDueDate: str(details.remainderDueDate),
    penaltyAmount: str(details.penaltyAmount),
    deliveryDate: str(details.deliveryDate ?? contract.deliveryDate),
    notes,
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
      notes: str(terms.notes ?? contract.notes),
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
    notes: str(terms.notes ?? contract.notes),
  };
}

function hydratePresaleFromTyped(
  details: JsonObject,
  contract: Contract,
  notes: string,
): PresaleTermsForm {
  const base = defaultPresaleTerms();
  return {
    ...base,
    renovationCode: str(details.renovationCode),
    technicalIdNumber: str(details.technicalIdNumber),
    insuranceNumber: str(details.insuranceNumber),
    buildingPermitNumber: str(details.buildingPermitNumber),
    buildingPermitDate: str(details.buildingPermitDate),
    equipped: str(details.equipped),
    totalFloors: str(details.totalFloors),
    totalUnits: str(details.totalUnits),
    areaSqm: str(details.areaSqm),
    storage: str(details.storage),
    orientation: str(details.orientation),
    parkingNumberAndArea: str(details.parkingNumberAndArea),
    flooringType: str(details.flooringType),
    cabinetAndFaucetType: str(details.cabinetAndFaucetType),
    bathroomType: str(details.bathroomType),
    switchOutletType: str(details.switchOutletType),
    entranceDoorType: str(details.entranceDoorType),
    interiorDoorType: str(details.interiorDoorType),
    ceilingPlasterType: str(details.ceilingPlasterType),
    emergencyWaterSourceType: str(details.emergencyWaterSourceType),
    heatingType: str(details.heatingType),
    coolerType: str(details.coolerType),
    intercomType: str(details.intercomType),
    cctv: str(details.cctv),
    tilingType: str(details.tilingType),
    windowType: str(details.windowType),
    facadeType: str(details.facadeType),
    parkingFloorWallCover: str(details.parkingFloorWallCover),
    lighting: str(details.lighting),
    balconyCorridorRailing: str(details.balconyCorridorRailing),
    fireExtinguisher: str(details.fireExtinguisher),
    elevator: str(details.elevator),
    waterMotor: str(details.waterMotor),
    utilitiesScore: str(details.utilitiesScore),
    loan: str(details.loan),
    loanType: str(details.loanType),
    loanInstallmentAmount: str(details.loanInstallmentAmount),
    totalAmount: str(details.totalAmount ?? contract.totalAmount),
    totalInWords: str(details.totalInWords),
    deliveryDate: str(details.deliveryDate ?? contract.deliveryDate),
    deedTransferDate: str(
      details.deedTransferDate ?? contract.officialDeedDate,
    ),
    selfDeclareFormNumber: str(details.selfDeclareFormNumber),
    voucherOrganizationNumber: str(details.voucherOrganizationNumber),
    notes,
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
      notes: str(terms.notes ?? contract.notes),
    };
  }

  return {
    ...base,
    totalAmount: str(financials.totalRials ?? contract.totalAmount),
    deliveryDate: str(schedule.deliveryDueAt ?? contract.deliveryDate),
    deedTransferDate: str(
      schedule.officialDeedDueAt ?? contract.officialDeedDate,
    ),
    notes: str(terms.notes ?? contract.notes),
  };
}

function hydrateRescissionFromTyped(
  details: JsonObject,
  contract: Contract,
  notes: string,
): RescissionTermsForm {
  return {
    ...defaultRescissionTerms(),
    originalContractNumber: str(details.originalContractNumber),
    originalContractDate: str(details.originalContractDate),
    originalAgencyName: str(details.originalAgencyName),
    shareUnits: str(details.shareUnits ?? defaultRescissionTerms().shareUnits),
    areaSqm: str(details.areaSqm),
    county: str(details.county),
    ownershipNumber: str(details.ownershipNumber),
    aggregationClause: str(details.aggregationClause),
    deliveryClause: str(details.deliveryClause),
    price: str(details.price ?? contract.totalAmount),
    paymentType: str(details.paymentType),
    notes,
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
      notes: str(terms.notes ?? contract.notes),
    };
  }

  return {
    ...defaultRescissionTerms(),
    shareUnits: str(terms.shareUnits ?? defaultRescissionTerms().shareUnits),
    price: str(financials.totalRials ?? contract.totalAmount),
    notes: str(terms.notes ?? contract.notes),
  };
}

function hydrateCjvFromTyped(
  details: JsonObject,
  contract: Contract,
  notes: string,
): CjvTermsForm {
  return {
    ...defaultCjvTerms(),
    propertyDescription: str(details.propertyDescription),
    shareUnits: str(details.shareUnits ?? defaultCjvTerms().shareUnits),
    areaSqm: str(details.areaSqm),
    totalAmount: str(details.totalAmount ?? contract.totalAmount),
    totalInWords: str(details.totalInWords),
    governmentalCosts: str(details.governmentalCosts),
    constructionCosts: str(details.constructionCosts),
    facilityRightsCosts: str(details.facilityRightsCosts),
    destructionCost: str(details.destructionCost),
    firstPartyShare: str(details.firstPartyShare),
    secondPartyShare: str(details.secondPartyShare),
    startDateInWords: str(details.startDateInWords),
    endDateInWords: str(details.endDateInWords),
    costDetailsPrepareDate: str(details.costDetailsPrepareDate),
    voucherTransferDate: str(details.voucherTransferDate),
    shareUnitsToTransfer: str(details.shareUnitsToTransfer),
    delayPenaltyFirstPartyPerDay: str(details.delayPenaltyFirstPartyPerDay),
    delayPenaltySecondPartyPerDay: str(details.delayPenaltySecondPartyPerDay),
    notes,
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
      notes: str(terms.notes ?? contract.notes),
    };
  }

  return {
    ...defaultCjvTerms(),
    shareUnits: str(terms.shareUnits ?? defaultCjvTerms().shareUnits),
    totalAmount: str(financials.totalRials ?? contract.totalAmount),
    notes: str(terms.notes ?? contract.notes),
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

  const headerNotes = str(contract.notes);
  const termsNotes = str(terms.notes);
  const notes = headerNotes || termsNotes;

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

  base.commissionCityRules = str(
    contract.commissionCityRules ?? commission.cityRules,
  );
  base.commissionFactorNumber = str(
    contract.commissionFactorNumber ?? commission.factorNumber,
  );
  base.firstPartyFactorNumber = str(
    contract.firstPartyFactorNumber ?? commission.firstPartyFactorNumber,
  );
  base.secondPartyFactorNumber = str(
    contract.secondPartyFactorNumber ?? commission.secondPartyFactorNumber,
  );
  if (commission.firstPartyAmount != null && !contract.firstPartyCommissionAmount) {
    base.firstPartyCommissionAmount = str(commission.firstPartyAmount);
  }
  if (commission.secondPartyAmount != null && !contract.secondPartyCommissionAmount) {
    base.secondPartyCommissionAmount = str(commission.secondPartyAmount);
  }
  base.contractDate = str(contract.contractDate ?? contractMeta.date);
  base.contractTime = str(contract.contractTime ?? contractMeta.time);

  const firstLawyer = lawyerBySide(contract.lawyers, "FIRST_PARTY");
  const secondLawyer = lawyerBySide(contract.lawyers, "SECOND_PARTY");
  if (firstLawyer || secondLawyer) {
    base.lawyers = {
      firstPartyLawyer: firstLawyer
        ? hydrateLawyer(firstLawyer)
        : defaultLawyerForm(),
      secondPartyLawyer: secondLawyer
        ? hydrateLawyer(secondLawyer)
        : defaultLawyerForm(),
    };
  } else {
    const lawyers = asRecord(terms.lawyers);
    base.lawyers = {
      firstPartyLawyer: hydrateLawyer(lawyers.firstParty),
      secondPartyLawyer: hydrateLawyer(lawyers.secondParty),
    };
  }

  if (type === "SALE") {
    base.sale = hasKeys(contract.saleDetails)
      ? hydrateSaleFromTyped(asRecord(contract.saleDetails), contract, notes)
      : hydrateSale(terms, contract);
  } else if (type === "RENT") {
    base.rent = hasKeys(contract.rentDetails)
      ? hydrateRentFromTyped(asRecord(contract.rentDetails), contract, notes)
      : hydrateRent(terms, contract);
  } else if (type === "GOODWILL") {
    base.goodwill = hasKeys(contract.goodwillDetails)
      ? hydrateGoodwillFromTyped(
          asRecord(contract.goodwillDetails),
          contract,
          notes,
        )
      : hydrateGoodwill(terms, contract);
  } else if (type === "PRE_SALE") {
    base.presale = hasKeys(contract.preSaleDetails)
      ? hydratePresaleFromTyped(
          asRecord(contract.preSaleDetails),
          contract,
          notes,
        )
      : hydratePresale(terms, contract);
  } else if (type === "MUTUAL_RESCISSION") {
    base.rescission = hasKeys(contract.rescissionDetails)
      ? hydrateRescissionFromTyped(
          asRecord(contract.rescissionDetails),
          contract,
          notes,
        )
      : hydrateRescission(terms, contract);
  } else if (type === "CONSTRUCTION_JOINT_VENTURE") {
    base.cjv = hasKeys(contract.cjvDetails)
      ? hydrateCjvFromTyped(asRecord(contract.cjvDetails), contract, notes)
      : hydrateCjv(terms, contract);
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
      notes,
    };
  }

  return base;
}
