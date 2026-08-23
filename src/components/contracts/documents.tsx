"use client";

import type { ContractWizardState } from "@/lib/contracts/wizard";
import { partyDisplayName } from "@/lib/contracts/wizard";
import type { Party, Property } from "@/lib/api/types";

function Blank({ children }: { children: React.ReactNode }) {
  return (
    <span className="mx-0.5 inline-block min-w-16 border-b border-dotted border-foreground/70 px-1 font-medium">
      {children || "……"}
    </span>
  );
}

function PartyBlock({
  title,
  party,
}: {
  title: string;
  party: Party | null;
}) {
  return (
    <div className="rounded border border-foreground/20 p-3 text-sm leading-7">
      <p className="mb-2 font-bold">{title}</p>
      <p>
        نام: <Blank>{partyDisplayName(party)}</Blank>
        نام پدر: <Blank>{party?.fatherName}</Blank>
      </p>
      <p>
        کد ملی: <Blank>{party?.nationalCode}</Blank>
        شماره شناسنامه: <Blank>{party?.identityNumber}</Blank>
      </p>
      <p>
        محل صدور: <Blank>{party?.identityExportPlace}</Blank>
        محل تولد: <Blank>{party?.birthPlace}</Blank>
      </p>
      <p>
        تلفن: <Blank>{party?.phone}</Blank>
        نشانی:{" "}
        <Blank>
          {party?.address
            ? `${party.address.city}، ${party.address.province}${
                party.address.street ? `، ${party.address.street}` : ""
              }`
            : ""}
        </Blank>
      </p>
    </div>
  );
}

function PropertyBlock({ property }: { property: Property | null }) {
  const deed = (property?.deedInfo?.data ?? {}) as Record<string, unknown>;
  return (
    <div className="rounded border border-foreground/20 p-3 text-sm leading-7">
      <p className="mb-2 font-bold">ماده ۲ — مورد معامله</p>
      <p>
        عنوان: <Blank>{property?.title}</Blank>
        نوع: <Blank>{property?.propertyType}</Blank>
        مساحت: <Blank>{property?.areaSqm != null ? String(property.areaSqm) : ""}</Blank> مترمربع
      </p>
      <p>
        پلاک ثبتی: <Blank>{String(deed.cadastralNumber ?? "")}</Blank>
        بخش: <Blank>{String(deed.cadastralDistrict ?? "")}</Blank>
        کدپستی: <Blank>{String(deed.postalCode ?? property?.address?.postalCode ?? "")}</Blank>
      </p>
      <p>
        نشانی:{" "}
        <Blank>
          {property?.address
            ? `${property.address.city}، ${property.address.province}${
                property.address.street ? `، ${property.address.street}` : ""
              }`
            : ""}
        </Blank>
      </p>
    </div>
  );
}

