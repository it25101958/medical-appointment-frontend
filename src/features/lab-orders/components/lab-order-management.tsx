"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Edit3,
  Eye,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { DeleteConfirmDialog } from "@/features/shared";
import { getLaboratories, type Laboratory } from "@/features/laboratory";
import { getActiveLabTests, type LabTest } from "@/features/labtest";
import { getErrorMessage } from "@/lib/utils";
import { labOrderApi } from "../api/lab-order.api";
import {
  labOrderSchema,
  type LabOrderValues,
} from "../schemas/lab-order.schema";
import { LabOrderResponse } from "../types/lab-order.types";

type DraftItem = {
  labTestId: number;
  quantity: number;
};

type OrderStatusFilter = "ALL" | "PENDING" | "IN_PROGRESS" | "COMPLETED";

const statusFilters: Array<{ value: OrderStatusFilter; label: string }> = [
  { value: "ALL", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

function createEmptyForm(): LabOrderValues {
  return {
    appointmentId: 0,
    laboratoryId: 0,
    items: [{ labTestId: 0, quantity: 1 }],
  };
}

function formatMoney(value: number | string) {
  return `LKR ${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getStatusClasses(status: string) {
  const normalized = status.toUpperCase();

  if (normalized === "COMPLETED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (normalized === "IN_PROGRESS") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function orderTotal(order: LabOrderResponse) {
  return order.items.reduce(
    (sum, item) => sum + Number(item.totalPrice || 0),
    0,
  );
}

function allRequiredFieldsSet(formValues: LabOrderValues) {
  return (
    Number(formValues.appointmentId) > 0 &&
    Number(formValues.laboratoryId) > 0 &&
    formValues.items.length > 0 &&
    formValues.items.every(
      (item) => Number(item.labTestId) > 0 && Number(item.quantity) > 0,
    )
  );
}

export function LabOrderManagement() {
  const [orders, setOrders] = useState<LabOrderResponse[]>([]);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<LabOrderResponse | null>(
    null,
  );
  const [formValues, setFormValues] =
    useState<LabOrderValues>(createEmptyForm());
  const [patientIdFilter, setPatientIdFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("ALL");
  const [dateFilter, setDateFilter] = useState("");

  const labTestById = useMemo(() => {
    return new Map(labTests.map((test) => [test.id, test]));
  }, [labTests]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    setLoading(true);
    try {
      const [ordersData, laboratoriesData, labTestsData] = await Promise.all([
        labOrderApi.search(),
        getLaboratories(),
        getActiveLabTests(),
      ]);

      setOrders(ordersData || []);
      setLaboratories(laboratoriesData || []);
      setLabTests(labTestsData || []);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not load lab orders"));
    } finally {
      setLoading(false);
    }
  }

  async function searchOrders() {
    setLoading(true);
    try {
      const data = await labOrderApi.search({
        patientId: patientIdFilter ? Number(patientIdFilter) : undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        date: dateFilter || undefined,
      });

      setOrders(data || []);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not search lab orders"));
    } finally {
      setLoading(false);
    }
  }

  function openCreateDialog() {
    setSelectedOrder(null);
    setFormValues(createEmptyForm());
    setDialogOpen(true);
  }

  function openEditDialog(order: LabOrderResponse) {
    const matchedLaboratory = laboratories.find(
      (laboratory) => laboratory.name === order.laboratoryName,
    );

    setSelectedOrder(order);
    setFormValues({
      appointmentId: order.appointmentId,
      laboratoryId: matchedLaboratory?.laboratoryId || 0,
      items: order.items.map((item) => ({
        labTestId: item.labTestId,
        quantity: item.quantity,
      })),
    });
    setDialogOpen(true);
  }

  function openDetailsDialog(order: LabOrderResponse) {
    setSelectedOrder(order);
    setDetailsOpen(true);
  }

  function openDeleteDialog(order: LabOrderResponse) {
    setSelectedOrder(order);
    setDeleteOpen(true);
  }

  function updateItem(index: number, patch: Partial<DraftItem>) {
    setFormValues((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    }));
  }

  function addItem() {
    setFormValues((current) => ({
      ...current,
      items: [...current.items, { labTestId: 0, quantity: 1 }],
    }));
  }

  function removeItem(index: number) {
    setFormValues((current) => ({
      ...current,
      items:
        current.items.length === 1
          ? current.items
          : current.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function saveOrder() {
    const parsed = labOrderSchema.safeParse(formValues);

    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message || "Check lab order details");
      return;
    }

    setSaving(true);
    try {
      if (selectedOrder) {
        await labOrderApi.update(selectedOrder.labOrderId, parsed.data);
        toast.success("Lab order updated successfully.");
      } else {
        await labOrderApi.create(parsed.data);
        toast.success("Lab order created successfully.");
      }

      setDialogOpen(false);
      setSelectedOrder(null);
      setFormValues(createEmptyForm());
      await searchOrders();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not save lab order"));
    } finally {
      setSaving(false);
    }
  }

  async function deleteOrder() {
    if (!selectedOrder) return;

    setDeleting(true);
    try {
      await labOrderApi.remove(selectedOrder.labOrderId);
      toast.success("Lab order deleted successfully.");
      setDeleteOpen(false);
      setSelectedOrder(null);
      await searchOrders();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not delete lab order"));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="col-start-1 col-end-14 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-md border border-border/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <ClipboardList className="h-3.5 w-3.5" />
            Laboratory orders
          </div>
          <h1 className="text-2xl font-semibold">Lab Orders</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Create laboratory orders for appointments and manage ordered test
            items before processing begins.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={fetchInitialData}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            New Lab Order
          </Button>
        </div>
      </div>

      <Card className="border-border/60 bg-card/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Search orders
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[160px_180px_180px_auto] md:items-end">
          <div className="grid gap-2">
            <Label htmlFor="patient-filter">Patient ID</Label>
            <Input
              id="patient-filter"
              type="number"
              min={1}
              value={patientIdFilter}
              onChange={(event) => setPatientIdFilter(event.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as OrderStatusFilter)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusFilters.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date-filter">Date</Label>
            <Input
              id="date-filter"
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
            />
          </div>

          <Button onClick={searchOrders}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {loading ? (
          <Card className="border-border/60 bg-card/80">
            <CardContent className="p-6 text-sm text-muted-foreground">
              Loading lab orders...
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="border-border/60 bg-card/80">
            <CardContent className="p-6 text-sm text-muted-foreground">
              No lab orders found.
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card
              key={order.labOrderId}
              className="border-border/60 bg-card/80"
            >
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold">
                        Lab Order #{order.labOrderId}
                      </h2>
                      <Badge variant="outline">
                        Appointment #{order.appointmentId}
                      </Badge>
                    </div>
                    <div className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
                      <span>Patient: {order.patientName}</span>
                      <span>Doctor: {order.doctorName}</span>
                      <span>Laboratory: {order.laboratoryName}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="rounded-md border border-border/60 px-3 py-2 text-sm font-medium">
                      {formatMoney(orderTotal(order))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDetailsDialog(order)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(order)}
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => openDeleteDialog(order)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-md border border-border/60">
                  <div className="grid grid-cols-[minmax(0,1fr)_90px_130px_130px_120px] gap-3 bg-muted/40 px-4 py-2 text-xs font-medium uppercase text-muted-foreground">
                    <span>Test</span>
                    <span>Qty</span>
                    <span>Unit</span>
                    <span>Total</span>
                    <span>Status</span>
                  </div>
                  {order.items.map((item) => (
                    <div
                      key={item.labOrderItemId}
                      className="grid grid-cols-[minmax(0,1fr)_90px_130px_130px_120px] gap-3 border-t border-border/60 px-4 py-3 text-sm"
                    >
                      <span className="font-medium">{item.testName}</span>
                      <span>{item.quantity}</span>
                      <span>{formatMoney(item.unitPrice)}</span>
                      <span>{formatMoney(item.totalPrice)}</span>
                      <span>
                        <Badge
                          variant="outline"
                          className={getStatusClasses(item.status)}
                        >
                          {item.status}
                        </Badge>
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>
              {selectedOrder ? "Edit Lab Order" : "Create Lab Order"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-5 py-2">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="appointment-id">Appointment ID *</Label>
                <Input
                  id="appointment-id"
                  type="number"
                  min={1}
                  value={formValues.appointmentId || ""}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      appointmentId: Number(event.target.value),
                    }))
                  }
                  placeholder="Enter appointment ID"
                />
              </div>

              <div className="grid gap-2">
                <Label>Laboratory *</Label>
                <Select
                  value={
                    formValues.laboratoryId
                      ? String(formValues.laboratoryId)
                      : ""
                  }
                  onValueChange={(value) =>
                    setFormValues((current) => ({
                      ...current,
                      laboratoryId: Number(value),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a laboratory" />
                  </SelectTrigger>
                  <SelectContent>
                    {laboratories.map((laboratory) => (
                      <SelectItem
                        key={laboratory.laboratoryId}
                        value={String(laboratory.laboratoryId)}
                      >
                        {laboratory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label>Lab order items *</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addItem}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Test
                </Button>
              </div>

              {formValues.items.map((item, index) => {
                const selectedTest = labTestById.get(item.labTestId);
                const unitPrice = Number(selectedTest?.standardPrice || 0);
                const lineTotal = unitPrice * Number(item.quantity || 0);

                return (
                  <div
                    key={index}
                    className="grid gap-3 rounded-md border border-border/60 p-3 md:grid-cols-[minmax(0,1fr)_120px_140px_40px] md:items-end"
                  >
                    <div className="grid gap-2">
                      <Label>Lab test</Label>
                      <Select
                        value={item.labTestId ? String(item.labTestId) : ""}
                        onValueChange={(value) =>
                          updateItem(index, { labTestId: Number(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a test" />
                        </SelectTrigger>
                        <SelectContent>
                          {labTests.map((test) => (
                            <SelectItem key={test.id} value={String(test.id)}>
                              {test.testName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity || ""}
                        onChange={(event) =>
                          updateItem(index, {
                            quantity: Number(event.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Line total</Label>
                      <div className="rounded-md border border-border/60 px-3 py-2 text-sm font-medium">
                        {formatMoney(lineTotal)}
                      </div>
                    </div>

                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeItem(index)}
                      disabled={formValues.items.length === 1}
                      aria-label="Remove lab order item"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setSelectedOrder(null);
                setFormValues(createEmptyForm());
              }}
            >
              Cancel
            </Button>
            {allRequiredFieldsSet(formValues) && (
              <Button onClick={saveOrder} disabled={saving}>
                {saving
                  ? "Saving..."
                  : selectedOrder
                    ? "Update Lab Order"
                    : "Create Lab Order"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[780px]">
          <DialogHeader>
            <DialogTitle>Lab Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid gap-3 rounded-md border border-border/60 bg-muted/30 p-4 md:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Lab Order</p>
                  <p className="font-medium">#{selectedOrder.labOrderId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Appointment</p>
                  <p className="font-medium">#{selectedOrder.appointmentId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Patient</p>
                  <p className="font-medium">{selectedOrder.patientName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Laboratory</p>
                  <p className="font-medium">{selectedOrder.laboratoryName}</p>
                </div>
              </div>

              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.labOrderItemId}
                    className="rounded-md border border-border/60 p-3 text-sm"
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium">{item.testName}</p>
                        <p className="text-xs text-muted-foreground">
                          Item #{item.labOrderItemId} | Test #{item.labTestId}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={getStatusClasses(item.status)}
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="mt-3 grid gap-2 text-muted-foreground md:grid-cols-4">
                      <span>Qty: {item.quantity}</span>
                      <span>Unit: {formatMoney(item.unitPrice)}</span>
                      <span>Total: {formatMoney(item.totalPrice)}</span>
                      <span>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Lab Order"
        message="Are you sure you want to delete this lab order? Orders being processed by the lab cannot be deleted."
        deleting={deleting}
        onCancel={() => {
          setDeleteOpen(false);
          setSelectedOrder(null);
        }}
        onConfirm={deleteOrder}
        confirmLabel="Delete Lab Order"
      />
    </div>
  );
}
