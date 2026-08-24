"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { partiesApi } from "@/lib/api";
import type { Party } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { partyDisplayName } from "@/lib/contracts/wizard";
import { messages, partyTypeLabels } from "@/lib/labels";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PartiesPage() {
  const [items, setItems] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setItems(await partiesApi.list());
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : messages.loadFailed);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onDelete(id: string) {
    if (!confirm("این طرف قرارداد حذف شود؟")) return;
    try {
      await partiesApi.remove(id);
      toast.success("طرف قرارداد حذف شد");
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : messages.deleteFailed);
    }
  }

  return (
    <div>
      <PageHeader
        title="طرفین قرارداد"
        description="اشخاص حقیقی و حقوقی که در قراردادها حضور دارند."
        actionHref="/parties/new"
        actionLabel="ثبت طرف جدید"
      />
      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام</TableHead>
              <TableHead>نوع</TableHead>
              <TableHead>کد ملی / اقتصادی</TableHead>
              <TableHead>تلفن</TableHead>
              <TableHead className="text-end">{messages.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground">
                  {messages.loading}
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground">
                  هنوز طرف قراردادی ثبت نشده است.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{partyDisplayName(item)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{partyTypeLabels[item.type]}</Badge>
                  </TableCell>
                  <TableCell dir="ltr">
                    {item.nationalCode ?? item.economicCode ?? messages.none}
                  </TableCell>
                  <TableCell dir="ltr">{item.phone ?? messages.none}</TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/parties/${item.id}`}>{messages.open}</Link>
                      </Button>
                      <Button asChild size="sm" variant="secondary">
                        <Link href={`/parties/${item.id}/edit`}>{messages.edit}</Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => void onDelete(item.id)}
                      >
                        {messages.delete}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
