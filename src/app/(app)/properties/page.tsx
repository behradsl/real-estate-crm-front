"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { propertiesApi } from "@/lib/api";
import type { Property } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { formatArea } from "@/lib/format";
import { messages, propertyTypeLabels } from "@/lib/labels";
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

export default function PropertiesPage() {
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setItems(await propertiesApi.list());
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
    if (!confirm("این ملک از فهرست حذف شود؟")) return;
    try {
      await propertiesApi.remove(id);
      toast.success("ملک حذف شد");
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : messages.deleteFailed);
    }
  }

  return (
    <div>
      <PageHeader
        title="املاک"
        description="فایل‌های آژانس با نوع کاربری، کد ارجاع و متراژ."
        actionHref="/properties/new"
        actionLabel="ثبت ملک جدید"
      />

      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>عنوان</TableHead>
              <TableHead>نوع ملک</TableHead>
              <TableHead>کد ارجاع</TableHead>
              <TableHead>متراژ</TableHead>
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
                  هنوز ملکی ثبت نشده است.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {propertyTypeLabels[item.propertyType]}
                    </Badge>
                  </TableCell>
                  <TableCell dir="ltr">{item.referenceCode ?? messages.none}</TableCell>
                  <TableCell>{formatArea(item.areaSqm)}</TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/properties/${item.id}`}>{messages.open}</Link>
                      </Button>
                      <Button asChild size="sm" variant="secondary">
                        <Link href={`/properties/${item.id}/edit`}>{messages.edit}</Link>
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
