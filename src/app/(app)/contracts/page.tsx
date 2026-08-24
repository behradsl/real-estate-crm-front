"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { contractsApi } from "@/lib/api";
import type { Contract } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { formatDate } from "@/lib/format";
import { contractTypeLabels, messages } from "@/lib/labels";
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

export default function ContractsPage() {
  const [items, setItems] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setItems(await contractsApi.list());
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
    if (!confirm("این قرارداد حذف شود؟")) return;
    try {
      await contractsApi.remove(id);
      toast.success("قرارداد حذف شد");
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : messages.deleteFailed);
    }
  }

  return (
    <div>
      <PageHeader
        title="قراردادها"
        description="تنظیم گام‌به‌گام مبایعه‌نامه، رهن و اجاره و سایر قراردادها با پیش‌نمایش چاپی."
        actionHref="/contracts/new"
        actionLabel="قرارداد جدید"
      />
      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>شماره</TableHead>
              <TableHead>نوع</TableHead>
              <TableHead>مبلغ کل</TableHead>
              <TableHead>کمیسیون</TableHead>
              <TableHead>تاریخ امضا</TableHead>
              <TableHead className="text-end">{messages.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground">
                  {messages.loading}
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground">
                  هنوز قراردادی ثبت نشده است.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium" dir="ltr">
                    {item.contractNumber}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {contractTypeLabels[item.contractType]}
                    </Badge>
                  </TableCell>
                  <TableCell dir="ltr">
                    {item.totalAmount ?? item.monthlyAmount ?? messages.none}
                  </TableCell>
                  <TableCell dir="ltr">{item.commissionAmount ?? messages.none}</TableCell>
                  <TableCell>{formatDate(item.signedAt)}</TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/contracts/${item.id}`}>{messages.open}</Link>
                      </Button>
                      <Button asChild size="sm" variant="secondary">
                        <Link href={`/contracts/${item.id}/edit`}>{messages.edit}</Link>
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
