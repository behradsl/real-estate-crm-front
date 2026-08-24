"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { useAuth } from "@/components/providers/auth-provider";
import { organizationsApi } from "@/lib/api";
import type { Organization } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { messages } from "@/lib/labels";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OrganizationsPage() {
  const { hasRole } = useAuth();
  const [items, setItems] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        setItems(await organizationsApi.list());
      } catch (error) {
        toast.error(
          error instanceof ApiError ? error.message : messages.loadFailed,
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <PageHeader
        title="آژانس‌ها"
        description="سازمان‌هایی که روی سامانه راه‌اندازی شده‌اند."
        actionHref={hasRole("ADMIN") ? "/organizations/new" : undefined}
        actionLabel={hasRole("ADMIN") ? "آژانس جدید" : undefined}
      />
      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام</TableHead>
              <TableHead>شناسه</TableHead>
              <TableHead>ایمیل</TableHead>
              <TableHead className="text-end">{messages.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground">
                  {messages.loading}
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground">
                  آژانسی ثبت نشده است.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell dir="ltr">{item.slug}</TableCell>
                  <TableCell dir="ltr">{item.email ?? messages.none}</TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/organizations/${item.id}`}>{messages.open}</Link>
                      </Button>
                      {hasRole("ADMIN", "OWNER") ? (
                        <Button asChild size="sm" variant="secondary">
                          <Link href={`/organizations/${item.id}/edit`}>
                            {messages.edit}
                          </Link>
                        </Button>
                      ) : null}
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
