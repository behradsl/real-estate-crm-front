"use client";

import { FormEvent, useState } from "react";
import type {
  CreatePropertyInput,
  OtherFacility,
  Property,
  PropertyType,
} from "@/lib/api/types";
import {
  ALL_PROPERTY_FORM_FIELDS,
  showPropertyField,
  type PropertyFormField,
} from "@/lib/contracts/contract-entity-fields";
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
  seedExamples = true,
  fields,
  onSubmit,
}: {
  initial?: Property | null;
  submitLabel: string;
  submittingLabel?: string;
  /** Prefill demo values on create (disable in pickers). */
  seedExamples?: boolean;
  /** When omitted, show the full CRM union of fields. */
  fields?: readonly PropertyFormField[];
  onSubmit: (payload: CreatePropertyInput) => Promise<void>;
}) {
  const visible = fields ?? ALL_PROPERTY_FORM_FIELDS;
  const show = (key: PropertyFormField) => showPropertyField(visible, key);
  /** Other facilities are CRM-only; hide when contract-type field filter is set. */
  const showOtherFacilities = fields == null;

  const isEdit = Boolean(initial);
  const useSeed = !isEdit && seedExamples;
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [propertyType, setPropertyType] = useState<PropertyType>(
    initial?.propertyType ?? "APARTMENT",
  );
  const [referenceCode, setReferenceCode] = useState(initial?.referenceCode ?? "");
  const [areaSqm, setAreaSqm] = useState(str(initial?.areaSqm ?? (useSeed ? "120.5" : "")));
  const [floor, setFloor] = useState(str(initial?.floor ?? (useSeed ? "3" : "")));
  const [totalFloors, setTotalFloors] = useState(
    str(initial?.totalFloors ?? (useSeed ? "5" : "")),
  );
  const [yearBuilt, setYearBuilt] = useState(
    str(initial?.yearBuilt ?? (useSeed ? "2018" : "")),
  );
  const [bedrooms, setBedrooms] = useState(
    str(initial?.bedrooms ?? (useSeed ? "3" : "")),
  );
  const [bathrooms, setBathrooms] = useState(
    str(initial?.bathrooms ?? (useSeed ? "2" : "")),
  );
  const [city, setCity] = useState(initial?.address?.city ?? (useSeed ? "تهران" : ""));
  const [province, setProvince] = useState(
    initial?.address?.province ?? (useSeed ? "تهران" : ""),
  );
  const [details, setDetails] = useState(
    initial?.address?.details ?? (useSeed ? "ونک" : ""),
  );
  const [plaque, setPlaque] = useState(initial?.address?.plaque ?? "");
  const [postalCode, setPostalCode] = useState(initial?.address?.postalCode ?? "");

  const [water, setWater] = useState(initial?.water ?? true);
  const [electricity, setElectricity] = useState(initial?.electricity ?? true);
  const [gas, setGas] = useState(initial?.gas ?? true);
  const [telephone, setTelephone] = useState(initial?.telephone ?? false);
  const [parking, setParking] = useState(initial?.parking ?? true);
  const [parkingCount, setParkingCount] = useState(
    str(initial?.parkingCount ?? initial?.parkingSpots ?? (useSeed ? "1" : "")),
  );
  const [storage, setStorage] = useState(initial?.storage ?? true);
  const [storageCount, setStorageCount] = useState(
    str(initial?.storageCount ?? (useSeed ? "1" : "")),
  );
  const [storageArea, setStorageArea] = useState(
    str(initial?.storageArea ?? (useSeed ? "15" : "")),
  );
  const [elevator, setElevator] = useState(initial?.elevator ?? true);
  const [otherFacilities, setOtherFacilities] = useState<OtherFacility[]>(
    initial?.otherFacilities?.length
      ? initial.otherFacilities
      : useSeed
        ? otherFacilitiesExample
        : [],
  );

  const [deed, setDeed] = useState({
    cadastralNumber:
      initial?.deedInfo?.cadastralNumber ??
      (useSeed ? deedInfoDefaults.cadastralNumber : ""),
    subParcelNumber:
      initial?.deedInfo?.subParcelNumber ??
      (useSeed ? deedInfoDefaults.subParcelNumber : ""),
    mainParcelNumber:
      initial?.deedInfo?.mainParcelNumber ??
      (useSeed ? deedInfoDefaults.mainParcelNumber : ""),
    plotNumber:
      initial?.deedInfo?.plotNumber ?? (useSeed ? deedInfoDefaults.plotNumber : ""),
    cadastralDistrict:
      initial?.deedInfo?.cadastralDistrict ??
      (useSeed ? deedInfoDefaults.cadastralDistrict : ""),
    registrationArea:
      initial?.deedInfo?.registrationArea ??
      (useSeed ? deedInfoDefaults.registrationArea : ""),
    areaSqm: str(
      initial?.deedInfo?.areaSqm ?? (useSeed ? deedInfoDefaults.areaSqm : ""),
    ),
    postalCode:
      initial?.deedInfo?.postalCode ?? (useSeed ? deedInfoDefaults.postalCode : ""),
    deedSerialNumber:
      initial?.deedInfo?.deedSerialNumber ??
      (useSeed ? deedInfoDefaults.deedSerialNumber : ""),
  });

  const addressVisible =
    show("addressCity") ||
    show("addressProvince") ||
    show("addressDetails") ||
    show("addressPlaque") ||
    show("addressPostalCode");

  const facilitiesVisible =
    show("water") ||
    show("electricity") ||
    show("gas") ||
    show("telephone") ||
    show("parking") ||
    show("parkingCount") ||
    show("storage") ||
    show("storageCount") ||
    show("storageArea") ||
    show("elevator");

  const deedVisible =
    show("deedCadastralNumber") ||
    show("deedSubParcelNumber") ||
    show("deedMainParcelNumber") ||
    show("deedPlotNumber") ||
    show("deedCadastralDistrict") ||
    show("deedRegistrationArea") ||
    show("deedAreaSqm") ||
    show("deedPostalCode") ||
    show("deedSerialNumber");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        title: show("title") ? title : (initial?.title ?? title),
        description: show("description")
          ? emptyToUndefined(description)
          : undefined,
        propertyType: show("propertyType")
          ? propertyType
          : (initial?.propertyType ?? propertyType),
        referenceCode: show("referenceCode")
          ? emptyToUndefined(referenceCode)
          : undefined,
        areaSqm: show("areaSqm") && areaSqm ? Number(areaSqm) : undefined,
        floor: show("floor") && floor ? Number(floor) : undefined,
        totalFloors:
          show("totalFloors") && totalFloors ? Number(totalFloors) : undefined,
        yearBuilt: show("yearBuilt") && yearBuilt ? Number(yearBuilt) : undefined,
        bedrooms: show("bedrooms") && bedrooms ? Number(bedrooms) : undefined,
        bathrooms:
          show("bathrooms") && bathrooms ? Number(bathrooms) : undefined,
        parkingSpots:
          show("parkingCount") && parkingCount
            ? Number(parkingCount)
            : undefined,
        address: addressVisible
          ? {
              city: show("addressCity") ? city : (initial?.address?.city ?? city),
              province: show("addressProvince")
                ? province
                : (initial?.address?.province ?? province),
              details: show("addressDetails")
                ? emptyToUndefined(details)
                : undefined,
              plaque: show("addressPlaque")
                ? emptyToUndefined(plaque)
                : undefined,
              postalCode: show("addressPostalCode")
                ? emptyToUndefined(postalCode)
                : undefined,
            }
          : undefined,
        water: show("water") ? water : undefined,
        electricity: show("electricity") ? electricity : undefined,
        gas: show("gas") ? gas : undefined,
        telephone: show("telephone") ? telephone : undefined,
        parking: show("parking") ? parking : undefined,
        parkingCount:
          show("parkingCount") && parkingCount
            ? Number(parkingCount)
            : undefined,
        storage: show("storage") ? storage : undefined,
        storageCount:
          show("storageCount") && storageCount
            ? Number(storageCount)
            : undefined,
        storageArea:
          show("storageArea") && storageArea ? Number(storageArea) : undefined,
        elevator: show("elevator") ? elevator : undefined,
        otherFacilities: showOtherFacilities
          ? otherFacilities.filter((f) => f.name.trim())
          : undefined,
        deedInfo: deedVisible
          ? {
              cadastralNumber: show("deedCadastralNumber")
                ? emptyToUndefined(deed.cadastralNumber)
                : undefined,
              subParcelNumber: show("deedSubParcelNumber")
                ? emptyToUndefined(deed.subParcelNumber)
                : undefined,
              mainParcelNumber: show("deedMainParcelNumber")
                ? emptyToUndefined(deed.mainParcelNumber)
                : undefined,
              plotNumber: show("deedPlotNumber")
                ? emptyToUndefined(deed.plotNumber)
                : undefined,
              cadastralDistrict: show("deedCadastralDistrict")
                ? emptyToUndefined(deed.cadastralDistrict)
                : undefined,
              registrationArea: show("deedRegistrationArea")
                ? emptyToUndefined(deed.registrationArea)
                : undefined,
              areaSqm:
                show("deedAreaSqm") && deed.areaSqm
                  ? Number(deed.areaSqm)
                  : undefined,
              postalCode: show("deedPostalCode")
                ? emptyToUndefined(deed.postalCode)
                : undefined,
              deedSerialNumber: show("deedSerialNumber")
                ? emptyToUndefined(deed.deedSerialNumber)
                : undefined,
            }
          : undefined,
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

  const specFields: Array<{
    key: PropertyFormField;
    label: string;
    value: string;
    setter: (v: string) => void;
  }> = [
    { key: "areaSqm", label: "متراژ (متر مربع)", value: areaSqm, setter: setAreaSqm },
    { key: "floor", label: "طبقه", value: floor, setter: setFloor },
    {
      key: "totalFloors",
      label: "تعداد طبقات",
      value: totalFloors,
      setter: setTotalFloors,
    },
    { key: "yearBuilt", label: "سال ساخت", value: yearBuilt, setter: setYearBuilt },
    { key: "bedrooms", label: "تعداد خواب", value: bedrooms, setter: setBedrooms },
    {
      key: "bathrooms",
      label: "تعداد سرویس",
      value: bathrooms,
      setter: setBathrooms,
    },
  ];

  const deedFields: Array<{
    key: PropertyFormField;
    label: string;
    deedKey: keyof typeof deed;
  }> = [
    {
      key: "deedCadastralNumber",
      label: "شماره پلاک ثبتی",
      deedKey: "cadastralNumber",
    },
    {
      key: "deedSubParcelNumber",
      label: "قطعه فرعی",
      deedKey: "subParcelNumber",
    },
    {
      key: "deedMainParcelNumber",
      label: "قطعه اصلی",
      deedKey: "mainParcelNumber",
    },
    { key: "deedPlotNumber", label: "شماره قطعه", deedKey: "plotNumber" },
    {
      key: "deedCadastralDistrict",
      label: "بخش ثبتی",
      deedKey: "cadastralDistrict",
    },
    {
      key: "deedRegistrationArea",
      label: "حوزه ثبتی",
      deedKey: "registrationArea",
    },
    {
      key: "deedSerialNumber",
      label: "سریال سند",
      deedKey: "deedSerialNumber",
    },
    { key: "deedPostalCode", label: "کد پستی سند", deedKey: "postalCode" },
  ];

  return (
    <form className="space-y-5" onSubmit={(e) => void handleSubmit(e)}>
      <Card>
        <CardHeader>
          <CardTitle>اطلاعات پایه</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          {show("title") ? (
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
          ) : null}
          {show("description") ? (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">توضیحات</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="موقعیت، نورگیری، بازسازی و نکات مهم فایل"
              />
            </div>
          ) : null}
          {show("propertyType") ? (
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
          ) : null}
          {show("referenceCode") ? (
            <div className="space-y-2">
              <Label htmlFor="ref">کد ارجاع</Label>
              <Input
                id="ref"
                value={referenceCode}
                onChange={(e) => setReferenceCode(e.target.value)}
                dir="ltr"
              />
            </div>
          ) : null}
          {specFields
            .filter((f) => show(f.key))
            .map((f) => (
              <div className="space-y-2" key={f.key}>
                <Label>{f.label}</Label>
                <Input
                  type="number"
                  value={f.value}
                  onChange={(e) => f.setter(e.target.value)}
                />
              </div>
            ))}
        </CardContent>
      </Card>

      {addressVisible ? (
        <Card>
          <CardHeader>
            <CardTitle>نشانی</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            {show("addressCity") ? (
              <div className="space-y-2">
                <Label>شهر</Label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
            ) : null}
            {show("addressProvince") ? (
              <div className="space-y-2">
                <Label>استان</Label>
                <Input
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  required
                />
              </div>
            ) : null}
            {show("addressDetails") ? (
              <div className="space-y-2">
                <Label>جزئیات نشانی</Label>
                <Input
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="محله، خیابان، کوچه"
                />
              </div>
            ) : null}
            {show("addressPlaque") ? (
              <div className="space-y-2">
                <Label>پلاک</Label>
                <Input
                  value={plaque}
                  onChange={(e) => setPlaque(e.target.value)}
                />
              </div>
            ) : null}
            {show("addressPostalCode") ? (
              <div className="space-y-2">
                <Label>کد پستی</Label>
                <Input
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  dir="ltr"
                />
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {facilitiesVisible ? (
        <Card>
          <CardHeader>
            <CardTitle>امکانات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {show("water") ? (
                <BoolField label="آب" checked={water} onChange={setWater} />
              ) : null}
              {show("electricity") ? (
                <BoolField
                  label="برق"
                  checked={electricity}
                  onChange={setElectricity}
                />
              ) : null}
              {show("gas") ? (
                <BoolField label="گاز" checked={gas} onChange={setGas} />
              ) : null}
              {show("telephone") ? (
                <BoolField
                  label="تلفن"
                  checked={telephone}
                  onChange={setTelephone}
                />
              ) : null}
              {show("parking") ? (
                <BoolField
                  label="پارکینگ"
                  checked={parking}
                  onChange={setParking}
                />
              ) : null}
              {show("storage") ? (
                <BoolField
                  label="انباری"
                  checked={storage}
                  onChange={setStorage}
                />
              ) : null}
              {show("elevator") ? (
                <BoolField
                  label="آسانسور"
                  checked={elevator}
                  onChange={setElevator}
                />
              ) : null}
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {show("parkingCount") ? (
                <div className="space-y-2">
                  <Label>تعداد پارکینگ</Label>
                  <Input
                    type="number"
                    value={parkingCount}
                    onChange={(e) => setParkingCount(e.target.value)}
                  />
                </div>
              ) : null}
              {show("storageCount") ? (
                <div className="space-y-2">
                  <Label>تعداد انباری</Label>
                  <Input
                    type="number"
                    value={storageCount}
                    onChange={(e) => setStorageCount(e.target.value)}
                  />
                </div>
              ) : null}
              {show("storageArea") ? (
                <div className="space-y-2">
                  <Label>متراژ انباری (متر مربع)</Label>
                  <Input
                    type="number"
                    value={storageArea}
                    onChange={(e) => setStorageArea(e.target.value)}
                  />
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {showOtherFacilities ? (
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
      ) : null}

      {deedVisible ? (
        <Card>
          <CardHeader>
            <CardTitle>مشخصات سند</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            {deedFields
              .filter((f) => show(f.key))
              .map((f) => (
                <div className="space-y-2" key={f.key}>
                  <Label>{f.label}</Label>
                  <Input
                    value={deed[f.deedKey]}
                    onChange={(e) =>
                      setDeed((prev) => ({
                        ...prev,
                        [f.deedKey]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            {show("deedAreaSqm") ? (
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
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <Button disabled={submitting} type="submit">
        {submitting ? (submittingLabel ?? messages.saving) : submitLabel}
      </Button>
    </form>
  );
}
