"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { propertiesApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import type { PropertyType } from "@/lib/api/types";
import { deedInfoExample, facilitiesExample, PROPERTY_TYPES } from "@/lib/examples";
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
  const [parkingSpots, setParkingSpots] = useState("1");
  const [city, setCity] = useState("تهران");
  const [province, setProvince] = useState("تهران");
  const [street, setStreet] = useState("ونک");
  const [postalCode, setPostalCode] = useState("");
  const [facilitiesJson, setFacilitiesJson] = useState(
    JSON.stringify(facilitiesExample, null, 2),
  );
  const [deedInfoJson, setDeedInfoJson] = useState(
    JSON.stringify(deedInfoExample, null, 2),
  );

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const facilities = JSON.parse(facilitiesJson) as Record<string, unknown>;
      const deedInfo = JSON.parse(deedInfoJson) as Record<string, unknown>;
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
        parkingSpots: parkingSpots ? Number(parkingSpots) : undefined,
        address: {
          city,
          province,
          street: emptyToUndefined(street),
          postalCode: emptyToUndefined(postalCode),
        },
        facilities,
        deedInfo: { data: deedInfo },
      });
      toast.success("Property created");
      router.push(`/properties/${created.id}`);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : error instanceof SyntaxError
            ? "Invalid JSON in facilities or deedInfo"
            : "Create failed",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="New property"
        description="Nested address plus frontend-owned facilities and deedInfo JSON."
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
                ["Parking", parkingSpots, setParkingSpots],
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
              <Label>Street</Label>
              <Input value={street} onChange={(e) => setStreet(e.target.value)} />
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
            <CardTitle className="text-base">Facilities JSON</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              className="min-h-48 font-mono text-xs"
              value={facilitiesJson}
              onChange={(e) => setFacilitiesJson(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Deed info JSON</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              className="min-h-48 font-mono text-xs"
              value={deedInfoJson}
              onChange={(e) => setDeedInfoJson(e.target.value)}
            />
          </CardContent>
        </Card>

        <Button disabled={submitting} type="submit">
          {submitting ? "Creating…" : "Create property"}
        </Button>
      </form>
    </div>
  );
}
