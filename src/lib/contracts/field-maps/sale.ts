import type { TemplateFieldMap } from "./types";

/** SALE — مبایعه‌نامه (sale.pdf). Coords are % of page from top-left. */
export const saleFieldMap: TemplateFieldMap = {
  contractType: "SALE",
  pageCount: 1,
  fields: [
    // Header registration
    {
      id: "contractNumber",
      start: { x: 72, y: 7.2, z: 1 },
      end: { x: 92, y: 9.2, z: 1 },
      align: "center",
    },

    // ماده ۱ — فروشنده
    {
      id: "firstParty.name",
      start: { x: 48, y: 14.5, z: 1 },
      end: { x: 78, y: 16.3, z: 1 },
      align: "center",
    },
    {
      id: "firstParty.fatherName",
      start: { x: 28, y: 14.5, z: 1 },
      end: { x: 42, y: 16.3, z: 1 },
      align: "center",
    },
    {
      id: "firstParty.identityNumber",
      start: { x: 12, y: 14.5, z: 1 },
      end: { x: 24, y: 16.3, z: 1 },
      align: "center",
    },
    {
      id: "firstParty.identityExportPlace",
      start: { x: 72, y: 16.8, z: 1 },
      end: { x: 88, y: 18.5, z: 1 },
      align: "center",
    },
    {
      id: "firstParty.nationalCode",
      start: { x: 48, y: 16.8, z: 1 },
      end: { x: 66, y: 18.5, z: 1 },
      align: "center",
    },
    {
      id: "firstParty.birthPlace",
      start: { x: 28, y: 16.8, z: 1 },
      end: { x: 42, y: 18.5, z: 1 },
      align: "center",
    },
    {
      id: "firstParty.address",
      start: { x: 18, y: 19.0, z: 1 },
      end: { x: 78, y: 20.8, z: 1 },
      align: "center",
    },
    {
      id: "firstParty.phone",
      start: { x: 12, y: 21.2, z: 1 },
      end: { x: 32, y: 22.8, z: 1 },
      align: "center",
    },

    // ماده ۱ — خریدار
    {
      id: "secondParty.name",
      start: { x: 48, y: 24.0, z: 1 },
      end: { x: 78, y: 25.8, z: 1 },
      align: "center",
    },
    {
      id: "secondParty.fatherName",
      start: { x: 28, y: 24.0, z: 1 },
      end: { x: 42, y: 25.8, z: 1 },
      align: "center",
    },
    {
      id: "secondParty.identityNumber",
      start: { x: 12, y: 24.0, z: 1 },
      end: { x: 24, y: 25.8, z: 1 },
      align: "center",
    },
    {
      id: "secondParty.nationalCode",
      start: { x: 48, y: 26.2, z: 1 },
      end: { x: 66, y: 28.0, z: 1 },
      align: "center",
    },
    {
      id: "secondParty.address",
      start: { x: 18, y: 28.4, z: 1 },
      end: { x: 78, y: 30.2, z: 1 },
      align: "center",
    },
    {
      id: "secondParty.phone",
      start: { x: 12, y: 30.6, z: 1 },
      end: { x: 32, y: 32.2, z: 1 },
      align: "center",
    },

    // ماده ۲ — مورد معامله
    {
      id: "property.title",
      start: { x: 35, y: 34.0, z: 1 },
      end: { x: 78, y: 35.8, z: 1 },
      align: "center",
    },
    {
      id: "property.areaSqm",
      start: { x: 18, y: 34.0, z: 1 },
      end: { x: 30, y: 35.8, z: 1 },
      align: "center",
    },
    {
      id: "property.cadastralNumber",
      start: { x: 55, y: 36.2, z: 1 },
      end: { x: 78, y: 38.0, z: 1 },
      align: "center",
    },
    {
      id: "property.address",
      start: { x: 18, y: 40.5, z: 1 },
      end: { x: 78, y: 42.5, z: 1 },
      align: "center",
    },
    {
      id: "property.postalCode",
      start: { x: 12, y: 43.0, z: 1 },
      end: { x: 28, y: 44.6, z: 1 },
      align: "center",
    },

    // ماده ۳ — ثمن
    {
      id: "sale.shareUnits",
      start: { x: 12, y: 46.5, z: 1 },
      end: { x: 22, y: 48.3, z: 1 },
      align: "center",
    },
    {
      id: "sale.totalInWords",
      start: { x: 35, y: 46.5, z: 1 },
      end: { x: 82, y: 48.5, z: 1 },
      align: "center",
    },
    {
      id: "sale.totalRials",
      start: { x: 12, y: 46.5, z: 1 },
      end: { x: 32, y: 48.5, z: 1 },
      align: "center",
    },
    {
      id: "sale.downPaymentRials",
      start: { x: 55, y: 49.0, z: 1 },
      end: { x: 78, y: 50.8, z: 1 },
      align: "center",
    },
    {
      id: "sale.downPaymentBank",
      start: { x: 25, y: 49.0, z: 1 },
      end: { x: 48, y: 50.8, z: 1 },
      align: "center",
    },
    {
      id: "sale.remainingRials",
      start: { x: 55, y: 51.2, z: 1 },
      end: { x: 78, y: 53.0, z: 1 },
      align: "center",
    },
    {
      id: "sale.remainingDueAt",
      start: { x: 25, y: 51.2, z: 1 },
      end: { x: 48, y: 53.0, z: 1 },
      align: "center",
    },

    // مواد ۴ و ۵
    {
      id: "sale.notaryOffice",
      start: { x: 40, y: 55.5, z: 1 },
      end: { x: 78, y: 57.3, z: 1 },
      align: "center",
    },
    {
      id: "sale.officialDeedDueAt",
      start: { x: 18, y: 55.5, z: 1 },
      end: { x: 35, y: 57.3, z: 1 },
      align: "center",
    },
    {
      id: "sale.deliveryDueAt",
      start: { x: 40, y: 58.0, z: 1 },
      end: { x: 62, y: 59.8, z: 1 },
      align: "center",
    },
    {
      id: "sale.delayPenaltyPerDayRials",
      start: { x: 18, y: 62.5, z: 1 },
      end: { x: 35, y: 64.3, z: 1 },
      align: "center",
    },

    // ماده ۹ — کمیسیون
    {
      id: "commissionAmount",
      start: { x: 55, y: 72.0, z: 1 },
      end: { x: 78, y: 73.8, z: 1 },
      align: "center",
    },
    {
      id: "taxAmount",
      start: { x: 25, y: 72.0, z: 1 },
      end: { x: 45, y: 73.8, z: 1 },
      align: "center",
    },

    // توضیحات
    {
      id: "sale.notes",
      start: { x: 12, y: 78.0, z: 1 },
      end: { x: 88, y: 84.0, z: 1 },
      align: "right",
    },

    // امضاها
    {
      id: "sign.firstParty",
      start: { x: 72, y: 90.0, z: 1 },
      end: { x: 92, y: 93.0, z: 1 },
      align: "center",
    },
    {
      id: "sign.secondParty",
      start: { x: 50, y: 90.0, z: 1 },
      end: { x: 70, y: 93.0, z: 1 },
      align: "center",
    },
    {
      id: "sign.witness1",
      start: { x: 28, y: 90.0, z: 1 },
      end: { x: 48, y: 93.0, z: 1 },
      align: "center",
    },
    {
      id: "sign.witness2",
      start: { x: 8, y: 90.0, z: 1 },
      end: { x: 26, y: 93.0, z: 1 },
      align: "center",
    },
  ],
};
