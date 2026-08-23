"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { partiesApi, propertiesApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import type { Party, PartyType, Property, PropertyType } from "@/lib/api/types";
import { PROPERTY_TYPES } from "@/lib/examples";
import { partyDisplayName } from "@/lib/contracts/wizard";
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
        toast.error(error instanceof ApiError ? error.message : "Load failed"),
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
      toast.success("Property created");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Create failed");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-3 rounded-xl border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">Selected property</p>
          <p className="text-sm text-muted-foreground">
            {selected ? selected.title : "None selected"}
          </p>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button type="button" variant="outline">
              Select or create
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Property</SheetTitle>
              <SheetDescription>
                Pick an existing listing or create one inline.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                >
                  <span>{item.title}</span>
                  <span className="text-muted-foreground">{item.propertyType}</span>
                </button>
              ))}
            </div>
            <form className="mt-6 space-y-3 border-t pt-4" onSubmit={onCreate}>
              <p className="text-sm font-medium">Create new</p>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
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
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Province</Label>
                  <Input
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Area m²</Label>
                <Input
                  type="number"
                  value={areaSqm}
                  onChange={(e) => setAreaSqm(e.target.value)}
                />
              </div>
              <Button disabled={creating} type="submit">
                {creating ? "Creating…" : "Create & select"}
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
        toast.error(error instanceof ApiError ? error.message : "Load failed"),
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
      toast.success("Party created");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Create failed");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-3 rounded-xl border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            {partyDisplayName(selected)}
            {selected?.nationalCode ? ` — ${selected.nationalCode}` : ""}
          </p>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button type="button" variant="outline">
              Select or create
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>{label}</SheetTitle>
              <SheetDescription>
                Choose an existing party or create one here.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                >
                  <span>{partyDisplayName(item)}</span>
                  <span className="text-muted-foreground">{item.type}</span>
                </button>
              ))}
            </div>
            <form className="mt-6 space-y-3 border-t pt-4" onSubmit={onCreate}>
              <p className="text-sm font-medium">Create new</p>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={type}
                  onValueChange={(v) => setType(v as PartyType)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERSON">PERSON</SelectItem>
                    <SelectItem value="COMPANY">COMPANY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {type === "PERSON" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>First name</Label>
                      <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last name</Label>
                      <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Father name</Label>
                    <Input
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>National code</Label>
                    <Input
                      value={nationalCode}
                      onChange={(e) => setNationalCode(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label>Company name</Label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Province</Label>
                  <Input
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button disabled={creating} type="submit">
                {creating ? "Creating…" : "Create & select"}
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
    <Field label="Notes / توضیحات">
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}
