"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { propertiesApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import type { OtherFacility, PropertyType } from "@/lib/api/types";
import { deedInfoDefaults, otherFacilitiesExample, PROPERTY_TYPES } from "@/lib/examples";
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
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        className="size-4 accent-foreground"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

export default function NewPropertyPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType>("APARTMENT");
  const [referenceCode, setReferenceCode] = useState("");
  const [areaSqm, setAreaSqm] = useState("120.5");
  const [floor, setFloor] = useState("3");
  const [totalFloors, setTotalFloors] = useState("5");
  const [yearBuilt, setYearBuilt] = useState("2018");
  const [bedrooms, setBedrooms] = useState("3");
  const [bathrooms, setBathrooms] = useState("2");
  const [city, setCity] = useState("تهران");
  const [province, setProvince] = useState("تهران");
  const [details, setDetails] = useState("ونک");
  const [plaque, setPlaque] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [water, setWater] = useState(true);
  const [electricity, setElectricity] = useState(true);
  const [gas, setGas] = useState(true);
  const [telephone, setTelephone] = useState(false);
  const [parking, setParking] = useState(true);
  const [parkingCount, setParkingCount] = useState("1");
  const [storage, setStorage] = useState(true);
  const [storageCount, setStorageCount] = useState("1");
  const [storageArea, setStorageArea] = useState("15");
  const [elevator, setElevator] = useState(true);
  const [otherFacilities, setOtherFacilities] = useState<OtherFacility[]>(
    otherFacilitiesExample,
  );

  const [deed, setDeed] = useState(deedInfoDefaults);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const created = await propertiesApi.create({
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
      toast.success("Property created");
      router.push(`/properties/${created.id}`);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Create failed");
    } finally {
      setSubmitting(false);
    }
  }

  function updateOther(index: number, patch: Partial<OtherFacility>) {
    setOtherFacilities((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  return (
    <div>
      <PageHeader
        title="New property"
        description="Address, fixed facilities, other facilities, and deed registration fields."
      />
      <form className="space-y-4" onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basics</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={propertyType}
                onValueChange={(v) => setPropertyType(v as PropertyType)}
              >
                <SelectTrigger>
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
            <div className="space-y-2">
              <Label htmlFor="ref">Reference code</Label>
              <Input
                id="ref"
                value={referenceCode}
                onChange={(e) => setReferenceCode(e.target.value)}
              />
            </div>
            {(
              [
                ["Area m²", areaSqm, setAreaSqm],
                ["Floor", floor, setFloor],
                ["Total floors", totalFloors, setTotalFloors],
                ["Year built", yearBuilt, setYearBuilt],
                ["Bedrooms", bedrooms, setBedrooms],
                ["Bathrooms", bathrooms, setBathrooms],
              ] as const
            ).map(([label, value, setter]) => (
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
            <CardTitle className="text-base">Address</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
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
            <div className="space-y-2">
              <Label>Details</Label>
              <Input value={details} onChange={(e) => setDetails(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Plaque</Label>
              <Input value={plaque} onChange={(e) => setPlaque(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Postal code</Label>
              <Input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Facilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              <BoolField label="Water" checked={water} onChange={setWater} />
              <BoolField
                label="Electricity"
                checked={electricity}
                onChange={setElectricity}
              />
              <BoolField label="Gas" checked={gas} onChange={setGas} />
              <BoolField
                label="Telephone"
                checked={telephone}
                onChange={setTelephone}
              />
              <BoolField label="Parking" checked={parking} onChange={setParking} />
              <BoolField label="Storage" checked={storage} onChange={setStorage} />
              <BoolField
                label="Elevator"
                checked={elevator}
                onChange={setElevator}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Parking count</Label>
                <Input
                  type="number"
                  value={parkingCount}
                  onChange={(e) => setParkingCount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Storage count</Label>
                <Input
                  type="number"
                  value={storageCount}
                  onChange={(e) => setStorageCount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Storage area (m²)</Label>
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
            <CardTitle className="text-base">Other facilities</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setOtherFacilities((prev) => [...prev, { name: "", kind: "" }])
              }
            >
              Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {otherFacilities.map((item, index) => (
              <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]" key={index}>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateOther(index, { name: e.target.value })}
                    placeholder="گرمایش"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kind</Label>
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
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Deed info</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {(
              [
                ["Cadastral number", "cadastralNumber"],
                ["Sub parcel", "subParcelNumber"],
                ["Main parcel", "mainParcelNumber"],
                ["Plot number", "plotNumber"],
                ["Cadastral district", "cadastralDistrict"],
                ["Registration area", "registrationArea"],
                ["Postal code", "postalCode"],
              ] as const
            ).map(([label, key]) => (
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
              <Label>Area (m²)</Label>
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
          {submitting ? "Creating…" : "Create property"}
        </Button>
      </form>
    </div>
  );
}
