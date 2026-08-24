/**
 * Field boxes use percent-of-page coordinates (0–100) from the top-left.
 * z = page number (1-based). Templates today are single-page scans.
 */
export type Point3 = {
  x: number;
  y: number;
  z: number;
};

export type FieldBox = {
  id: string;
  /** Top-left / start of the blank */
  start: Point3;
  /** Bottom-right / end of the blank */
  end: Point3;
  /** Text alignment inside the box (Persian forms default to center) */
  align?: "center" | "right" | "left";
};

export type TemplateFieldMap = {
  contractType: string;
  pageCount: number;
  fields: FieldBox[];
};

export function boxCss(box: FieldBox) {
  const left = Math.min(box.start.x, box.end.x);
  const top = Math.min(box.start.y, box.end.y);
  const width = Math.abs(box.end.x - box.start.x);
  const height = Math.abs(box.end.y - box.start.y);
  return { left, top, width, height, page: box.start.z };
}

/**
 * Pick a font size so text fills ~90% of the box width (and fits height).
 */
export function dynamicFontSizePx(options: {
  text: string;
  boxWidthPx: number;
  boxHeightPx: number;
  fillRatio?: number;
  minPx?: number;
  maxPx?: number;
  charWidthFactor?: number;
}): number {
  const {
    text,
    boxWidthPx,
    boxHeightPx,
    fillRatio = 0.9,
    minPx = 5,
    maxPx = 16,
    // Persian glyphs are often wider than Latin; 0.62 is a practical average
    charWidthFactor = 0.62,
  } = options;

  const usableW = Math.max(boxWidthPx * fillRatio, 1);
  const usableH = Math.max(boxHeightPx * fillRatio, 1);
  const chars = Math.max(Array.from(text.trim() || " ").length, 1);
  const byWidth = usableW / (chars * charWidthFactor);
  const byHeight = usableH * 0.9;
  return Math.max(minPx, Math.min(maxPx, byWidth, byHeight));
}
