"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { contractsApi } from "@/lib/api";
import type { Contract } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
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
      toast.error(error instanceof ApiError ? error.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onDelete(id: string) {
    if (!confirm("Soft-delete this contract?")) return;
    try {
      await contractsApi.remove(id);
      toast.success("Contract deleted");
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Delete failed");
    }
  }

  return (
    <div>
      <PageHeader
        title="Contracts"
        description="Step-by-step wizard with typed terms, HTML preview, and print modes."
        actionHref="/contracts/new"
        actionLabel="New contract"
      />
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Signed</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>Loading…</TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>No contracts yet.</TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.contractNumber}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.contractType}</Badge>
                  </TableCell>
                  <TableCell>{item.totalAmount ?? item.monthlyAmount ?? "—"}</TableCell>
                  <TableCell>{item.commissionAmount ?? "—"}</TableCell>
                  <TableCell>
                    {item.signedAt
                      ? new Date(item.signedAt).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/contracts/${item.id}`}>Open</Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => void onDelete(item.id)}
                    >
                      Delete
                    </Button>
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
