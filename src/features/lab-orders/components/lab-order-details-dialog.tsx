"use client";

import {
  Beaker,
  Clipboard,
  FileText,
  FlaskConical,
  Hash,
  ReceiptText,
  Stethoscope,
  User,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { LabOrderResponse } from "../types/lab-order.types";

interface Props {
  labOrder: LabOrderResponse | null;
  labOrders?: LabOrderResponse[];
  onSelectLabOrder?: (order: LabOrderResponse) => void;
  onClose: () => void;
}

function formatMoney(value: number | string) {
  return `LKR ${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function deriveOrderStatus(order: LabOrderResponse): string {
  const statuses = (order.items || [])
    .map((item) => item.status?.trim().toUpperCase())
    .filter(Boolean);

  if (!statuses.length) return "PENDING";
  if (statuses.every((status) => status === "COMPLETED")) return "COMPLETED";
  if (statuses.some((status) => status === "IN_PROGRESS")) return "IN_PROGRESS";
  return statuses[0] || "PENDING";
}

function getStatusClasses(status: string) {
  const normalized = status.trim().toUpperCase();

  if (normalized === "COMPLETED") {
    return "bg-green-100 text-green-700 border-green-200";
  }

  if (normalized === "IN_PROGRESS") {
    return "bg-blue-100 text-blue-700 border-blue-200";
  }

  if (normalized === "CANCELLED") {
    return "bg-red-100 text-red-700 border-red-200";
  }

  return "bg-yellow-100 text-yellow-700 border-yellow-200";
}

export function LabOrderDetailsDialog({
  labOrder,
  labOrders = [],
  onSelectLabOrder,
  onClose,
}: Props) {
  if (!labOrder) return null;

  const derivedStatus = deriveOrderStatus(labOrder);

  return (
    <Dialog open={!!labOrder} onOpenChange={onClose}>
      <DialogContent className="boxwidth">
        <DialogHeader className="px-6 py-5">
          <DialogTitle className="text-xl font-normal">
            Lab Order Details
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[80vh] overflow-y-auto px-6 py-5">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/50 p-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Lab Order Reference
              </p>
              <p className="text-lg">{labOrder.labOrderId}</p>
            </div>

            <Badge
              variant="outline"
              className={`rounded-full px-3 py-1 text-xs font-normal ${getStatusClasses(derivedStatus)}`}
            >
              {derivedStatus}
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <InfoItem
              icon={<Hash className="h-4 w-4" />}
              label="Appointment"
              value={String(labOrder.appointmentId)}
            />

            <InfoItem
              icon={<Clipboard className="h-4 w-4" />}
              label="Items"
              value={`${labOrder.items.length} test${labOrder.items.length === 1 ? "" : "s"}`}
            />

            <InfoItem
              icon={<FlaskConical className="h-4 w-4" />}
              label="Laboratory"
              value={labOrder.laboratoryName}
            />

            <InfoItem
              icon={<User className="h-4 w-4" />}
              label="Patient"
              value={labOrder.patientName}
            />

            <InfoItem
              icon={<Stethoscope className="h-4 w-4" />}
              label="Doctor"
              value={labOrder.doctorName}
            />

            <InfoItem
              icon={<Beaker className="h-4 w-4" />}
              label="Lab Order ID"
              value={String(labOrder.labOrderId)}
            />
          </div>

          <div className="mt-5 rounded-xl border bg-card p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              Notes
            </div>
            <p className="text-sm">
              Detailed test item pricing and status are listed below for this
              lab order.
            </p>
          </div>

          <div className="mt-5 rounded-xl border bg-card p-4">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <ReceiptText className="h-4 w-4" />
              Ordered Tests
            </div>

            <Table className="table-dark-border">
              <TableHeader>
                <TableRow className="table-header-row">
                  <TableHead className="tableHead table-head-text">
                    Test
                  </TableHead>
                  <TableHead className="tableHead table-head-text">
                    Quantity
                  </TableHead>
                  <TableHead className="tableHead table-head-text">
                    Unit Price
                  </TableHead>
                  <TableHead className="tableHead table-head-text">
                    Total
                  </TableHead>
                  <TableHead className="tableHead table-head-text">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labOrder.items.map((item) => (
                  <TableRow
                    key={item.labOrderItemId}
                    className="table-row-hover"
                  >
                    <TableCell>{item.testName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatMoney(item.unitPrice)}</TableCell>
                    <TableCell>{formatMoney(item.totalPrice)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusClasses(item.status)}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {labOrders.length > 1 && onSelectLabOrder ? (
            <div className="mt-5 rounded-xl border bg-card p-4">
              <div className="mb-3 text-sm text-muted-foreground">
                Other Lab Orders
              </div>
              <div className="flex flex-wrap gap-2">
                {labOrders.map((order) => (
                  <Button
                    key={order.labOrderId}
                    type="button"
                    size="sm"
                    variant={
                      order.labOrderId === labOrder.labOrderId
                        ? "default"
                        : "outline"
                    }
                    onClick={() => onSelectLabOrder(order)}
                  >
                    {order.labOrderId}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="text-sm">{value}</p>
    </div>
  );
}
