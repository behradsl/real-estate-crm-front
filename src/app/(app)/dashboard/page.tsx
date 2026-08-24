"use client";

import Link from "next/link";
import {
  Building2,
  ChevronLeft,
  FileText,
  Home,
  UserSquare2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const links = [
  {
    href: "/properties",
    title: "املاک",
    description: "ثبت و مدیریت فایل‌ها با نشانی، امکانات و مشخصات سند.",
    icon: Home,
  },
  {
    href: "/parties",
    title: "طرفین قرارداد",
    description: "اشخاص حقیقی و حقوقی که در مبایعه‌نامه یا رهن و اجاره حضور دارند.",
    icon: UserSquare2,
  },
  {
    href: "/contracts",
    title: "قراردادها",
    description: "تنظیم قرارداد با شرایط مالی، امضا و پیش‌نمایش چاپی.",
    icon: FileText,
  },
];

export default function DashboardPage() {
  const { user, hasRole } = useAuth();

  return (
    <div>
      <PageHeader
        title="داشبورد"
        description={
          user?.firstName
            ? `${user.firstName} عزیز، خوش آمدید.`
            : "به سامانه مدیریت املاک خوش آمدید."
        }
      />

      <div className="grid gap-5 md:grid-cols-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Card key={link.href} className="transition-shadow hover:shadow-md">
              <CardHeader className="space-y-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="text-lg">{link.title}</CardTitle>
                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline">
                  <Link href={link.href} className="gap-1.5">
                    ورود
                    <ChevronLeft className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {hasRole("ADMIN") ? (
        <Card className="mt-5">
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="size-5" />
            </div>
            <CardTitle className="text-lg">مدیریت سامانه</CardTitle>
            <CardDescription>
              برای راه‌اندازی آژانس جدید، سازمان و حساب مالک را یکجا ایجاد کنید.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/organizations/new">ثبت آژانس جدید</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
