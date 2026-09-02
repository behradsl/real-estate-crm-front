"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { printLayoutsApi } from "@/lib/api";
import type { ContractPrintLayout } from "@/lib/api/types";
import { useAuth } from "@/components/providers/auth-provider";
import type { ContractWizardState } from "@/lib/contracts/wizard";
import {
  boxCss,
  dynamicFontSizePx,
  getFieldMap,
  layoutFieldsToFieldBoxes,
  valuesFromWizardState,
  type FieldBox,
} from "@/lib/contracts/field-maps";
import {
  templatePdfUrl,
  type ContractPreviewMode,
} from "@/lib/contracts/templates";

function OverlayField({
  box,
  text,
  containerWidth,
  containerHeight,
}: {
  box: FieldBox;
  text: string;
  containerWidth: number;
  containerHeight: number;
}) {
  if (!text.trim()) return null;

  const { left, top, width, height } = boxCss(box);
  // Keep a tiny visible box so mis-entered equal start/end still show during calibration
  const widthPct = Math.max(width, 0.5);
  const heightPct = Math.max(height, 0.4);
  const boxWidthPx = (containerWidth * widthPct) / 100;
  const boxHeightPx = (containerHeight * heightPct) / 100;
  const fontSize = dynamicFontSizePx({
    text,
    boxWidthPx,
    boxHeightPx,
    fillRatio: 0.9,
  });

  const justify =
    box.align === "right"
      ? "flex-end"
      : box.align === "left"
        ? "flex-start"
        : "center";

  return (
    <div
      className="absolute flex items-center overflow-hidden px-[1%] text-black"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${widthPct}%`,
        height: `${heightPct}%`,
        justifyContent: justify,
        fontSize: `${fontSize}px`,
        lineHeight: 1.1,
      }}
      title={box.id}
    >
      <span className="block w-full truncate text-center" dir="rtl">
        {text}
      </span>
    </div>
  );
}

export function OverlayFields({
  state,
  page = 1,
  layout = null,
}: {
  state: ContractWizardState;
  page?: number;
  layout?: ContractPrintLayout | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const seedMap = getFieldMap(state.contractType);
  const allFields =
    layout != null && Object.keys(layout.fields ?? {}).length > 0
      ? layoutFieldsToFieldBoxes(
          layout.fields,
          layout.paperWidthMm,
          layout.paperHeightMm,
        )
      : seedMap.fields;

  const fields = allFields.filter((f) => Number(f.start.z) === page);
  const values = valuesFromWizardState(state);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 z-10"
      dir="rtl"
    >
      {size.width > 0
        ? fields.map((box) => (
            <OverlayField
              key={box.id}
              box={box}
              text={values[box.id] ?? ""}
              containerWidth={size.width}
              containerHeight={size.height}
            />
          ))
        : null}
    </div>
  );
}

function PdfPageCanvas({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      setLoading(true);
      setError(null);
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const pdf = await pdfjs.getDocument({ url }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({
          canvas,
          canvasContext: context,
          viewport,
        }).promise;
        if (!cancelled) setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "بارگذاری پیش‌نویس با خطا مواجه شد",
          );
          setLoading(false);
        }
      }
    }

    void render();
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div className="relative z-0 w-full">
      {loading ? (
        <div className="flex aspect-[210/297] items-center justify-center bg-muted/40 text-sm text-muted-foreground">
          در حال بارگذاری پیش‌نویس قرارداد…
        </div>
      ) : null}
      {error ? (
        <div className="flex aspect-[210/297] items-center justify-center p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      <canvas
        ref={canvasRef}
        className={`block h-auto w-full ${loading || error ? "hidden" : ""}`}
      />
    </div>
  );
}

export function ContractPreview({
  state,
  mode,
  organizationId,
  layout: layoutProp,
}: {
  state: ContractWizardState;
  mode: ContractPreviewMode;
  organizationId?: string | null;
  layout?: ContractPrintLayout | null;
}) {
  const { user } = useAuth();
  const orgId =
    organizationId ??
    state.property?.organizationId ??
    user?.organizationId ??
    null;
  const [loadedLayout, setLoadedLayout] = useState<ContractPrintLayout | null>(
    layoutProp ?? null,
  );

  useEffect(() => {
    if (layoutProp !== undefined) {
      setLoadedLayout(layoutProp);
      return;
    }
    if (!orgId) {
      setLoadedLayout(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const layout = await printLayoutsApi.get(orgId, state.contractType);
        if (!cancelled) setLoadedLayout(layout);
      } catch {
        if (!cancelled) {
          // 404 / forbidden / network → fall back to seed field maps
          setLoadedLayout(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orgId, state.contractType, layoutProp]);

  const pdfUrl = templatePdfUrl(state.contractType);
  const showPdf = mode === "full";

  return (
    <div
      className="contract-preview-overlay relative mx-auto w-full max-w-[210mm] overflow-hidden bg-white shadow-sm"
      data-print-mode={mode}
    >
      <div className="relative w-full">
        {showPdf && pdfUrl ? (
          <div className="contract-pdf-layer relative z-0">
            <PdfPageCanvas url={pdfUrl} />
          </div>
        ) : (
          <div className="aspect-[210/297] w-full bg-white" />
        )}
        <OverlayFields state={state} page={1} layout={loadedLayout} />
      </div>
      {!pdfUrl && showPdf ? (
        <p className="absolute inset-x-0 top-4 z-20 text-center text-sm text-muted-foreground">
          برای این نوع قرارداد پیش‌نویس چاپی تعریف نشده است.
        </p>
      ) : null}
    </div>
  );
}

export function printContract(mode: ContractPreviewMode) {
  window.document.documentElement.setAttribute("data-contract-print", mode);
  window.setTimeout(() => {
    window.print();
    window.document.documentElement.removeAttribute("data-contract-print");
  }, 80);
}
