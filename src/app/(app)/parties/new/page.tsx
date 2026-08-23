"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { partiesApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import type { Gender, PartyType } from "@/lib/api/types";
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

function emptyToUndefined(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export default function NewPartyPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<PartyType>("PERSON");
  const [firstName, setFirstName] = useState("علی");
  const [lastName, setLastName] = useState("محمدی");
  const [companyName, setCompanyName] = useState("");
  const [nationalCode, setNationalCode] = useState("0012345678");
  const [economicCode, setEconomicCode] = useState("");
  const [fatherName, setFatherName] = useState("حسین");
  const [phone, setPhone] = useState("09121234567");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<Gender | "">("MALE");
  const [birthPlace, setBirthPlace] = useState("همدان");
  const [city, setCity] = useState("همدان");
  const [province, setProvince] = useState("همدان");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const created = await partiesApi.create({
        type,
        firstName: type === "PERSON" ? emptyToUndefined(firstName) : undefined,
        lastName: type === "PERSON" ? emptyToUndefined(lastName) : undefined,
        companyName:
          type === "COMPANY" ? emptyToUndefined(companyName) : undefined,
        nationalCode: emptyToUndefined(nationalCode),
        economicCode: emptyToUndefined(economicCode),
        fatherName: emptyToUndefined(fatherName),
        phone: emptyToUndefined(phone),
        email: emptyToUndefined(email),
        gender: gender || undefined,
        birthPlace: emptyToUndefined(birthPlace),
        address: {
          city,
          province,
        },
      });
      toast.success("Party created");
      router.push(`/parties/${created.id}`);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Create failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader title="New party" description="Create a person or company." />
      <form className="space-y-4" onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Identity</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as PartyType)}
              >
                <SelectTrigger>
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
                <div className="space-y-2">
                  <Label>First name</Label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last name</Label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Father name</Label>
                  <Input
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={gender}
                    onValueChange={(v) => setGender(v as Gender)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">MALE</SelectItem>
                      <SelectItem value="FEMALE">FEMALE</SelectItem>
                      <SelectItem value="OTHER">OTHER</SelectItem>
                    </SelectContent>
                  </Select>
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
              <>
                <div className="space-y-2">
                  <Label>Company name</Label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Economic code</Label>
                  <Input
                    value={economicCode}
                    onChange={(e) => setEconomicCode(e.target.value)}
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Birth place</Label>
              <Input
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
              />
            </div>
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
          </CardContent>
        </Card>
        <Button disabled={submitting} type="submit">
          {submitting ? "Creating…" : "Create party"}
        </Button>
      </form>
    </div>
  );
}
