import Link from "next/link";
import type { RelatedContract } from "@/lib/api/types";
import { formatDate } from "@/lib/format";
import {
  contractPartyRoleLabels,
  contractTypeLabels,
  messages,
} from "@/lib/labels";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RelatedContractsCard({
  contracts,
  showRole = false,
}: {
  contracts?: RelatedContract[];
  showRole?: boolean;
}) {
  const rows = contracts ?? [];

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>قراردادها</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            قراردادی برای این مورد ثبت نشده است.
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>شماره</TableHead>
                  <TableHead>نوع</TableHead>
                  {showRole ? <TableHead>نقش</TableHead> : null}
                  <TableHead>مبلغ</TableHead>
                  <TableHead>امضا</TableHead>
                  <TableHead className="text-end">{messages.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium" dir="ltr">
                      {contract.contractNumber}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {contractTypeLabels[contract.contractType]}
                      </Badge>
                    </TableCell>
                    {showRole ? (
                      <TableCell>
                        {contract.role
                          ? contractPartyRoleLabels[contract.role]
                          : messages.none}
                      </TableCell>
                    ) : null}
                    <TableCell dir="ltr">
                      {contract.totalAmount ??
                        contract.monthlyAmount ??
                        messages.none}
                    </TableCell>
                    <TableCell>{formatDate(contract.signedAt)}</TableCell>
                    <TableCell className="text-end">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/contracts/${contract.id}`}>
                          {messages.open}
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
