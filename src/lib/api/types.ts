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
  street: string | null;
  alley: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AddressInput {
  city: string;
  province: string;
  street?: string;
  alley?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface User {
  id: string;
  organizationId: string | null;
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
  addressId: string | null;
  address?: Address | null;
  createdAt: string;
  updatedAt: string;
}

export interface DeedInfo {
  id: string;
  propertyId: string;
  data: JsonObject;
  createdAt: string;
  updatedAt: string;
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
  facilities: JsonObject | null;
  referenceCode: string | null;
  deedInfo: DeedInfo | null;
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

export interface Contract {
  id: string;
  organizationId: string;
  createdById: string;
  propertyId: string;
  contractType: ContractType;
  contractNumber: string;
  description: string | null;
  commissionPercentage: string | null;
  commissionAmount: string | null;
  taxPercentage: string | null;
  taxAmount: string | null;
  firstPartyCommissionPercentage: string | null;
  firstPartyCommissionAmount: string | null;
  secondPartyCommissionPercentage: string | null;
  secondPartyCommissionAmount: string | null;
  totalAmount: string | null;
  monthlyAmount: string | null;
  depositAmount: string | null;
  startDate: string | null;
  endDate: string | null;
  deliveryDate: string | null;
  officialDeedDate: string | null;
  termsAndConditions: JsonObject | null;
  signedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  property?: Property;
  parties?: ContractParty[];
  signatures?: ContractSignature[];
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
  address?: AddressInput;
  owner: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
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
  facilities?: JsonObject;
  referenceCode?: string;
  deedInfo?: { data: JsonObject };
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
  propertyId: string;
  description?: string;
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
  termsAndConditions?: JsonObject;
  firstPartyId: string;
  secondPartyId: string;
  witnessIds?: string[];
}

export interface CreateSignatureInput {
  partyId: string;
  fileId?: string;
  data?: JsonObject;
  signedAt?: string;
}
