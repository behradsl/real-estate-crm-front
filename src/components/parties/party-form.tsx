"use client";

import { FormEvent, useState } from "react";
import type { CreatePartyInput, Gender, Party, PartyType } from "@/lib/api/types";
import { genderLabels, messages, partyTypeLabels } from "@/lib/labels";
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

export function PartyForm({
  initial,
  submitLabel,
  submittingLabel,
  onSubmit,
}: {
  initial?: Party | null;
  submitLabel: string;
  submittingLabel?: string;
  onSubmit: (payload: CreatePartyInput) => Promise<void>;
}) {
  const isEdit = Boolean(initial);
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<PartyType>(initial?.type ?? "PERSON");
  const [firstName, setFirstName] = useState(
    initial?.firstName ?? (isEdit ? "" : "علی"),
  );
  const [lastName, setLastName] = useState(
    initial?.lastName ?? (isEdit ? "" : "محمدی"),
  );
  const [companyName, setCompanyName] = useState(initial?.companyName ?? "");
  const [nationalCode, setNationalCode] = useState(
    initial?.nationalCode ?? (isEdit ? "" : "0012345678"),
  );
  const [economicCode, setEconomicCode] = useState(initial?.economicCode ?? "");
  const [fatherName, setFatherName] = useState(
    initial?.fatherName ?? (isEdit ? "" : "حسین"),
  );
  const [phone, setPhone] = useState(
    initial?.phone ?? (isEdit ? "" : "09121234567"),
  );
  const [email, setEmail] = useState(initial?.email ?? "");
  const [gender, setGender] = useState<Gender | "">(initial?.gender ?? "MALE");
  const [birthPlace, setBirthPlace] = useState(
    initial?.birthPlace ?? (isEdit ? "" : "همدان"),
  );
  const [city, setCity] = useState(
    initial?.address?.city ?? (isEdit ? "" : "همدان"),
  );
  const [province, setProvince] = useState(
    initial?.address?.province ?? (isEdit ? "" : "همدان"),
  );

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
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
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={(e) => void handleSubmit(e)}>
      <Card>
        <CardHeader>
          <CardTitle>هویت</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>نوع</Label>
            <Select value={type} onValueChange={(v) => setType(v as PartyType)}>
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
              <div className="space-y-2">
                <Label>نام</Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>نام خانوادگی</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>نام پدر</Label>
                <Input
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>جنسیت</Label>
                <Select
                  value={gender}
                  onValueChange={(v) => setGender(v as Gender)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">{genderLabels.MALE}</SelectItem>
                    <SelectItem value="FEMALE">{genderLabels.FEMALE}</SelectItem>
                    <SelectItem value="OTHER">{genderLabels.OTHER}</SelectItem>
                  </SelectContent>
                </Select>
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
            <>
              <div className="space-y-2">
                <Label>نام شرکت</Label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>شناسه اقتصادی</Label>
                <Input
                  value={economicCode}
                  onChange={(e) => setEconomicCode(e.target.value)}
                  dir="ltr"
                />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label>تلفن</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label>ایمیل</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>محل تولد</Label>
            <Input
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
            />
          </div>
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
        </CardContent>
      </Card>
      <Button disabled={submitting} type="submit">
        {submitting ? (submittingLabel ?? messages.saving) : submitLabel}
      </Button>
    </form>
  );
}
