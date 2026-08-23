"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { useAuth } from "@/components/providers/auth-provider";
import { usersApi } from "@/lib/api";
import type { User, UserRole } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { USER_ROLES } from "@/lib/examples";
import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function emptyToUndefined(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export default function UsersPage() {
  const { user, hasRole } = useAuth();
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password123");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<UserRole>("AGENT");
  const [organizationId, setOrganizationId] = useState("");

  async function load() {
    setLoading(true);
    try {
      setItems(await usersApi.list());
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  if (!hasRole("ADMIN", "OWNER")) {
    return (
      <p className="text-sm text-muted-foreground">
        You do not have access to user management.
      </p>
    );
  }

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await usersApi.create({
        email,
        password,
        firstName,
        lastName,
        role,
        organizationId:
          hasRole("ADMIN") && role !== "ADMIN"
            ? emptyToUndefined(organizationId) ?? user?.organizationId ?? undefined
            : undefined,
      });
      toast.success("User created");
      setEmail("");
      setFirstName("");
      setLastName("");
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Create failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this user?")) return;
    try {
      await usersApi.remove(id);
      toast.success("User deleted");
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Delete failed");
    }
  }

  return (
    <div>
      <PageHeader
        title="Users"
        description="ADMIN and OWNER can create employees."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Create user</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={onCreate}>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label>First name</Label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Last name</Label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as UserRole)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLES.filter((r) =>
                    hasRole("ADMIN") ? true : r !== "ADMIN",
                  ).map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {hasRole("ADMIN") && role !== "ADMIN" ? (
              <div className="space-y-2">
                <Label>Organization id</Label>
                <Input
                  value={organizationId}
                  onChange={(e) => setOrganizationId(e.target.value)}
                  placeholder="Required when ADMIN creates org users"
                  required
                />
              </div>
            ) : null}
            <div className="md:col-span-2">
              <Button disabled={submitting} type="submit">
                {submitting ? "Creating…" : "Create user"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4}>Loading…</TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.firstName} {item.lastName}
                  </TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.role}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
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
