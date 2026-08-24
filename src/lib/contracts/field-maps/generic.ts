import type { TemplateFieldMap } from "./types";

/** Shared sparse map for other single-page templates until fully calibrated. */
function genericMap(contractType: string): TemplateFieldMap {
  return {
    contractType,
    pageCount: 1,
    fields: [
      {
        id: "contractNumber",
        start: { x: 70, y: 7, z: 1 },
        end: { x: 90, y: 9.5, z: 1 },
        align: "center",
      },
      {
        id: "firstParty.name",
        start: { x: 48, y: 16, z: 1 },
        end: { x: 80, y: 18.5, z: 1 },
        align: "center",
      },
      {
        id: "secondParty.name",
        start: { x: 48, y: 24, z: 1 },
        end: { x: 80, y: 26.5, z: 1 },
        align: "center",
      },
      {
        id: "property.title",
        start: { x: 30, y: 34, z: 1 },
        end: { x: 80, y: 37, z: 1 },
        align: "center",
      },
      {
        id: "generic.shareUnits",
        start: { x: 12, y: 40, z: 1 },
        end: { x: 22, y: 42.5, z: 1 },
        align: "center",
      },
      {
        id: "generic.totalRials",
        start: { x: 50, y: 46, z: 1 },
        end: { x: 78, y: 48.5, z: 1 },
        align: "center",
      },
      {
        id: "generic.monthlyRials",
        start: { x: 50, y: 49, z: 1 },
        end: { x: 78, y: 51.5, z: 1 },
        align: "center",
      },
      {
        id: "generic.depositRials",
        start: { x: 50, y: 52, z: 1 },
        end: { x: 78, y: 54.5, z: 1 },
        align: "center",
      },
      {
        id: "sign.firstParty",
        start: { x: 70, y: 90, z: 1 },
        end: { x: 92, y: 93, z: 1 },
        align: "center",
      },
      {
        id: "sign.secondParty",
        start: { x: 48, y: 90, z: 1 },
        end: { x: 68, y: 93, z: 1 },
        align: "center",
      },
    ],
  };
}

export const goodwillFieldMap = genericMap("GOODWILL");
export const preSaleFieldMap = genericMap("PRE_SALE");
export const mutualRescissionFieldMap = genericMap("MUTUAL_RESCISSION");
export const constructionJvFieldMap = genericMap("CONSTRUCTION_JOINT_VENTURE");
