export type UserRole =
  | "ADMIN"
  | "OWNER"
  | "MANAGER"
  | "AGENT"
  | "ASSISTANT";

export type PropertyType =
  | "APARTMENT"
  | "HOUSE"
  | "VILLA"
  | "LAND"
  | "OFFICE"
  | "SHOP"
  | "WAREHOUSE"
  | "OTHER";

export type ContractType =
  | "SALE"
  | "RENT"
  | "GOODWILL"
  | "PRE_SALE"
  | "MUTUAL_RESCISSION"
  | "CONSTRUCTION_JOINT_VENTURE";

export type PartyType = "PERSON" | "COMPANY";
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type ContractPartyRole = "FIRST_PARTY" | "SECOND_PARTY" | "WITNESS";

export type JsonObject = Record<string, unknown>;

export interface Address {
  id: string;
  city: string;
  province: string;
  details: string | null;
  plaque: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AddressInput {
  city: string;
  province: string;
  details?: string;
  plaque?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface OtherFacility {
  name: string;
  kind: string;
}

export interface UserOrganizationSummary {
  id: string;
  name: string;
  slug: string;
}

export interface User {
  id: string;
  organizationId: string | null;
  organization?: UserOrganizationSummary | null;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  licenseNumber: string | null;
  addressId: string | null;
  address?: Address | null;
  createdAt: string;
  updatedAt: string;
}

export interface DeedInfo {
  id: string;
  propertyId: string;
  cadastralNumber: string | null;
  subParcelNumber: string | null;
  mainParcelNumber: string | null;
  plotNumber: string | null;
  cadastralDistrict: string | null;
  registrationArea: string | null;
  areaSqm: number | null;
  postalCode: string | null;
  deedSerialNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PrintPoint = { x: number; y: number; page?: number };
export type PrintFieldBox = {
  start: PrintPoint;
  end: PrintPoint;
  align?: "center" | "right" | "left";
};
export interface ContractPrintLayout {
  id: string;
  organizationId: string;
  contractType: ContractType;
  paperWidthMm: number;
  paperHeightMm: number;
  fields: Record<string, PrintFieldBox>;
  createdAt: string;
  updatedAt: string;
}
export type UpsertPrintLayoutInput = {
  paperWidthMm?: number;
  paperHeightMm?: number;
  fields: Record<string, PrintFieldBox>;
};

export interface RelatedContract {
  id: string;
  organizationId: string;
  propertyId: string;
  contractType: ContractType;
  contractNumber: string;
  description: string | null;
  totalAmount: string | null;
  monthlyAmount: string | null;
  depositAmount: string | null;
  signedAt: string | null;
  createdAt: string;
  updatedAt: string;
  role?: ContractPartyRole;
}

export interface Property {
  id: string;
  organizationId: string;
  ownerId: string;
  title: string;
  description: string | null;
  propertyType: PropertyType;
  addressId: string | null;
  address: Address | null;
  areaSqm: number | null;
  floor: number | null;
  totalFloors: number | null;
  yearBuilt: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpots: number | null;
  furnished: boolean | null;
  water: boolean | null;
  electricity: boolean | null;
  gas: boolean | null;
  telephone: boolean | null;
  parking: boolean | null;
  parkingCount: number | null;
  storage: boolean | null;
  storageCount: number | null;
  storageArea: number | null;
  elevator: boolean | null;
  otherFacilities: OtherFacility[] | null;
  referenceCode: string | null;
  deedInfo: DeedInfo | null;
  contracts?: RelatedContract[];
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Party {
  id: string;
  organizationId: string;
  type: PartyType;
  firstName: string | null;
  lastName: string | null;
  nationalCode: string | null;
  economicCode: string | null;
  companyName: string | null;
  birthDate: string | null;
  birthPlace: string | null;
  identityExportPlace: string | null;
  fatherName: string | null;
  identityNumber: string | null;
  gender: Gender | null;
  phone: string | null;
  email: string | null;
  addressId: string | null;
  address: Address | null;
  contracts?: RelatedContract[];
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContractParty {
  id: string;
  contractId: string;
  partyId: string;
  role: ContractPartyRole;
  party: Party;
  createdAt: string;
}

export interface ContractSignature {
  id: string;
  contractId: string;
  partyId: string;
  fileId: string | null;
  data: JsonObject | null;
  signedAt: string;
  createdAt: string;
}

export type ContractLawyerSide = "FIRST_PARTY" | "SECOND_PARTY";

export interface ContractLawyer {
  id: string;
  contractId: string;
  side: ContractLawyerSide;
  name: string | null;
  fatherName: string | null;
  identityNumber: string | null;
  birthPlace: string | null;
  birthDate: string | null;
  identityExportPlace: string | null;
  nationalCode: string | null;
  address: string | null;
  postalCode: string | null;
  cause: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LawyerInput {
  name?: string;
  fatherName?: string;
  identityNumber?: string;
  birthPlace?: string;
  birthDate?: string;
  identityExportPlace?: string;
  nationalCode?: string;
  address?: string;
  postalCode?: string;
  cause?: string;
}

export interface ContractLawyersInput {
  firstParty?: LawyerInput;
  secondParty?: LawyerInput;
}

/** Nested party upsert: with `id` → patch then link; without → create. */
export type ContractPartyNestedInput = Partial<CreatePartyInput> & {
  id?: string;
};

/** Nested property upsert: with `id` → patch then link; without → create. */
export type ContractPropertyNestedInput = Partial<CreatePropertyInput> & {
  id?: string;
};

export type SaleDetailsInput = {
  shareUnits?: number;
  pricePerSqm?: number;
  totalAmount?: number;
  totalInWords?: string;
  prePaymentAmount?: number;
  prePaymentChequeNumber?: string;
  prePaymentBankName?: string;
  prePaymentBankBranch?: string;
  remainderAmount?: number;
  voucherRegistrationDate?: string;
  voucherOrganizationNumber?: string;
  deliveryDate?: string;
  cancelationPenalty?: string;
  breachPenalty?: string;
  notaryFeePayer?: string;
  delayPenaltyFirstPartyPerDay?: number;
  delayPenaltySecondPartyPerDay?: number;
};

export type RentDetailsInput = {
  shareUnits?: number;
  durationMonths?: number;
  fromDate?: string;
  toDate?: string;
  monthlyAmount?: number;
  monthlyInWords?: string;
  mortgageAmount?: number;
  mortgageInWords?: string;
  totalInWords?: string;
  prePaymentAmount?: number;
  prePaymentChequeNumber?: string;
  prePaymentBankName?: string;
  prePaymentBankBranch?: string;
  remainderAmount?: number;
  remainderDueDate?: string;
  deliveryDate?: string;
  cancelationPenalty?: string;
  breachPenalty?: string;
  notaryFeePayer?: string;
  delayPenaltyFirstPartyPerDay?: number;
  delayPenaltySecondPartyPerDay?: number;
  propertyOwnerName?: string;
};

export type GoodwillDetailsInput = {
  shareUnits?: number;
  pricePerSqm?: number;
  totalAmount?: number;
  prePaymentAmount?: number;
  prePaymentChequeNumber?: string;
  prePaymentBankName?: string;
  prePaymentBankBranch?: string;
  remainderAmount?: number;
  remainderDueDate?: string;
  penaltyAmount?: string;
  deliveryDate?: string;
};

export type PreSaleDetailsInput = {
  renovationCode?: string;
  technicalIdNumber?: string;
  insuranceNumber?: string;
  buildingPermitNumber?: string;
  buildingPermitDate?: string;
  equipped?: string;
  totalFloors?: number;
  totalUnits?: number;
  areaSqm?: number;
  storage?: string;
  orientation?: string;
  parkingNumberAndArea?: string;
  flooringType?: string;
  cabinetAndFaucetType?: string;
  bathroomType?: string;
  switchOutletType?: string;
  entranceDoorType?: string;
  interiorDoorType?: string;
  ceilingPlasterType?: string;
  emergencyWaterSourceType?: string;
  heatingType?: string;
  coolerType?: string;
  intercomType?: string;
  cctv?: string;
  tilingType?: string;
  windowType?: string;
  facadeType?: string;
  parkingFloorWallCover?: string;
  lighting?: string;
  balconyCorridorRailing?: string;
  fireExtinguisher?: string;
  elevator?: string;
  waterMotor?: string;
  utilitiesScore?: string;
  loan?: string;
  loanType?: string;
  loanInstallmentAmount?: number;
  totalAmount?: number;
  totalInWords?: string;
  deliveryDate?: string;
  deedTransferDate?: string;
  selfDeclareFormNumber?: string;
  voucherOrganizationNumber?: string;
};

export type RescissionDetailsInput = {
  originalContractNumber?: string;
  originalContractDate?: string;
  originalAgencyName?: string;
  shareUnits?: number;
  areaSqm?: number;
  county?: string;
  ownershipNumber?: string;
  aggregationClause?: string;
  deliveryClause?: string;
  price?: number;
  paymentType?: string;
};

export type CjvDetailsInput = {
  propertyDescription?: string;
  shareUnits?: number;
  areaSqm?: number;
  totalAmount?: number;
  totalInWords?: string;
  governmentalCosts?: number;
  constructionCosts?: number;
  facilityRightsCosts?: number;
  destructionCost?: number;
  firstPartyShare?: string;
  secondPartyShare?: string;
  startDateInWords?: string;
  endDateInWords?: string;
  costDetailsPrepareDate?: string;
  voucherTransferDate?: string;
  shareUnitsToTransfer?: string;
  delayPenaltyFirstPartyPerDay?: number;
  delayPenaltySecondPartyPerDay?: number;
};

export interface Contract {
  id: string;
  organizationId: string;
  createdById: string;
  propertyId: string;
  contractType: ContractType;
  contractNumber: string;
  description: string | null;
  contractDate: string | null;
  contractTime: string | null;
  commissionPercentage: string | null;
  commissionAmount: string | null;
  taxPercentage: string | null;
  taxAmount: string | null;
  firstPartyCommissionPercentage: string | null;
  firstPartyCommissionAmount: string | null;
  secondPartyCommissionPercentage: string | null;
  secondPartyCommissionAmount: string | null;
  commissionCityRules: string | null;
  commissionFactorNumber: string | null;
  firstPartyFactorNumber: string | null;
  secondPartyFactorNumber: string | null;
  notes: string | null;
  totalAmount: string | null;
  monthlyAmount: string | null;
  depositAmount: string | null;
  startDate: string | null;
  endDate: string | null;
  deliveryDate: string | null;
  officialDeedDate: string | null;
  /** @deprecated Prefer typed *Details */
  termsAndConditions: JsonObject | null;
  signedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  property?: Property;
  parties?: ContractParty[];
  signatures?: ContractSignature[];
  lawyers?: ContractLawyer[];
  saleDetails?: SaleDetailsInput | JsonObject | null;
  rentDetails?: RentDetailsInput | JsonObject | null;
  goodwillDetails?: GoodwillDetailsInput | JsonObject | null;
  preSaleDetails?: PreSaleDetailsInput | JsonObject | null;
  rescissionDetails?: RescissionDetailsInput | JsonObject | null;
  cjvDetails?: CjvDetailsInput | JsonObject | null;
}

export interface LoginInput {
  email: string;
  password: string;
  organizationSlug?: string;
}

export interface CreateOrganizationInput {
  name: string;
  slug: string;
  phone?: string;
  email?: string;
  website?: string;
  licenseNumber?: string;
  address?: AddressInput;
  owner: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
}

export interface UpdateOrganizationInput {
  name?: string;
  slug?: string;
  phone?: string;
  email?: string;
  website?: string;
  licenseNumber?: string;
  address?: AddressInput;
}

export interface CreateUserInput {
  organizationId?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
}

export interface CreatePropertyInput {
  organizationId?: string;
  ownerId?: string;
  title: string;
  description?: string;
  propertyType: PropertyType;
  address?: AddressInput;
  addressId?: string;
  areaSqm?: number;
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpots?: number;
  furnished?: boolean;
  water?: boolean;
  electricity?: boolean;
  gas?: boolean;
  telephone?: boolean;
  parking?: boolean;
  parkingCount?: number;
  storage?: boolean;
  storageCount?: number;
  storageArea?: number;
  elevator?: boolean;
  otherFacilities?: OtherFacility[];
  referenceCode?: string;
  deedInfo?: {
    cadastralNumber?: string;
    subParcelNumber?: string;
    mainParcelNumber?: string;
    plotNumber?: string;
    cadastralDistrict?: string;
    registrationArea?: string;
    areaSqm?: number;
    postalCode?: string;
    deedSerialNumber?: string;
  };
}

export interface CreatePartyInput {
  organizationId?: string;
  type: PartyType;
  firstName?: string;
  lastName?: string;
  nationalCode?: string;
  economicCode?: string;
  companyName?: string;
  birthDate?: string;
  birthPlace?: string;
  identityExportPlace?: string;
  fatherName?: string;
  identityNumber?: string;
  gender?: Gender;
  phone?: string;
  email?: string;
  address?: AddressInput;
  addressId?: string;
}

export interface CreateContractInput {
  organizationId?: string;
  contractType: ContractType;
  contractNumber: string;
  /** Link existing property. Prefer nested `property` when patching. */
  propertyId?: string;
  property?: ContractPropertyNestedInput;
  description?: string;
  contractDate?: string;
  contractTime?: string;
  commissionCityRules?: string;
  commissionFactorNumber?: string;
  firstPartyFactorNumber?: string;
  secondPartyFactorNumber?: string;
  notes?: string;
  commissionPercentage?: number;
  commissionAmount?: number;
  taxPercentage?: number;
  taxAmount?: number;
  firstPartyCommissionPercentage?: number;
  firstPartyCommissionAmount?: number;
  secondPartyCommissionPercentage?: number;
  secondPartyCommissionAmount?: number;
  totalAmount?: number;
  monthlyAmount?: number;
  depositAmount?: number;
  startDate?: string;
  endDate?: string;
  deliveryDate?: string;
  officialDeedDate?: string;
  /** @deprecated Prefer typed *Details */
  termsAndConditions?: JsonObject;
  firstPartyId?: string;
  secondPartyId?: string;
  witnessIds?: string[];
  firstParty?: ContractPartyNestedInput;
  secondParty?: ContractPartyNestedInput;
  witnesses?: ContractPartyNestedInput[];
  lawyers?: ContractLawyersInput;
  saleDetails?: SaleDetailsInput;
  rentDetails?: RentDetailsInput;
  goodwillDetails?: GoodwillDetailsInput;
  preSaleDetails?: PreSaleDetailsInput;
  rescissionDetails?: RescissionDetailsInput;
  cjvDetails?: CjvDetailsInput;
}

export type UpdateContractInput = Partial<CreateContractInput> & {
  signedAt?: string;
};

export interface CreateSignatureInput {
  partyId: string;
  fileId?: string;
  data?: JsonObject;
  signedAt?: string;
}
