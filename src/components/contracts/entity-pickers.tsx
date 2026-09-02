"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { partiesApi, propertiesApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import type { Party, Property } from "@/lib/api/types";
import { partyDisplayName } from "@/lib/contracts/wizard";
import { messages, partyTypeLabels, propertyTypeLabels } from "@/lib/labels";
import { PartyForm } from "@/components/parties/party-form";
import { PropertyForm } from "@/components/properties/property-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

function normalize(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function propertyMatches(item: Property, query: string) {
  if (!query) return true;
  const q = normalize(query);
  const haystack = [
    item.title,
    item.referenceCode,
    item.description,
    propertyTypeLabels[item.propertyType],
    item.address?.city,
    item.address?.province,
    item.address?.details,
    item.deedInfo?.cadastralNumber,
  ]
    .map(normalize)
    .join(" ");
  return haystack.includes(q);
}

function partyMatches(item: Party, query: string) {
  if (!query) return true;
  const q = normalize(query);
  const haystack = [
    partyDisplayName(item),
    item.firstName,
    item.lastName,
    item.companyName,
    item.nationalCode,
    item.economicCode,
    item.phone,
    item.fatherName,
    partyTypeLabels[item.type],
    item.address?.city,
    item.address?.province,
  ]
    .map(normalize)
    .join(" ");
  return haystack.includes(q);
}

export function PropertyPicker({
  selected,
  onSelect,
}: {
  selected: Property | null;
  onSelect: (property: Property) => void;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("select");
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    void propertiesApi
      .list()
      .then(setItems)
      .catch((error) =>
        toast.error(error instanceof ApiError ? error.message : messages.loadFailed),
      )
      .finally(() => setLoading(false));
  }, [open]);

  const filtered = useMemo(
    () => items.filter((item) => propertyMatches(item, search)),
    [items, search],
  );

  return (
    <div className="space-y-3 rounded-xl border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium leading-relaxed">ملک انتخاب‌شده</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {selected ? selected.title : messages.noneSelected}
          </p>
        </div>
        <Sheet
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (next) {
              setTab("select");
              setSearch("");
              setFormKey((k) => k + 1);
            }
          }}
        >
          <SheetTrigger asChild>
            <Button type="button" variant="outline">
              {messages.selectOrCreate}
            </Button>
          </SheetTrigger>
          <SheetContent className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
            <SheetHeader className="border-b px-4 py-4 text-start">
              <SheetTitle>انتخاب یا ثبت ملک</SheetTitle>
              <SheetDescription>
                جستجو در املاک موجود، یا ثبت ملک با تمام مشخصات.
              </SheetDescription>
            </SheetHeader>
            <Tabs
              value={tab}
              onValueChange={setTab}
              className="flex min-h-0 flex-1 flex-col px-4 pb-4"
            >
              <TabsList className="mt-3 w-full">
                <TabsTrigger value="select" className="flex-1">
                  انتخاب از موجود
                </TabsTrigger>
                <TabsTrigger value="create" className="flex-1">
                  ثبت جدید
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="select"
                className="mt-4 flex min-h-0 flex-1 flex-col gap-3 overflow-hidden"
              >
                <div className="space-y-2">
                  <Label htmlFor="property-search">جستجو</Label>
                  <Input
                    id="property-search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="عنوان، کد ارجاع، شهر، پلاک ثبتی…"
                  />
                </div>
                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pb-2">
                  {loading ? (
                    <p className="text-sm text-muted-foreground">{messages.loading}</p>
                  ) : filtered.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      موردی یافت نشد. می‌توانید از تب «ثبت جدید» استفاده کنید.
                    </p>
                  ) : (
                    filtered.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="flex w-full flex-col gap-1 rounded-lg border px-3 py-2.5 text-start text-sm leading-relaxed hover:bg-muted"
                        onClick={() => {
                          onSelect(item);
                          setOpen(false);
                        }}
                      >
                        <span className="font-medium">{item.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {propertyTypeLabels[item.propertyType]}
                          {item.referenceCode ? ` · ${item.referenceCode}` : ""}
                          {item.address
                            ? ` · ${item.address.city}، ${item.address.province}`
                            : ""}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent
                value="create"
                className="mt-4 min-h-0 flex-1 overflow-y-auto pb-4"
              >
                <PropertyForm
                  key={formKey}
                  seedExamples={false}
                  submitLabel={messages.createAndSelect}
                  submittingLabel={messages.creating}
                  onSubmit={async (payload) => {
                    try {
                      const created = await propertiesApi.create(payload);
                      onSelect(created);
                      setOpen(false);
                      toast.success("ملک ثبت و انتخاب شد");
                    } catch (error) {
                      toast.error(
                        error instanceof ApiError
                          ? error.message
                          : messages.createFailed,
                      );
                    }
                  }}
                />
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export function PartyPicker({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: Party | null;
  onSelect: (party: Party) => void;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("select");
  const [items, setItems] = useState<Party[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    void partiesApi
      .list()
      .then(setItems)
      .catch((error) =>
        toast.error(error instanceof ApiError ? error.message : messages.loadFailed),
      )
      .finally(() => setLoading(false));
  }, [open]);

  const filtered = useMemo(
    () => items.filter((item) => partyMatches(item, search)),
    [items, search],
  );

  return (
    <div className="space-y-3 rounded-xl border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium leading-relaxed">{label}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {partyDisplayName(selected)}
            {selected?.nationalCode ? ` — ${selected.nationalCode}` : ""}
          </p>
        </div>
        <Sheet
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (next) {
              setTab("select");
              setSearch("");
              setFormKey((k) => k + 1);
            }
          }}
        >
          <SheetTrigger asChild>
            <Button type="button" variant="outline">
              {messages.selectOrCreate}
            </Button>
          </SheetTrigger>
          <SheetContent className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
            <SheetHeader className="border-b px-4 py-4 text-start">
              <SheetTitle>{label}</SheetTitle>
              <SheetDescription>
                جستجو در طرفین موجود، یا ثبت طرف جدید با تمام مشخصات.
              </SheetDescription>
            </SheetHeader>
            <Tabs
              value={tab}
              onValueChange={setTab}
              className="flex min-h-0 flex-1 flex-col px-4 pb-4"
            >
              <TabsList className="mt-3 w-full">
                <TabsTrigger value="select" className="flex-1">
                  انتخاب از موجود
                </TabsTrigger>
                <TabsTrigger value="create" className="flex-1">
                  ثبت جدید
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="select"
                className="mt-4 flex min-h-0 flex-1 flex-col gap-3 overflow-hidden"
              >
                <div className="space-y-2">
                  <Label htmlFor={`party-search-${label}`}>جستجو</Label>
                  <Input
                    id={`party-search-${label}`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="نام، کد ملی، تلفن، شرکت…"
                  />
                </div>
                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pb-2">
                  {loading ? (
                    <p className="text-sm text-muted-foreground">{messages.loading}</p>
                  ) : filtered.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      موردی یافت نشد. می‌توانید از تب «ثبت جدید» استفاده کنید.
                    </p>
                  ) : (
                    filtered.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="flex w-full flex-col gap-1 rounded-lg border px-3 py-2.5 text-start text-sm leading-relaxed hover:bg-muted"
                        onClick={() => {
                          onSelect(item);
                          setOpen(false);
                        }}
                      >
                        <span className="font-medium">{partyDisplayName(item)}</span>
                        <span className="text-xs text-muted-foreground">
                          {partyTypeLabels[item.type]}
                          {item.nationalCode ? ` · ${item.nationalCode}` : ""}
                          {item.phone ? ` · ${item.phone}` : ""}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent
                value="create"
                className="mt-4 min-h-0 flex-1 overflow-y-auto pb-4"
              >
                <PartyForm
                  key={formKey}
                  seedExamples={false}
                  submitLabel={messages.createAndSelect}
                  submittingLabel={messages.creating}
                  onSubmit={async (payload) => {
                    try {
                      const created = await partiesApi.create(payload);
                      onSelect(created);
                      setOpen(false);
                      toast.success("طرف قرارداد ثبت و انتخاب شد");
                    } catch (error) {
                      toast.error(
                        error instanceof ApiError
                          ? error.message
                          : messages.createFailed,
                      );
                    }
                  }}
                />
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function NotesField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label="توضیحات">
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}
