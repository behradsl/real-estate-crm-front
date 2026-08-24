import type { ContractType, JsonObject, OtherFacility } from "@/lib/api/types";

export const deedInfoDefaults = {
  cadastralNumber: "12345/67",
  subParcelNumber: "67",
  mainParcelNumber: "12345",
  plotNumber: "12",
  cadastralDistrict: "11",
  registrationArea: "همدان",
  areaSqm: "120.5",
  postalCode: "6513112345",
};

export const otherFacilitiesExample: OtherFacility[] = [
  { name: "گرمایش", kind: "گرمایش از کف" },
  { name: "کابینت", kind: "MDF" },
];

export const termsByContractType: Record<ContractType, JsonObject> = {
  SALE: {
    type: "SALE",
    shareUnits: 6,
    price: {
      totalRials: 15000000000,
      totalInWords: "پانزده میلیارد ریال",
      currency: "IRR",
      payments: [
        {
          label: "بیعانه",
          amountRials: 2000000000,
          dueAt: "1404/01/15",
          method: "CASH",
        },
        {
          label: "باقیمانده در دفترخانه",
          amountRials: 13000000000,
          dueAt: "1404/02/20",
          method: "BANK",
        },
      ],
    },
    transfer: {
      notaryOffice: "دفترخانه شماره ۱۲ همدان",
      officialDeedDueAt: "1404/02/20",
      deliveryDueAt: "1404/02/25",
    },
    penalties: {
      delayPenaltyPerDayRials: 5000000,
      arbitrationCenter: "مرکز داوری اتحادیه مشاورین املاک",
    },
    clauses: ["ماده۴ تا ماده۱۱ طبق فرم اتحادیه"],
  },
  RENT: {
    type: "RENT",
    shareUnits: 6,
    duration: {
      startDate: "1404/01/01",
      endDate: "1405/01/01",
      unit: "YEAR",
      value: 1,
    },
    rent: {
      totalRials: 1200000000,
      monthlyRials: 100000000,
      securityDepositRials: 500000000,
      paymentDayOfMonth: 5,
      paymentMethod: {
        type: "BANK",
        bankName: "ملی",
        accountNumber: "0100000000000",
        branch: "مرکزی",
      },
    },
    handoverDate: "1404/01/01",
    penalties: { delayPenaltyPerDayRials: 2000000 },
    clauses: ["مواد ۶ تا ۱۱ فرم اجاره"],
  },
  GOODWILL: {
    type: "GOODWILL",
    shareUnits: 6,
    businessRight: {
      description: "انتقال سرقفلی یک باب مغازه",
      unitCount: 1,
    },
    price: {
      totalRials: 8000000000,
      totalTomans: 800000000,
      paidUpfrontRials: 3000000000,
      remainingAtOfficialDeedRials: 5000000000,
    },
    transfer: {
      notaryOffice: "دفترخانه شماره ۵",
      officialDeedDueAt: "1404/03/10",
      deliveryDueAt: "1404/03/12",
    },
    taxes: {
      municipal: true,
      business: true,
      transfer: true,
      payer: "TRANSFEREE",
    },
  },
  PRE_SALE: {
    type: "PRE_SALE",
    buildingPermitNumber: "99-100-20",
    buildingSpecs: {
      totalFloors: 5,
      unitsPerFloor: 2,
      unitAreaSqm: 120.5,
      targetFloor: 3,
      orientation: "SOUTH",
      parkingNumber: "P-03",
      storageNumber: "S-03",
      flooring: "CERAMIC",
      kitchenCabinets: "MDF_HIGH_GLOSS",
      heatingSystem: "PACKAGE_RADIATOR",
      coolingSystem: "SPLIT",
      windowType: "UPVC_DOUBLE_GLAZED",
      facadeType: "TRAVERTINE",
      skeleton: "CONCRETE",
      elevator: true,
      security: ["CCTV", "ANTI_THEFT_DOOR"],
    },
    financials: {
      totalPriceRials: 50000000000,
      paymentSchedule: [
        { percent: 30, label: "پیش‌پرداخت", dueAt: "1404/01/01" },
        { percent: 60, label: "اقساط ساخت", dueAt: "1404/06/01" },
        { percent: 10, label: "زمان انتقال سند", dueAt: "1405/01/01" },
      ],
    },
  },
  MUTUAL_RESCISSION: {
    type: "MUTUAL_RESCISSION",
    originalContract: {
      contractNumber: "CNT-2025-088",
      contractType: "SALE",
      signedAt: "1403/08/12",
    },
    rescission: {
      reason: "توافق طرفین برای فسخ",
      effectiveDate: "1404/02/01",
      propertyReturnedAsIs: true,
      waiveFutureClaims: true,
    },
    settlement: {
      refundAmountRials: 2000000000,
      refundDueAt: "1404/02/05",
      notes: "بازگشت بیعانه پس از تحویل ملک",
    },
  },
  CONSTRUCTION_JOINT_VENTURE: {
    type: "CONSTRUCTION_JOINT_VENTURE",
    shareUnits: 6,
    land: { areaSqm: 250.5, landValueRials: 50000000000 },
    shares: {
      firstPartyPercent: 55,
      secondPartyPercent: 45,
      firstPartyDangs: 3.3,
      secondPartyDangs: 2.7,
    },
    timeline: {
      startDate: "1404/01/01",
      endDate: "1406/01/01",
      milestones: [
        { name: "اسکلت", dueAt: "1404/08/01" },
        { name: "نازک‌کاری", dueAt: "1405/06/01" },
        { name: "تحویل", dueAt: "1406/01/01" },
      ],
    },
    constructionObligations: {
      builderParty: "SECOND_PARTY",
      landOwnerParty: "FIRST_PARTY",
      permitsResponsibility: "SECOND_PARTY",
    },
  },
};

export const PROPERTY_TYPES = [
  "APARTMENT",
  "HOUSE",
  "VILLA",
  "LAND",
  "OFFICE",
  "SHOP",
  "WAREHOUSE",
  "OTHER",
] as const;

export const CONTRACT_TYPES = [
  "SALE",
  "RENT",
  "GOODWILL",
  "PRE_SALE",
  "MUTUAL_RESCISSION",
  "CONSTRUCTION_JOINT_VENTURE",
] as const;

export const USER_ROLES = [
  "ADMIN",
  "OWNER",
  "MANAGER",
  "AGENT",
  "ASSISTANT",
] as const;
