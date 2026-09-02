"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { useAuth } from "@/components/providers/auth-provider";
import { printLayoutsApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import type {
  ContractType,
  PrintFieldBox,
  UpsertPrintLayoutInput,
} from "@/lib/api/types";
import { catalogKeysForType } from "@/lib/contracts/print-catalog";
import { printFieldLabel } from "@/lib/contracts/print-field-labels";
import { contractTypeLabels, messages } from "@/lib/labels";
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

type EditableBox = {
  startX: string;
  startY: string;
  endX: string;
  endY: string;
  page: string;
};

function emptyBox(): EditableBox {
  return {
    startX: "",
    startY: "",
    endX: "",
    endY: "",
    page: "1",
  };
}

function boxFromApi(box: PrintFieldBox): EditableBox {
  return {
    startX: String(box.start.x ?? ""),
    startY: String(box.start.y ?? ""),
    endX: String(box.end.x ?? ""),
    endY: String(box.end.y ?? ""),
    page: String(box.start.page ?? box.end.page ?? 1),
  };
}

function parseNum(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

export default function PrintLayoutEditorPage() {
  const params = useParams<{ id: string; contractType: string }>();
  const { hasRole } = useAuth();
  const contractType = params.contractType as ContractType;
  const catalogKeys = useMemo(
    () => [...catalogKeysForType(contractType)],
    [contractType],
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paperWidthMm, setPaperWidthMm] = useState("297");
  const [paperHeightMm, setPaperHeightMm] = useState("420");
  const [fields, setFields] = useState<Record<string, EditableBox>>({});
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [addKey, setAddKey] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        try {
          const layout = await printLayoutsApi.get(params.id, contractType);
          if (cancelled) return;
          setPaperWidthMm(String(layout.paperWidthMm));
          setPaperHeightMm(String(layout.paperHeightMm));
          const next: Record<string, EditableBox> = {};
          const keys: string[] = [];
          for (const [key, box] of Object.entries(layout.fields ?? {})) {
            next[key] = boxFromApi(box);
            keys.push(key);
          }
          setFields(next);
          setActiveKeys(keys.sort());
        } catch (err) {
          if (err instanceof ApiError && err.status === 404) {
            if (!cancelled) {
              setFields({});
              setActiveKeys([]);
            }
          } else {
            throw err;
          }
        }
      } catch (error) {
        toast.error(
          error instanceof ApiError ? error.message : messages.loadFailed,
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.id, contractType]);

  const availableToAdd = catalogKeys.filter((k) => !activeKeys.includes(k));

  function patchBox(key: string, partial: Partial<EditableBox>) {
    setFields((prev) => ({
      ...prev,
      [key]: { ...(prev[key] ?? emptyBox()), ...partial },
    }));
  }

  function addFieldKey(key: string) {
    if (!key || activeKeys.includes(key)) return;
    setActiveKeys((prev) => [...prev, key].sort());
    setFields((prev) => ({
      ...prev,
      [key]: prev[key] ?? emptyBox(),
    }));
    setAddKey("");
  }

  function removeKey(key: string) {
    setActiveKeys((prev) => prev.filter((k) => k !== key));
    setFields((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function onSave() {
    const w = parseNum(paperWidthMm);
    const h = parseNum(paperHeightMm);
    if (w == null || h == null || w <= 0 || h <= 0) {
      toast.error("ابعاد کاغذ معتبر نیست");
      return;
    }

    const payloadFields: Record<string, PrintFieldBox> = {};
    for (const key of activeKeys) {
      const box = fields[key] ?? emptyBox();
      const startX = parseNum(box.startX);
      const startY = parseNum(box.startY);
      const endX = parseNum(box.endX);
      const endY = parseNum(box.endY);
      const page = parseNum(box.page) ?? 1;
      if (startX == null || startY == null || endX == null || endY == null) {
        toast.error(`مختصات «${printFieldLabel(key)}» ناقص است`);
        return;
      }
      payloadFields[key] = {
        start: { x: startX, y: startY, page },
        end: { x: endX, y: endY, page },
      };
    }

    const input: UpsertPrintLayoutInput = {
      paperWidthMm: w,
      paperHeightMm: h,
      fields: payloadFields,
    };

    setSaving(true);
    try {
      await printLayoutsApi.upsert(params.id, contractType, input);
      toast.success("چیدمان چاپ ذخیره شد");
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : messages.saveFailed,
      );
    } finally {
      setSaving(false);
    }
  }

  if (!hasRole("ADMIN", "OWNER")) {
    return (
      <p className="text-sm leading-relaxed text-muted-foreground">
        فقط مدیر یا مالک آژانس می‌تواند چیدمان چاپ را ویرایش کند.
      </p>
    );
  }

  if (loading) {
    return (
      <p className="text-sm leading-relaxed text-muted-foreground">
        {messages.loading}
      </p>
    );
  }

  return (
    <div>
      <PageHeader
        title={`چیدمان چاپ — ${contractTypeLabels[contractType] ?? contractType}`}
        description="مختصات میلی‌متر از گوشه پایین-چپ A3 (پیش‌فرض ۲۹۷×۴۲۰)."
        actions={
          <Button asChild variant="outline">
            <Link href={`/organizations/${params.id}/print-layouts`}>
              بازگشت به فهرست
            </Link>
          </Button>
        }
      />

      <Card className="mb-5">
        <CardHeader>
          <CardTitle className="text-base">ابعاد کاغذ</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>عرض (mm)</Label>
            <Input
              value={paperWidthMm}
              onChange={(e) => setPaperWidthMm(e.target.value)}
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label>ارتفاع (mm)</Label>
            <Input
              value={paperHeightMm}
              onChange={(e) => setPaperHeightMm(e.target.value)}
              dir="ltr"
            />
          </div>
          <p className="md:col-span-2 text-sm text-muted-foreground">
            مختصات میلی‌متر از گوشه پایین-چپ A3 — start و end گوشه‌های کادر فیلد
            هستند.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-5">
        <CardHeader>
          <CardTitle className="text-base">افزودن فیلد از کاتالوگ</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="min-w-[240px] flex-1 space-y-2">
            <Label>کلید فیلد</Label>
            <Select value={addKey || undefined} onValueChange={setAddKey}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="انتخاب کلید…" />
              </SelectTrigger>
              <SelectContent>
                {availableToAdd.map((key) => (
                  <SelectItem key={key} value={key}>
                    {printFieldLabel(key)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            variant="secondary"
            disabled={!addKey}
            onClick={() => addFieldKey(addKey)}
          >
            افزودن
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setActiveKeys(catalogKeys);
              setFields((prev) => {
                const next = { ...prev };
                for (const key of catalogKeys) {
                  if (!next[key]) next[key] = emptyBox();
                }
                return next;
              });
            }}
          >
            افزودن همه کلیدها
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {activeKeys.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            هنوز فیلدی اضافه نشده است. از کاتالوگ یک کلید انتخاب کنید.
          </p>
        ) : (
          activeKeys.map((key) => {
            const box = fields[key] ?? emptyBox();
            return (
              <Card key={key}>
                <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
                  <div className="min-w-0 space-y-1">
                    <CardTitle className="text-sm">
                      {printFieldLabel(key)}
                    </CardTitle>
                    <p className="truncate font-mono text-xs text-muted-foreground" dir="ltr">
                      {key}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeKey(key)}
                  >
                    حذف
                  </Button>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-5">
                  {(
                    [
                      ["startX", "شروع X"],
                      ["startY", "شروع Y"],
                      ["endX", "پایان X"],
                      ["endY", "پایان Y"],
                      ["page", "صفحه"],
                    ] as const
                  ).map(([field, label]) => (
                    <div key={field} className="space-y-1">
                      <Label className="text-xs">{label}</Label>
                      <Input
                        value={box[field]}
                        onChange={(e) =>
                          patchBox(key, { [field]: e.target.value })
                        }
                        dir="ltr"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <div className="mt-6">
        <Button type="button" disabled={saving} onClick={() => void onSave()}>
          {saving ? messages.saving : messages.save}
        </Button>
      </div>
    </div>
  );
}
