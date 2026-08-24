"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { partiesApi, propertiesApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import type { Party, PartyType, Property, PropertyType } from "@/lib/api/types";
import { PROPERTY_TYPES } from "@/lib/examples";
import { partyDisplayName } from "@/lib/contracts/wizard";
import { messages, partyTypeLabels, propertyTypeLabels } from "@/lib/labels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

function emptyToUndefined(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export function PropertyPicker({
  selected,
  onSelect,
}: {
  selected: Property | null;
  onSelect: (property: Property) => void;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Property[]>([]);
  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType>("APARTMENT");
  const [city, setCity] = useState("همدان");
  const [province, setProvince] = useState("همدان");
  const [areaSqm, setAreaSqm] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!open) return;
    void propertiesApi
      .list()
      .then(setItems)
      .catch((error) =>
        toast.error(error instanceof ApiError ? error.message : messages.loadFailed),
      );
  }, [open]);

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    setCreating(true);
    try {
      const created = await propertiesApi.create({
        title,
        propertyType,
        areaSqm: areaSqm ? Number(areaSqm) : undefined,
        address: { city, province },
      });
      onSelect(created);
      setOpen(false);
      toast.success("ملک ثبت شد");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : messages.createFailed);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-3 rounded-xl border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium leading-relaxed">ملک انتخاب‌شده</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {selected ? selected.title : messages.noneSelected}
          </p>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button type="button" variant="outline">
              {messages.selectOrCreate}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>انتخاب ملک</SheetTitle>
              <SheetDescription>
                از فهرست موجود انتخاب کنید یا ملک جدید ثبت کنید.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-2 px-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-start text-sm leading-relaxed hover:bg-muted"
                  onClick={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                >
                  <span>{item.title}</span>
                  <span className="text-muted-foreground">
                    {propertyTypeLabels[item.propertyType]}
                  </span>
                </button>
              ))}
            </div>
            <form className="mt-6 space-y-4 border-t px-4 pt-4 pb-6" onSubmit={onCreate}>
              <p className="text-sm font-medium leading-relaxed">ثبت ملک جدید</p>
              <div className="space-y-2">
                <Label>عنوان</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>نوع ملک</Label>
                <Select
                  value={propertyType}
                  onValueChange={(v) => setPropertyType(v as PropertyType)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {propertyTypeLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>شهر</Label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>استان</Label>
                  <Input
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>متراژ (متر مربع)</Label>
                <Input
                  type="number"
                  value={areaSqm}
                  onChange={(e) => setAreaSqm(e.target.value)}
                />
              </div>
              <Button disabled={creating} type="submit">
                {creating ? messages.creating : messages.createAndSelect}
              </Button>
            </form>
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
  const [items, setItems] = useState<Party[]>([]);
  const [type, setType] = useState<PartyType>("PERSON");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("همدان");
  const [province, setProvince] = useState("همدان");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!open) return;
    void partiesApi
      .list()
      .then(setItems)
      .catch((error) =>
        toast.error(error instanceof ApiError ? error.message : messages.loadFailed),
      );
  }, [open]);

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    setCreating(true);
    try {
      const created = await partiesApi.create({
        type,
        firstName: type === "PERSON" ? emptyToUndefined(firstName) : undefined,
        lastName: type === "PERSON" ? emptyToUndefined(lastName) : undefined,
        companyName:
          type === "COMPANY" ? emptyToUndefined(companyName) : undefined,
        nationalCode: emptyToUndefined(nationalCode),
        fatherName: emptyToUndefined(fatherName),
        phone: emptyToUndefined(phone),
        address: { city, province },
      });
      onSelect(created);
      setOpen(false);
      toast.success("طرف قرارداد ثبت شد");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : messages.createFailed);
    } finally {
      setCreating(false);
    }
  }

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
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button type="button" variant="outline">
              {messages.selectOrCreate}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>{label}</SheetTitle>
              <SheetDescription>
                از فهرست موجود انتخاب کنید یا طرف جدید ثبت کنید.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-2 px-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-start text-sm leading-relaxed hover:bg-muted"
                  onClick={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                >
                  <span>{partyDisplayName(item)}</span>
                  <span className="text-muted-foreground">
                    {partyTypeLabels[item.type]}
                  </span>
                </button>
              ))}
            </div>
            <form className="mt-6 space-y-4 border-t px-4 pt-4 pb-6" onSubmit={onCreate}>
              <p className="text-sm font-medium leading-relaxed">ثبت طرف جدید</p>
              <div className="space-y-2">
                <Label>نوع</Label>
                <Select
                  value={type}
                  onValueChange={(v) => setType(v as PartyType)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERSON">{partyTypeLabels.PERSON}</SelectItem>
                    <SelectItem value="COMPANY">{partyTypeLabels.COMPANY}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {type === "PERSON" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>نام</Label>
                      <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>نام خانوادگی</Label>
                      <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>نام پدر</Label>
                    <Input
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>کد ملی</Label>
                    <Input
                      value={nationalCode}
                      onChange={(e) => setNationalCode(e.target.value)}
                      dir="ltr"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label>نام شرکت</Label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>تلفن</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  dir="ltr"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>شهر</Label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>استان</Label>
                  <Input
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button disabled={creating} type="submit">
                {creating ? messages.creating : messages.createAndSelect}
              </Button>
            </form>
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
