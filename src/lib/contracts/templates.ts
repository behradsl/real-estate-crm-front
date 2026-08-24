import type { ContractType } from "@/lib/api/types";

export type ContractPreviewMode = "full" | "print-only";

/** Public PDF templates for each contract type */
export function templatePdfUrl(type: ContractType): string | null {
  switch (type) {
    case "SALE":
      return "/contracts/sale.pdf";
    case "RENT":
      return "/contracts/rent.pdf";
    case "GOODWILL":
      return "/contracts/goodwill.pdf";
    case "PRE_SALE":
      return "/contracts/presale.pdf";
    case "MUTUAL_RESCISSION":
      return "/contracts/mutual-rescission.pdf";
    case "CONSTRUCTION_JOINT_VENTURE":
      return "/contracts/construction-jv.pdf";
    default:
      return null;
  }
}
