"use client";

import Link from "next/link";
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
    title: "Properties",
    description: "Register listings with address, facilities, and deed info.",
  },
  {
    href: "/parties",
    title: "Parties",
    description: "People and companies that appear on contracts.",
  },
  {
    href: "/contracts",
    title: "Contracts",
    description: "Create typed contracts with terms JSON and signatures.",
  },
];

export default function DashboardPage() {
  const { user, hasRole } = useAuth();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user?.firstName ?? ""}.`}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {links.map((link) => (
          <Card key={link.href}>
            <CardHeader>
              <CardTitle className="text-lg">{link.title}</CardTitle>
              <CardDescription>{link.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href={link.href}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasRole("ADMIN") ? (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Admin</CardTitle>
            <CardDescription>
              Create organizations and owners to onboard agencies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/organizations/new">Create organization</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
