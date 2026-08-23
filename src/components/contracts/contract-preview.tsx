"use client";

import type { ContractWizardState } from "@/lib/contracts/wizard";
import { partyDisplayName, templateBackground } from "@/lib/contracts/wizard";

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
  return (
    <div
      className={`absolute text-[10px] leading-none text-black ${className}`}
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

export function ContractPreview({
  state,
  mode,
  children,
}: {
  state: ContractWizardState;
  mode: "full" | "overlay" | "overlay-blank";
  children: React.ReactNode;
}) {
  const bg = templateBackground(state.contractType);

  if (mode === "full") {
    return <div className="contract-preview-full">{children}</div>;
  }

  return (
    <div
      className="contract-preview-overlay relative mx-auto aspect-[210/297] w-full max-w-[210mm] overflow-hidden bg-white shadow-sm"
      data-print-mode={mode}
    >
      {mode === "overlay" && bg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bg}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-fill"
        />
      ) : null}
      <div className="absolute inset-0">
        <OverlayFields state={state} />
      </div>
    </div>
  );
}
