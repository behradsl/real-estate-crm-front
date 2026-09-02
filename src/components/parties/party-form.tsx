"use client";

import { FormEvent, useState } from "react";
import type { CreatePartyInput, Gender, Party, PartyType } from "@/lib/api/types";
import {
  ALL_PARTY_FORM_FIELDS,
  showPartyField,
  type PartyFormField,
} from "@/lib/contracts/contract-entity-fields";
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
  seedExamples = true,
  fields,
  onSubmit,
}: {
  initial?: Party | null;
  submitLabel: string;
  submittingLabel?: string;
  /** Prefill demo values on create (disable in pickers). */
  seedExamples?: boolean;
  /** When omitted, show the full CRM union of fields. */
  fields?: readonly PartyFormField[];
  onSubmit: (payload: CreatePartyInput) => Promise<void>;
}) {
  const visible = fields ?? ALL_PARTY_FORM_FIELDS;
  const show = (key: PartyFormField) => showPartyField(visible, key);

  const isEdit = Boolean(initial);
  const useSeed = !isEdit && seedExamples;
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<PartyType>(initial?.type ?? "PERSON");
  const [firstName, setFirstName] = useState(
    initial?.firstName ?? (useSeed ? "علی" : ""),
  );
  const [lastName, setLastName] = useState(
    initial?.lastName ?? (useSeed ? "محمدی" : ""),
  );
  const [companyName, setCompanyName] = useState(initial?.companyName ?? "");
  const [nationalCode, setNationalCode] = useState(
    initial?.nationalCode ?? (useSeed ? "0012345678" : ""),
  );
  const [economicCode, setEconomicCode] = useState(initial?.economicCode ?? "");
  const [fatherName, setFatherName] = useState(
    initial?.fatherName ?? (useSeed ? "حسین" : ""),
  );
  const [phone, setPhone] = useState(
    initial?.phone ?? (useSeed ? "09121234567" : ""),
  );
  const [email, setEmail] = useState(initial?.email ?? "");
  const [gender, setGender] = useState<Gender | "">(initial?.gender ?? "MALE");
  const [birthPlace, setBirthPlace] = useState(
    initial?.birthPlace ?? (useSeed ? "همدان" : ""),
  );
  const [birthDate, setBirthDate] = useState(initial?.birthDate ?? "");
  const [identityNumber, setIdentityNumber] = useState(
    initial?.identityNumber ?? "",
  );
  const [identityExportPlace, setIdentityExportPlace] = useState(
    initial?.identityExportPlace ?? "",
  );
  const [city, setCity] = useState(
    initial?.address?.city ?? (useSeed ? "همدان" : ""),
  );
  const [province, setProvince] = useState(
    initial?.address?.province ?? (useSeed ? "همدان" : ""),
  );
  const [details, setDetails] = useState(initial?.address?.details ?? "");
  const [plaque, setPlaque] = useState(initial?.address?.plaque ?? "");
  const [postalCode, setPostalCode] = useState(
    initial?.address?.postalCode ?? "",
  );

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const addressVisible =
        show("addressCity") ||
        show("addressProvince") ||
        show("addressDetails") ||
        show("addressPlaque") ||
        show("addressPostalCode");

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
        email: show("email") ? emptyToUndefined(email) : undefined,
        gender: show("gender") ? gender || undefined : undefined,
        birthPlace: emptyToUndefined(birthPlace),
        birthDate: show("birthDate") ? emptyToUndefined(birthDate) : undefined,
        identityNumber: emptyToUndefined(identityNumber),
        identityExportPlace: emptyToUndefined(identityExportPlace),
        address: addressVisible
          ? {
              city,
              province,
              details: emptyToUndefined(details),
              plaque: emptyToUndefined(plaque),
              postalCode: emptyToUndefined(postalCode),
            }
          : undefined,
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
          {show("type") ? (
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
          ) : null}
          {type === "PERSON" ? (
            <>
              {show("firstName") ? (
                <div className="space-y-2">
                  <Label>نام</Label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              ) : null}
              {show("lastName") ? (
                <div className="space-y-2">
                  <Label>نام خانوادگی</Label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              ) : null}
              {show("fatherName") ? (
                <div className="space-y-2">
                  <Label>نام پدر</Label>
                  <Input
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                  />
                </div>
              ) : null}
              {show("gender") ? (
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
              ) : null}
              {show("nationalCode") ? (
                <div className="space-y-2">
                  <Label>کد ملی</Label>
                  <Input
                    value={nationalCode}
                    onChange={(e) => setNationalCode(e.target.value)}
                    dir="ltr"
                  />
                </div>
              ) : null}
              {show("identityNumber") ? (
                <div className="space-y-2">
                  <Label>شماره شناسنامه</Label>
                  <Input
                    value={identityNumber}
                    onChange={(e) => setIdentityNumber(e.target.value)}
                    dir="ltr"
                  />
                </div>
              ) : null}
              {show("identityExportPlace") ? (
                <div className="space-y-2">
                  <Label>محل صدور شناسنامه</Label>
                  <Input
                    value={identityExportPlace}
                    onChange={(e) => setIdentityExportPlace(e.target.value)}
                  />
                </div>
              ) : null}
            </>
          ) : (
            <>
              {show("companyName") ? (
                <div className="space-y-2">
                  <Label>نام شرکت</Label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              ) : null}
              {show("economicCode") ? (
                <div className="space-y-2">
                  <Label>شناسه اقتصادی</Label>
                  <Input
                    value={economicCode}
                    onChange={(e) => setEconomicCode(e.target.value)}
                    dir="ltr"
                  />
                </div>
              ) : null}
              {show("nationalCode") ? (
                <div className="space-y-2">
                  <Label>شناسه ملی</Label>
                  <Input
                    value={nationalCode}
                    onChange={(e) => setNationalCode(e.target.value)}
                    dir="ltr"
                  />
                </div>
              ) : null}
            </>
          )}
          {show("phone") ? (
            <div className="space-y-2">
              <Label>تلفن</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                dir="ltr"
              />
            </div>
          ) : null}
          {show("email") ? (
            <div className="space-y-2">
              <Label>ایمیل</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          ) : null}
          {show("birthPlace") ? (
            <div className="space-y-2">
              <Label>محل تولد</Label>
              <Input
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
              />
            </div>
          ) : null}
          {show("birthDate") ? (
            <div className="space-y-2">
              <Label>تاریخ تولد</Label>
              <Input
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                placeholder="۱۳۷۰/۰۱/۰۱"
                dir="ltr"
              />
            </div>
          ) : null}
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
              <Input value={plaque} onChange={(e) => setPlaque(e.target.value)} />
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
      <Button disabled={submitting} type="submit">
        {submitting ? (submittingLabel ?? messages.saving) : submitLabel}
      </Button>
    </form>
  );
}
