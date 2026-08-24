"use client";

import { useEffect, useRef, useState } from "react";
import type { ContractWizardState } from "@/lib/contracts/wizard";
import { partyDisplayName } from "@/lib/contracts/wizard";
import {
  templatePdfUrl,
  type ContractPreviewMode,
} from "@/lib/contracts/templates";

/**
 * Absolute % positions approximate the union form blanks.
 * Calibrate against physical printouts as needed.
 */
function Field({
  top,
  left,
  width,
  children,
  className = "",
}: {
  top: number;
  left: number;
  width?: number;
  children: React.ReactNode;
  className?: string;
}) {
  if (children == null || children === "") return null;
  return (
    <div
      className={`absolute text-[10px] leading-tight text-black ${className}`}
      style={{
        top: `${top}%`,
        left: `${left}%`,
        width: width ? `${width}%` : undefined,
      }}
    >
      {children}
    </div>
  );
}

export function OverlayFields({ state }: { state: ContractWizardState }) {
  if (state.contractType === "SALE") {
    const s = state.sale;
    return (
      <>
        <Field top={8} left={8} width={20}>
          {state.contractNumber}
        </Field>
        <Field top={18} left={52} width={40}>
          {partyDisplayName(state.firstParty)}
        </Field>
        <Field top={21} left={52} width={20}>
          {state.firstParty?.fatherName}
        </Field>
        <Field top={21} left={72} width={20}>
          {state.firstParty?.nationalCode}
        </Field>
        <Field top={18} left={8} width={40}>
          {partyDisplayName(state.secondParty)}
        </Field>
        <Field top={21} left={8} width={20}>
          {state.secondParty?.fatherName}
        </Field>
        <Field top={21} left={28} width={20}>
          {state.secondParty?.nationalCode}
        </Field>
        <Field top={36} left={20} width={60}>
          {state.property?.title}
        </Field>
        <Field top={39} left={70} width={15}>
          {state.property?.areaSqm}
        </Field>
        <Field top={48} left={55} width={30}>
          {s.totalRials}
        </Field>
        <Field top={51} left={40} width={40}>
          {s.totalInWords}
        </Field>
        <Field top={55} left={60} width={20}>
          {s.downPaymentRials}
        </Field>
        <Field top={58} left={55} width={25}>
          {s.remainingRials}
        </Field>
        <Field top={64} left={45} width={35}>
          {s.notaryOffice}
        </Field>
        <Field top={67} left={55} width={20}>
          {s.officialDeedDueAt}
        </Field>
        <Field top={71} left={55} width={20}>
          {s.deliveryDueAt}
        </Field>
      </>
    );
  }

  if (state.contractType === "RENT") {
    const r = state.rent;
    return (
      <>
        <Field top={8} left={8} width={20}>
          {state.contractNumber}
        </Field>
        <Field top={18} left={52} width={40}>
          {partyDisplayName(state.firstParty)}
        </Field>
        <Field top={18} left={8} width={40}>
          {partyDisplayName(state.secondParty)}
        </Field>
        <Field top={36} left={20} width={60}>
          {state.property?.title}
        </Field>
        <Field top={46} left={55} width={20}>
          {r.startDate}
        </Field>
        <Field top={46} left={25} width={20}>
          {r.endDate}
        </Field>
        <Field top={52} left={55} width={25}>
          {r.monthlyRials}
        </Field>
        <Field top={55} left={55} width={25}>
          {r.securityDepositRials}
        </Field>
        <Field top={58} left={55} width={25}>
          {r.bankName}
        </Field>
      </>
    );
  }

  return (
    <>
      <Field top={10} left={10} width={30}>
        {state.contractNumber}
      </Field>
      <Field top={20} left={50} width={40}>
        {partyDisplayName(state.firstParty)}
      </Field>
      <Field top={20} left={10} width={40}>
        {partyDisplayName(state.secondParty)}
      </Field>
      <Field top={40} left={20} width={60}>
        {state.property?.title}
      </Field>
    </>
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
          setError(err instanceof Error ? err.message : "Failed to load PDF");
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
    <div className="relative w-full">
      {loading ? (
        <div className="flex aspect-[210/297] items-center justify-center text-sm text-muted-foreground">
          Loading PDF…
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
}: {
  state: ContractWizardState;
  mode: ContractPreviewMode;
}) {
  const pdfUrl = templatePdfUrl(state.contractType);
  const showPdf = mode === "full";

  return (
    <div
      className="contract-preview-overlay relative mx-auto w-full max-w-[210mm] overflow-hidden bg-white shadow-sm"
      data-print-mode={mode}
    >
      {showPdf && pdfUrl ? (
        <div className="contract-pdf-layer">
          <PdfPageCanvas url={pdfUrl} />
        </div>
      ) : (
        <div className="aspect-[210/297] w-full bg-white" />
      )}
      <div className="pointer-events-none absolute inset-0" dir="rtl">
        <OverlayFields state={state} />
      </div>
      {!pdfUrl && showPdf ? (
        <p className="absolute inset-x-0 top-4 text-center text-sm text-muted-foreground">
          No PDF template for this contract type.
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
