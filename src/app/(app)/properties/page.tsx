"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { propertiesApi } from "@/lib/api";
import type { Property } from "@/lib/api/types";
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

export default function PropertiesPage() {
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setItems(await propertiesApi.list());
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
    if (!confirm("Soft-delete this property?")) return;
    try {
      await propertiesApi.remove(id);
      toast.success("Property deleted");
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Delete failed");
    }
  }

  return (
    <div>
      <PageHeader
        title="Properties"
        description="Organization listings with deed and facilities JSON."
        actionHref="/properties/new"
        actionLabel="New property"
      />

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Ref</TableHead>
              <TableHead>Area</TableHead>
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
                <TableCell colSpan={5}>No properties yet.</TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.propertyType}</Badge>
                  </TableCell>
                  <TableCell>{item.referenceCode ?? "—"}</TableCell>
                  <TableCell>
                    {item.areaSqm != null ? `${item.areaSqm} m²` : "—"}
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/properties/${item.id}`}>Open</Link>
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
