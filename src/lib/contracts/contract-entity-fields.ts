import type { ContractType } from "@/lib/api/types";

export type PartyFormField =
  | "type"
  | "firstName"
  | "lastName"
  | "companyName"
  | "economicCode"
  | "nationalCode"
  | "fatherName"
  | "gender"
  | "phone"
  | "email"
  | "birthPlace"
  | "birthDate"
  | "identityNumber"
  | "identityExportPlace"
  | "addressCity"
  | "addressProvince"
  | "addressDetails"
  | "addressPlaque"
  | "addressPostalCode";

export type PropertyFormField =
  | "title"
  | "description"
  | "propertyType"
  | "referenceCode"
  | "areaSqm"
  | "floor"
  | "totalFloors"
  | "yearBuilt"
  | "bedrooms"
  | "bathrooms"
  | "addressCity"
  | "addressProvince"
  | "addressDetails"
  | "addressPlaque"
  | "addressPostalCode"
  | "water"
  | "electricity"
  | "gas"
  | "telephone"
  | "parking"
  | "parkingCount"
  | "storage"
  | "storageCount"
  | "storageArea"
  | "elevator"
  | "otherFacilities"
  | "deedCadastralNumber"
  | "deedSubParcelNumber"
  | "deedMainParcelNumber"
  | "deedPlotNumber"
  | "deedCadastralDistrict"
  | "deedRegistrationArea"
  | "deedAreaSqm"
  | "deedPostalCode"
  | "deedSerialNumber";

/** Core identity fields always shown in wizard create forms. */
const PARTY_CORE = [
  "type",
  "firstName",
  "lastName",
  "companyName",
  "economicCode",
] as const satisfies readonly PartyFormField[];

const PROPERTY_CORE = [
  "title",
  "propertyType",
] as const satisfies readonly PropertyFormField[];

const PARTY_BY_TYPE: Record<ContractType, readonly PartyFormField[]> = {
  SALE: [
    ...PARTY_CORE,
    "fatherName",
    "gender",
    "identityNumber",
    "identityExportPlace",
    "nationalCode",
    "birthPlace",
    "phone",
    "addressCity",
    "addressProvince",
    "addressDetails",
    "addressPlaque",
    "addressPostalCode",
  ],
  RENT: [
    ...PARTY_CORE,
    "fatherName",
    "identityNumber",
    "nationalCode",
    "birthPlace",
    "phone",
    "addressCity",
    "addressProvince",
    "addressDetails",
    "addressPostalCode",
  ],
  GOODWILL: [
    ...PARTY_CORE,
    "fatherName",
    "identityNumber",
    "nationalCode",
    "phone",
    "addressCity",
    "addressProvince",
    "addressDetails",
  ],
  PRE_SALE: [
    ...PARTY_CORE,
    "fatherName",
    "identityNumber",
    "nationalCode",
    "birthPlace",
    "birthDate",
    "phone",
    "addressCity",
    "addressProvince",
    "addressDetails",
    "addressPlaque",
    "addressPostalCode",
  ],
  MUTUAL_RESCISSION: [
    ...PARTY_CORE,
    "fatherName",
    "identityNumber",
    "nationalCode",
    "phone",
    "addressCity",
    "addressProvince",
  ],
  CONSTRUCTION_JOINT_VENTURE: [
    ...PARTY_CORE,
    "fatherName",
    "identityNumber",
    "nationalCode",
    "phone",
    "addressCity",
    "addressProvince",
    "addressDetails",
    "addressPlaque",
    "addressPostalCode",
  ],
};

const PROPERTY_BY_TYPE: Record<ContractType, readonly PropertyFormField[]> = {
  SALE: [
    ...PROPERTY_CORE,
    "description",
    "referenceCode",
    "areaSqm",
    "yearBuilt",
    "addressCity",
    "addressProvince",
    "addressDetails",
    "addressPlaque",
    "addressPostalCode",
    "parking",
    "parkingCount",
    "storage",
    "storageCount",
    "storageArea",
    "deedCadastralNumber",
    "deedSubParcelNumber",
    "deedMainParcelNumber",
    "deedCadastralDistrict",
    "deedRegistrationArea",
    "deedAreaSqm",
    "deedPostalCode",
    "water",
    "electricity",
    "gas",
    "telephone",
    "elevator",
  ],
  RENT: [
    ...PROPERTY_CORE,
    "bedrooms",
    "addressPostalCode",
    "parking",
    "parkingCount",
    "storage",
    "storageCount",
    "deedCadastralNumber",
    "deedSubParcelNumber",
    "deedMainParcelNumber",
    "deedSerialNumber",
    "deedPostalCode",
  ],
  GOODWILL: [
    ...PROPERTY_CORE,
    "storage",
    "storageCount",
    "deedCadastralNumber",
    "deedSubParcelNumber",
    "deedMainParcelNumber",
    "deedCadastralDistrict",
    "deedRegistrationArea",
  ],
  PRE_SALE: [
    ...PROPERTY_CORE,
    "deedCadastralNumber",
    "addressCity",
    "addressProvince",
  ],
  MUTUAL_RESCISSION: [
    ...PROPERTY_CORE,
    "areaSqm",
    "deedCadastralNumber",
    "deedSubParcelNumber",
    "deedMainParcelNumber",
    "deedCadastralDistrict",
  ],
  CONSTRUCTION_JOINT_VENTURE: [
    ...PROPERTY_CORE,
    "areaSqm",
    "addressCity",
    "addressProvince",
    "addressDetails",
    "addressPlaque",
    "addressPostalCode",
  ],
};

