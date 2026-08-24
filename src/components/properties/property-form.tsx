"use client";

import { FormEvent, useState } from "react";
import type {
  CreatePropertyInput,
  OtherFacility,
  Property,
  PropertyType,
} from "@/lib/api/types";
import { deedInfoDefaults, otherFacilitiesExample, PROPERTY_TYPES } from "@/lib/examples";
import { messages, propertyTypeLabels } from "@/lib/labels";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function emptyToUndefined(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function str(value: string | number | null | undefined) {
  return value == null ? "" : String(value);
}

function BoolField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm leading-relaxed">
      <input
        type="checkbox"
        className="size-4 accent-primary"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

export function PropertyForm({
  initial,
  submitLabel,
  submittingLabel,
  onSubmit,
}: {
  initial?: Property | null;
  submitLabel: string;
  submittingLabel?: string;
  onSubmit: (payload: CreatePropertyInput) => Promise<void>;
}) {
  const isEdit = Boolean(initial);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [propertyType, setPropertyType] = useState<PropertyType>(
    initial?.propertyType ?? "APARTMENT",
  );
  const [referenceCode, setReferenceCode] = useState(initial?.referenceCode ?? "");
  const [areaSqm, setAreaSqm] = useState(str(initial?.areaSqm ?? (isEdit ? "" : "120.5")));
  const [floor, setFloor] = useState(str(initial?.floor ?? (isEdit ? "" : "3")));
  const [totalFloors, setTotalFloors] = useState(
    str(initial?.totalFloors ?? (isEdit ? "" : "5")),
  );
  const [yearBuilt, setYearBuilt] = useState(
    str(initial?.yearBuilt ?? (isEdit ? "" : "2018")),
  );
  const [bedrooms, setBedrooms] = useState(
    str(initial?.bedrooms ?? (isEdit ? "" : "3")),
  );
  const [bathrooms, setBathrooms] = useState(
    str(initial?.bathrooms ?? (isEdit ? "" : "2")),
  );
  const [city, setCity] = useState(initial?.address?.city ?? (isEdit ? "" : "تهران"));
  const [province, setProvince] = useState(
    initial?.address?.province ?? (isEdit ? "" : "تهران"),
  );
  const [details, setDetails] = useState(
    initial?.address?.details ?? (isEdit ? "" : "ونک"),
  );
  const [plaque, setPlaque] = useState(initial?.address?.plaque ?? "");
  const [postalCode, setPostalCode] = useState(initial?.address?.postalCode ?? "");

  const [water, setWater] = useState(initial?.water ?? true);
  const [electricity, setElectricity] = useState(initial?.electricity ?? true);
  const [gas, setGas] = useState(initial?.gas ?? true);
  const [telephone, setTelephone] = useState(initial?.telephone ?? false);
  const [parking, setParking] = useState(initial?.parking ?? true);
  const [parkingCount, setParkingCount] = useState(
    str(initial?.parkingCount ?? initial?.parkingSpots ?? (isEdit ? "" : "1")),
  );
  const [storage, setStorage] = useState(initial?.storage ?? true);
  const [storageCount, setStorageCount] = useState(
    str(initial?.storageCount ?? (isEdit ? "" : "1")),
  );
  const [storageArea, setStorageArea] = useState(
    str(initial?.storageArea ?? (isEdit ? "" : "15")),
  );
  const [elevator, setElevator] = useState(initial?.elevator ?? true);
  const [otherFacilities, setOtherFacilities] = useState<OtherFacility[]>(
    initial?.otherFacilities?.length
      ? initial.otherFacilities
      : isEdit
        ? []
        : otherFacilitiesExample,
  );

  const [deed, setDeed] = useState({
    cadastralNumber: initial?.deedInfo?.cadastralNumber ?? deedInfoDefaults.cadastralNumber,
    subParcelNumber: initial?.deedInfo?.subParcelNumber ?? deedInfoDefaults.subParcelNumber,
    mainParcelNumber:
      initial?.deedInfo?.mainParcelNumber ?? deedInfoDefaults.mainParcelNumber,
    plotNumber: initial?.deedInfo?.plotNumber ?? deedInfoDefaults.plotNumber,
    cadastralDistrict:
      initial?.deedInfo?.cadastralDistrict ?? deedInfoDefaults.cadastralDistrict,
    registrationArea:
      initial?.deedInfo?.registrationArea ?? deedInfoDefaults.registrationArea,
    areaSqm: str(initial?.deedInfo?.areaSqm ?? deedInfoDefaults.areaSqm),
    postalCode: initial?.deedInfo?.postalCode ?? deedInfoDefaults.postalCode,
  });

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        title,
        description: emptyToUndefined(description),
        propertyType,
        referenceCode: emptyToUndefined(referenceCode),
        areaSqm: areaSqm ? Number(areaSqm) : undefined,
        floor: floor ? Number(floor) : undefined,
        totalFloors: totalFloors ? Number(totalFloors) : undefined,
        yearBuilt: yearBuilt ? Number(yearBuilt) : undefined,
        bedrooms: bedrooms ? Number(bedrooms) : undefined,
        bathrooms: bathrooms ? Number(bathrooms) : undefined,
        parkingSpots: parkingCount ? Number(parkingCount) : undefined,
        address: {
          city,
          province,
          details: emptyToUndefined(details),
          plaque: emptyToUndefined(plaque),
          postalCode: emptyToUndefined(postalCode),
        },
        water,
        electricity,
        gas,
        telephone,
        parking,
        parkingCount: parkingCount ? Number(parkingCount) : undefined,
        storage,
        storageCount: storageCount ? Number(storageCount) : undefined,
        storageArea: storageArea ? Number(storageArea) : undefined,
        elevator,
        otherFacilities: otherFacilities.filter((f) => f.name.trim()),
        deedInfo: {
          cadastralNumber: emptyToUndefined(deed.cadastralNumber),
          subParcelNumber: emptyToUndefined(deed.subParcelNumber),
          mainParcelNumber: emptyToUndefined(deed.mainParcelNumber),
          plotNumber: emptyToUndefined(deed.plotNumber),
          cadastralDistrict: emptyToUndefined(deed.cadastralDistrict),
          registrationArea: emptyToUndefined(deed.registrationArea),
          areaSqm: deed.areaSqm ? Number(deed.areaSqm) : undefined,
          postalCode: emptyToUndefined(deed.postalCode),
        },
      });
    } finally {
      setSubmitting(false);
    }
  }

  function updateOther(index: number, patch: Partial<OtherFacility>) {
    setOtherFacilities((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  const specFields = [
    ["متراژ (متر مربع)", areaSqm, setAreaSqm],
    ["طبقه", floor, setFloor],
    ["تعداد طبقات", totalFloors, setTotalFloors],
    ["سال ساخت", yearBuilt, setYearBuilt],
    ["تعداد خواب", bedrooms, setBedrooms],
    ["تعداد سرویس", bathrooms, setBathrooms],
  ] as const;

  const deedFields = [
    ["شماره پلاک ثبتی", "cadastralNumber"],
    ["قطعه فرعی", "subParcelNumber"],
    ["قطعه اصلی", "mainParcelNumber"],
    ["شماره قطعه", "plotNumber"],
    ["بخش ثبتی", "cadastralDistrict"],
    ["حوزه ثبتی", "registrationArea"],
    ["کد پستی سند", "postalCode"],
  ] as const;

  return (
    <form className="space-y-5" onSubmit={(e) => void handleSubmit(e)}>
      <Card>
        <CardHeader>
          <CardTitle>اطلاعات پایه</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">عنوان ملک</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً آپارتمان ۱۳۰ متری ونک"
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">توضیحات</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="موقعیت، نورگیری، بازسازی و نکات مهم فایل"
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
          <div className="space-y-2">
            <Label htmlFor="ref">کد ارجاع</Label>
            <Input
              id="ref"
              value={referenceCode}
              onChange={(e) => setReferenceCode(e.target.value)}
              dir="ltr"
            />
          </div>
          {specFields.map(([label, value, setter]) => (
            <div className="space-y-2" key={label}>
              <Label>{label}</Label>
              <Input
                type="number"
                value={value}
                onChange={(e) => setter(e.target.value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>نشانی</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
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
          <div className="space-y-2">
            <Label>جزئیات نشانی</Label>
            <Input
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="محله، خیابان، کوچه"
            />
          </div>
          <div className="space-y-2">
            <Label>پلاک</Label>
            <Input value={plaque} onChange={(e) => setPlaque(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>کد پستی</Label>
            <Input
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              dir="ltr"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>امکانات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <BoolField label="آب" checked={water} onChange={setWater} />
            <BoolField label="برق" checked={electricity} onChange={setElectricity} />
            <BoolField label="گاز" checked={gas} onChange={setGas} />
            <BoolField label="تلفن" checked={telephone} onChange={setTelephone} />
            <BoolField label="پارکینگ" checked={parking} onChange={setParking} />
            <BoolField label="انباری" checked={storage} onChange={setStorage} />
            <BoolField label="آسانسور" checked={elevator} onChange={setElevator} />
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <Label>تعداد پارکینگ</Label>
              <Input
                type="number"
                value={parkingCount}
                onChange={(e) => setParkingCount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>تعداد انباری</Label>
              <Input
                type="number"
                value={storageCount}
                onChange={(e) => setStorageCount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>متراژ انباری (متر مربع)</Label>
              <Input
                type="number"
                value={storageArea}
                onChange={(e) => setStorageArea(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>امکانات تکمیلی</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setOtherFacilities((prev) => [...prev, { name: "", kind: "" }])
            }
          >
            {messages.add}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {otherFacilities.map((item, index) => (
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]" key={index}>
              <div className="space-y-2">
                <Label>عنوان</Label>
                <Input
                  value={item.name}
                  onChange={(e) => updateOther(index, { name: e.target.value })}
                  placeholder="گرمایش"
                />
              </div>
              <div className="space-y-2">
                <Label>نوع / مدل</Label>
                <Input
                  value={item.kind}
                  onChange={(e) => updateOther(index, { kind: e.target.value })}
                  placeholder="گرمایش از کف"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setOtherFacilities((prev) =>
                      prev.filter((_, i) => i !== index),
                    )
                  }
                >
                  {messages.remove}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>مشخصات سند</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          {deedFields.map(([label, key]) => (
            <div className="space-y-2" key={key}>
              <Label>{label}</Label>
              <Input
                value={deed[key]}
                onChange={(e) =>
                  setDeed((prev) => ({ ...prev, [key]: e.target.value }))
                }
              />
            </div>
          ))}
          <div className="space-y-2">
            <Label>متراژ سند (متر مربع)</Label>
            <Input
              type="number"
              value={deed.areaSqm}
              onChange={(e) =>
                setDeed((prev) => ({ ...prev, areaSqm: e.target.value }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Button disabled={submitting} type="submit">
        {submitting ? (submittingLabel ?? messages.saving) : submitLabel}
      </Button>
    </form>
  );
}
