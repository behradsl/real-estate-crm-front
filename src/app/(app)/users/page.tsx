"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { useAuth } from "@/components/providers/auth-provider";
import { usersApi } from "@/lib/api";
import type { User, UserRole } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { USER_ROLES } from "@/lib/examples";
import { messages, userRoleLabels } from "@/lib/labels";
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<UserRole>("AGENT");
  const [organizationId, setOrganizationId] = useState("");

  async function load() {
    setLoading(true);
    try {
      setItems(await usersApi.list());
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : messages.loadFailed);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  if (!hasRole("ADMIN", "OWNER")) {
    return (
      <p className="text-sm leading-relaxed text-muted-foreground">
        به بخش مدیریت کاربران دسترسی ندارید.
      </p>
    );
  }

  function resetForm() {
    setEditingId(null);
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setRole("AGENT");
    setOrganizationId("");
  }

  function startEdit(item: User) {
    setEditingId(item.id);
    setEmail(item.email);
    setPassword("");
    setFirstName(item.firstName);
    setLastName(item.lastName);
    setRole(item.role);
    setOrganizationId(item.organizationId ?? "");
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await usersApi.update(editingId, {
          email,
          firstName,
          lastName,
          role,
          password: emptyToUndefined(password),
        });
        toast.success("تغییرات کاربر ذخیره شد");
      } else {
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
        toast.success("کاربر ثبت شد");
      }
      resetForm();
      await load();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : editingId
            ? messages.saveFailed
            : messages.createFailed,
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("این کاربر حذف شود؟")) return;
    try {
      await usersApi.remove(id);
      toast.success("کاربر حذف شد");
      if (editingId === id) resetForm();
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : messages.deleteFailed);
    }
  }

  return (
    <div>
      <PageHeader
        title="کاربران"
        description="مدیر سامانه و مالک آژانس می‌توانند کارکنان را ثبت کنند."
      />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingId ? "ویرایش کاربر" : "ثبت کاربر"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-5 md:grid-cols-2" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label>ایمیل</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>
                {editingId ? "رمز عبور جدید (اختیاری)" : "رمز عبور"}
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!editingId}
                minLength={editingId ? undefined : 8}
              />
            </div>
            <div className="space-y-2">
              <Label>نام</Label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>نام خانوادگی</Label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>نقش</Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as UserRole)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLES.filter((r) =>
                    hasRole("ADMIN") ? true : r !== "ADMIN",
                  ).map((r) => (
                    <SelectItem key={r} value={r}>
                      {userRoleLabels[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!editingId && hasRole("ADMIN") && role !== "ADMIN" ? (
              <div className="space-y-2">
                <Label>شناسه سازمان</Label>
                <Input
                  value={organizationId}
                  onChange={(e) => setOrganizationId(e.target.value)}
                  placeholder="برای ایجاد کاربر آژانس الزامی است"
                  required
                  dir="ltr"
                />
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2 md:col-span-2">
              <Button disabled={submitting} type="submit">
                {submitting
                  ? messages.saving
                  : editingId
                    ? messages.save
                    : "ثبت کاربر"}
              </Button>
              {editingId ? (
                <Button type="button" variant="outline" onClick={resetForm}>
                  انصراف
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام</TableHead>
              <TableHead>ایمیل</TableHead>
              <TableHead>نقش</TableHead>
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
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.firstName} {item.lastName}
                  </TableCell>
                  <TableCell dir="ltr">{item.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{userRoleLabels[item.role]}</Badge>
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => startEdit(item)}
                      >
                        {messages.edit}
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