export function SaleDocument({ state }: { state: ContractWizardState }) {
  const s = state.sale;
  return (
    <article
      dir="rtl"
      className="contract-doc mx-auto max-w-[210mm] bg-white p-6 text-[12px] text-black shadow-sm"
    >
      <header className="mb-4 border-b border-foreground/30 pb-3 text-center">
        <p className="text-xs">اتحادیه مشاورین املاک</p>
        <h1 className="text-2xl font-bold">مبایعه‌نامه</h1>
        <p className="mt-1 text-sm">
          شماره قرارداد: <Blank>{state.contractNumber}</Blank>
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        <PartyBlock title="ماده ۱ — فروشنده (طرف اول)" party={state.firstParty} />
        <PartyBlock title="ماده ۱ — خریدار (طرف دوم)" party={state.secondParty} />
      </div>

      <div className="mt-3">
        <PropertyBlock property={state.property} />
      </div>

      <div className="mt-3 rounded border border-foreground/20 p-3 text-sm leading-7">
        <p className="mb-2 font-bold">ماده ۳ — ثمن معامله</p>
        <p>
          مبلغ کل: <Blank>{s.totalRials}</Blank> ریال
          معادل: <Blank>{s.totalInWords}</Blank>
        </p>
        <p>
          بیعانه: <Blank>{s.downPaymentRials}</Blank> ریال
          نحوه پرداخت: <Blank>{s.downPaymentMethod}</Blank>
          بانک: <Blank>{s.downPaymentBank}</Blank>
        </p>
        <p>
          الباقی: <Blank>{s.remainingRials}</Blank> ریال
          موعد: <Blank>{s.remainingDueAt}</Blank>
        </p>
      </div>

      <div className="mt-3 rounded border border-foreground/20 p-3 text-sm leading-7">
        <p className="mb-2 font-bold">مواد ۴ و ۵ — تنظیم سند و تحویل</p>
        <p>
          دفترخانه: <Blank>{s.notaryOffice}</Blank>
          تاریخ انتقال سند: <Blank>{s.officialDeedDueAt}</Blank>
        </p>
        <p>
          تاریخ تحویل مورد معامله: <Blank>{s.deliveryDueAt}</Blank>
          وجه التزام روزانه: <Blank>{s.delayPenaltyPerDayRials}</Blank> ریال
        </p>
      </div>

      <div className="mt-3 rounded border border-foreground/20 p-3 text-sm leading-7">
        <p className="mb-2 font-bold">حق‌الزحمه مشاور</p>
        <p>
          کمیسیون: <Blank>{state.commissionAmount || state.commissionPercentage}</Blank>
          مالیات: <Blank>{state.taxAmount || state.taxPercentage}</Blank>
        </p>
      </div>

      {s.notes ? (
        <div className="mt-3 rounded border border-foreground/20 p-3 text-sm">
          <p className="font-bold">توضیحات</p>
          <p>{s.notes}</p>
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-2 gap-4 text-center text-sm md:grid-cols-4">
        <div>
          <p>امضای فروشنده</p>
          <p className="mt-8">{partyDisplayName(state.firstParty)}</p>
        </div>
        <div>
          <p>امضای خریدار</p>
          <p className="mt-8">{partyDisplayName(state.secondParty)}</p>
        </div>
        {(state.witnesses.length ? state.witnesses : [null, null])
          .slice(0, 2)
          .map((w, i) => (
            <div key={i}>
              <p>امضای شاهد {i + 1}</p>
              <p className="mt-8">{partyDisplayName(w)}</p>
            </div>
          ))}
      </div>
    </article>
  );
}

export function RentDocument({ state }: { state: ContractWizardState }) {
  const r = state.rent;
  return (
    <article
      dir="rtl"
      className="contract-doc mx-auto max-w-[210mm] bg-white p-6 text-[12px] text-black shadow-sm"
    >
      <header className="mb-4 border-b border-foreground/30 pb-3 text-center">
        <p className="text-xs">اتحادیه مشاورین املاک</p>
        <h1 className="text-2xl font-bold">اجاره‌نامه</h1>
        <p className="mt-1 text-sm">
          شماره قرارداد: <Blank>{state.contractNumber}</Blank>
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        <PartyBlock title="موجر (طرف اول)" party={state.firstParty} />
        <PartyBlock title="مستأجر (طرف دوم)" party={state.secondParty} />
      </div>

      <div className="mt-3">
        <PropertyBlock property={state.property} />
      </div>

      <div className="mt-3 rounded border border-foreground/20 p-3 text-sm leading-7">
        <p className="mb-2 font-bold">مدت و اجاره‌بها</p>
        <p>
          از تاریخ: <Blank>{r.startDate}</Blank>
          تا: <Blank>{r.endDate}</Blank>
          مدت (ماه): <Blank>{r.durationMonths}</Blank>
        </p>
        <p>
          اجاره کل دوره: <Blank>{r.totalRials}</Blank> ریال
          اجاره ماهانه: <Blank>{r.monthlyRials}</Blank> ریال
          (<Blank>{r.monthlyInWords}</Blank>)
        </p>
        <p>
          ودیعه / رهن: <Blank>{r.securityDepositRials}</Blank> ریال
          روز پرداخت: <Blank>{r.paymentDayOfMonth}</Blank>
        </p>
        <p>
          بانک: <Blank>{r.bankName}</Blank>
          شماره حساب: <Blank>{r.accountNumber}</Blank>
        </p>
        <p>
          وجه التزام روزانه: <Blank>{r.delayPenaltyPerDayRials}</Blank> ریال
        </p>
      </div>

      <div className="mt-3 rounded border border-foreground/20 p-3 text-sm leading-7">
        <p className="mb-2 font-bold">حق‌الزحمه مشاور</p>
        <p>
          کمیسیون: <Blank>{state.commissionAmount || state.commissionPercentage}</Blank>
          مالیات: <Blank>{state.taxAmount || state.taxPercentage}</Blank>
        </p>
      </div>

      {r.notes ? (
        <div className="mt-3 rounded border border-foreground/20 p-3 text-sm">
          <p className="font-bold">توضیحات</p>
          <p>{r.notes}</p>
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-2 gap-4 text-center text-sm md:grid-cols-4">
        <div>
          <p>امضای موجر</p>
          <p className="mt-8">{partyDisplayName(state.firstParty)}</p>
        </div>
        <div>
          <p>امضای مستأجر</p>
          <p className="mt-8">{partyDisplayName(state.secondParty)}</p>
        </div>
        {(state.witnesses.length ? state.witnesses : [null, null])
          .slice(0, 2)
          .map((w, i) => (
            <div key={i}>
              <p>امضای شاهد {i + 1}</p>
              <p className="mt-8">{partyDisplayName(w)}</p>
            </div>
          ))}
      </div>
    </article>
  );
}

export function GenericDocument({ state }: { state: ContractWizardState }) {
  const g = state.generic;
  return (
    <article
      dir="rtl"
      className="contract-doc mx-auto max-w-[210mm] bg-white p-6 text-[12px] text-black shadow-sm"
    >
      <header className="mb-4 border-b border-foreground/30 pb-3 text-center">
        <h1 className="text-2xl font-bold">{state.contractType}</h1>
        <p className="mt-1 text-sm">
          شماره: <Blank>{state.contractNumber}</Blank>
        </p>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        <PartyBlock title="طرف اول" party={state.firstParty} />
        <PartyBlock title="طرف دوم" party={state.secondParty} />
      </div>
      <div className="mt-3">
        <PropertyBlock property={state.property} />
      </div>
      <div className="mt-3 rounded border border-foreground/20 p-3 text-sm leading-7">
        <p>
          مبلغ کل: <Blank>{g.totalRials}</Blank>
          ماهانه: <Blank>{g.monthlyRials}</Blank>
          ودیعه: <Blank>{g.depositRials}</Blank>
        </p>
        <p>
          شروع: <Blank>{g.startDate}</Blank>
          پایان: <Blank>{g.endDate}</Blank>
        </p>
        <p>
          تحویل: <Blank>{g.deliveryDueAt}</Blank>
          سند: <Blank>{g.officialDeedDueAt}</Blank>
        </p>
        {g.notes ? <p className="mt-2">{g.notes}</p> : null}
      </div>
    </article>
  );
}
