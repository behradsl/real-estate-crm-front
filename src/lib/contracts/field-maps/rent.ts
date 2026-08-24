import type { TemplateFieldMap } from "./types";

/** RENT — اجاره‌نامه (rent.pdf). Coords are % of page from top-left. */
export const rentFieldMap: TemplateFieldMap = {
  contractType: "RENT",
  pageCount: 1,
  fields: [
    {
      id: "contractNumber",
      start: { x: 72, y: 7.5, z: 1 },
      end: { x: 90, y: 9.5, z: 1 },
      align: "center",
    },

    // ماده ۱ — موجر
    {
      id: "firstParty.name",
      start: { x: 48, y: 15.0, z: 1 },
      end: { x: 78, y: 16.8, z: 1 },
      align: "center",
    },
    {
      id: "firstParty.fatherName",
      start: { x: 28, y: 15.0, z: 1 },
      end: { x: 42, y: 16.8, z: 1 },
      align: "center",
    },
    {
      id: "firstParty.nationalCode",
      start: { x: 48, y: 17.2, z: 1 },
      end: { x: 66, y: 19.0, z: 1 },
      align: "center",
    },
    {
      id: "firstParty.address",
      start: { x: 18, y: 19.4, z: 1 },
      end: { x: 78, y: 21.2, z: 1 },
      align: "center",
    },
    {
      id: "firstParty.phone",
      start: { x: 12, y: 21.6, z: 1 },
      end: { x: 32, y: 23.2, z: 1 },
      align: "center",
    },

    // ماده ۱ — مستأجر
    {
      id: "secondParty.name",
      start: { x: 48, y: 24.5, z: 1 },
      end: { x: 78, y: 26.3, z: 1 },
      align: "center",
    },
    {
      id: "secondParty.fatherName",
      start: { x: 28, y: 24.5, z: 1 },
      end: { x: 42, y: 26.3, z: 1 },
      align: "center",
    },
    {
      id: "secondParty.nationalCode",
      start: { x: 48, y: 26.7, z: 1 },
      end: { x: 66, y: 28.5, z: 1 },
      align: "center",
    },
    {
      id: "secondParty.address",
      start: { x: 18, y: 28.9, z: 1 },
      end: { x: 78, y: 30.7, z: 1 },
      align: "center",
    },
    {
      id: "secondParty.phone",
      start: { x: 12, y: 31.1, z: 1 },
      end: { x: 32, y: 32.7, z: 1 },
      align: "center",
    },

    // ماده ۲ — ملک
    {
      id: "property.title",
      start: { x: 35, y: 34.5, z: 1 },
      end: { x: 78, y: 36.3, z: 1 },
      align: "center",
    },
    {
      id: "property.areaSqm",
      start: { x: 18, y: 34.5, z: 1 },
      end: { x: 30, y: 36.3, z: 1 },
      align: "center",
    },
    {
      id: "property.address",
      start: { x: 18, y: 38.5, z: 1 },
      end: { x: 78, y: 40.5, z: 1 },
      align: "center",
    },

    // ماده ۳ — مدت
    {
      id: "rent.shareUnits",
      start: { x: 12, y: 42.5, z: 1 },
      end: { x: 20, y: 44.3, z: 1 },
      align: "center",
    },
    {
      id: "rent.durationMonths",
      start: { x: 70, y: 42.5, z: 1 },
      end: { x: 82, y: 44.3, z: 1 },
      align: "center",
    },
    {
      id: "rent.startDate",
      start: { x: 45, y: 42.5, z: 1 },
      end: { x: 62, y: 44.3, z: 1 },
      align: "center",
    },
    {
      id: "rent.endDate",
      start: { x: 22, y: 42.5, z: 1 },
      end: { x: 39, y: 44.3, z: 1 },
      align: "center",
    },

    // ماده ۴ — اجاره
    {
      id: "rent.totalRials",
      start: { x: 55, y: 46.0, z: 1 },
      end: { x: 78, y: 47.8, z: 1 },
      align: "center",
    },
    {
      id: "rent.monthlyRials",
      start: { x: 55, y: 48.5, z: 1 },
      end: { x: 78, y: 50.3, z: 1 },
      align: "center",
    },
    {
      id: "rent.monthlyInWords",
      start: { x: 18, y: 48.5, z: 1 },
      end: { x: 50, y: 50.3, z: 1 },
      align: "center",
    },
    {
      id: "rent.securityDepositRials",
      start: { x: 55, y: 51.0, z: 1 },
      end: { x: 78, y: 52.8, z: 1 },
      align: "center",
    },
    {
      id: "rent.bankName",
      start: { x: 55, y: 53.5, z: 1 },
      end: { x: 72, y: 55.3, z: 1 },
      align: "center",
    },
    {
      id: "rent.accountNumber",
      start: { x: 25, y: 53.5, z: 1 },
      end: { x: 48, y: 55.3, z: 1 },
      align: "center",
    },
    {
      id: "rent.delayPenaltyPerDayRials",
      start: { x: 18, y: 58.0, z: 1 },
      end: { x: 35, y: 59.8, z: 1 },
      align: "center",
    },

    // کمیسیون
    {
      id: "commissionAmount",
      start: { x: 55, y: 74.0, z: 1 },
      end: { x: 78, y: 75.8, z: 1 },
      align: "center",
    },
    {
      id: "taxAmount",
      start: { x: 25, y: 74.0, z: 1 },
      end: { x: 45, y: 75.8, z: 1 },
      align: "center",
    },

    {
      id: "rent.notes",
      start: { x: 12, y: 80.0, z: 1 },
      end: { x: 88, y: 86.0, z: 1 },
      align: "right",
    },

    {
      id: "sign.firstParty",
      start: { x: 72, y: 90.5, z: 1 },
      end: { x: 92, y: 93.5, z: 1 },
      align: "center",
    },
    {
      id: "sign.secondParty",
      start: { x: 50, y: 90.5, z: 1 },
      end: { x: 70, y: 93.5, z: 1 },
      align: "center",
    },
    {
      id: "sign.witness1",
      start: { x: 28, y: 90.5, z: 1 },
      end: { x: 48, y: 93.5, z: 1 },
      align: "center",
    },
    {
      id: "sign.witness2",
      start: { x: 8, y: 90.5, z: 1 },
      end: { x: 26, y: 93.5, z: 1 },
      align: "center",
    },
  ],
};
