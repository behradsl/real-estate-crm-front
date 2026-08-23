"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { partiesApi } from "@/lib/api";
import type { Party } from "@/lib/api/types";
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

function partyLabel(party: Party) {
  if (party.type === "COMPANY") {
    return party.companyName ?? "Company";
  }
  return [party.firstName, party.lastName].filter(Boolean).join(" ") || "Person";
}

export default function PartiesPage() {
  const [items, setItems] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setItems(await partiesApi.list());
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
    if (!confirm("Soft-delete this party?")) return;
    try {
      await partiesApi.remove(id);
      toast.success("Party deleted");
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Delete failed");
    }
  }

  return (
    <div>
      <PageHeader
        title="Parties"
        description="People and companies used on contracts."
        actionHref="/parties/new"
        actionLabel="New party"
      />
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>National / economic</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5}>Loading…</TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>No parties yet.</TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{partyLabel(item)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.type}</Badge>
                  </TableCell>
                  <TableCell>
                    {item.nationalCode ?? item.economicCode ?? "—"}
                  </TableCell>
                  <TableCell>{item.phone ?? "—"}</TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/parties/${item.id}`}>Open</Link>
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