/** Full CRM union — every field any contract type (or general CRM) may need. */
export const ALL_PARTY_FORM_FIELDS = [
  "type",
  "firstName",
  "lastName",
  "companyName",
  "economicCode",
  "nationalCode",
  "fatherName",
  "gender",
  "phone",
  "email",
  "birthPlace",
  "birthDate",
  "identityNumber",
  "identityExportPlace",
  "addressCity",
  "addressProvince",
  "addressDetails",
  "addressPlaque",
  "addressPostalCode",
] as const satisfies readonly PartyFormField[];

export const ALL_PROPERTY_FORM_FIELDS = [
  "title",
  "description",
  "propertyType",
  "referenceCode",
  "areaSqm",
  "floor",
  "totalFloors",
  "yearBuilt",
  "bedrooms",
  "bathrooms",
  "addressCity",
  "addressProvince",
  "addressDetails",
  "addressPlaque",
  "addressPostalCode",
  "water",
  "electricity",
  "gas",
  "telephone",
  "parking",
  "parkingCount",
  "storage",
  "storageCount",
  "storageArea",
  "elevator",
  "otherFacilities",
  "deedCadastralNumber",
  "deedSubParcelNumber",
  "deedMainParcelNumber",
  "deedPlotNumber",
  "deedCadastralDistrict",
  "deedRegistrationArea",
  "deedAreaSqm",
  "deedPostalCode",
  "deedSerialNumber",
] as const satisfies readonly PropertyFormField[];

function uniquePreserveOrder<T extends string>(items: readonly T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    if (seen.has(item)) continue;
    seen.add(item);
    out.push(item);
  }
  return out;
}

export function partyFieldsForContract(
  type: ContractType | "ALL",
): readonly PartyFormField[] {
  if (type === "ALL") return ALL_PARTY_FORM_FIELDS;
  return PARTY_BY_TYPE[type];
}

export function propertyFieldsForContract(
  type: ContractType | "ALL",
): readonly PropertyFormField[] {
  if (type === "ALL") return ALL_PROPERTY_FORM_FIELDS;
  return PROPERTY_BY_TYPE[type];
}

export function showPartyField(
  fields: readonly PartyFormField[],
  key: PartyFormField,
): boolean {
  return fields.includes(key);
}

export function showPropertyField(
  fields: readonly PropertyFormField[],
  key: PropertyFormField,
): boolean {
  return fields.includes(key);
}

const PARTY_ADDRESS_PRINT_FIELDS: readonly PartyFormField[] = [
  "addressCity",
  "addressProvince",
  "addressDetails",
  "addressPlaque",
];

/** Map party form fields → print catalog keys for one party prefix. */
export function partyPrintKeysFromFields(
  fields: readonly PartyFormField[],
  prefix: "firstParty" | "secondParty",
): string[] {
  const keys: string[] = [];
  const has = (k: PartyFormField) => fields.includes(k);

  if (has("firstName") || has("lastName") || has("companyName")) {
    keys.push(`${prefix}.name`);
  }
  if (has("fatherName")) keys.push(`${prefix}.fatherName`);
  if (has("identityNumber")) keys.push(`${prefix}.identityNumber`);
  if (has("identityExportPlace")) keys.push(`${prefix}.identityExportPlace`);
  if (has("nationalCode")) keys.push(`${prefix}.nationalCode`);
  if (has("birthPlace")) keys.push(`${prefix}.birthPlace`);
  if (has("birthDate")) keys.push(`${prefix}.birthDate`);
  if (PARTY_ADDRESS_PRINT_FIELDS.some(has)) keys.push(`${prefix}.address`);
  if (has("addressPostalCode")) keys.push(`${prefix}.postalCode`);
  if (has("phone")) keys.push(`${prefix}.phone`);

  return keys;
}

const PROPERTY_ADDRESS_PRINT_FIELDS: readonly PropertyFormField[] = [
  "addressCity",
  "addressProvince",
  "addressDetails",
  "addressPlaque",
];

/** Map property form fields → `property.*` print catalog keys. */
export function propertyPrintKeysFromFields(
  fields: readonly PropertyFormField[],
): string[] {
  const keys: string[] = [];
  const has = (k: PropertyFormField) => fields.includes(k);

  if (has("propertyType")) keys.push("property.type");
  if (has("areaSqm")) keys.push("property.areaSqm");
  if (has("yearBuilt")) keys.push("property.yearBuilt");
  if (has("bedrooms")) keys.push("property.bedrooms");
  if (has("parking") || has("parkingCount")) keys.push("property.parking");
  if (has("storage") || has("storageCount") || has("storageArea")) {
    keys.push("property.storage");
  }
  if (PROPERTY_ADDRESS_PRINT_FIELDS.some(has)) keys.push("property.address");
  if (has("addressPostalCode") || has("deedPostalCode")) {
    keys.push("property.postalCode");
  }
  if (has("deedCadastralNumber")) keys.push("property.cadastralNumber");
  if (has("deedSubParcelNumber")) keys.push("property.subParcelNumber");
  if (has("deedMainParcelNumber")) keys.push("property.mainParcelNumber");
  if (has("deedCadastralDistrict")) keys.push("property.cadastralDistrict");
  if (has("deedRegistrationArea")) keys.push("property.registrationArea");
  if (has("deedSerialNumber")) keys.push("property.deedSerialNumber");

  return uniquePreserveOrder(keys);
}
