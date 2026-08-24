import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function PageHeader({
  title,
  description,
  actionHref,
  actionLabel,
  actions,
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  actions?: ReactNode;
}) {
  const showPrimary = Boolean(actionHref && actionLabel);
  const showActions = Boolean(actions) || showPrimary;

  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div className="max-w-2xl space-y-1.5">
        <h1 className="font-heading text-2xl font-semibold leading-snug md:text-[1.75rem]">
          {title}
        </h1>
        {description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {showActions ? (
        <div className="flex flex-wrap items-center gap-2">
          {actions}
          {showPrimary ? (
            <Button asChild>
              <Link href={actionHref!}>{actionLabel}</Link>
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
