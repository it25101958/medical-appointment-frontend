"use client";

import { useCallback, useDeferredValue, useMemo, useState } from "react";
import {
  DataTable,
  StatusBadge,
  type Column,
  SearchBar,
} from "@/components/ui";
import { highlightText } from "@/lib/highlight-search";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";
import { PrescriptionDetailsDialog } from "./prescription-details-dialog";
import {
  getPrescription,
  type PrescriptionResponse,
} from "@/features/prescriptions";
import { formatDate } from "@/features/shared/util/format-date";

interface PrescriptionListItem {
  prescriptionId: number;
  appointmentId: number;
  patientName: string;
  doctorName: string;
  status: string;
  createdAt: string;
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function PrescriptionList({
  data = [],
  showSearch = true,
}: {
  data: PrescriptionListItem[];
  showSearch?: boolean;
}) {
  const [selectedPrescription, setSelectedPrescription] =
    useState<PrescriptionResponse | null>(null);
  const [loadingPrescriptionId, setLoadingPrescriptionId] = useState<
    number | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");

  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredPrescriptions = useMemo(() => {
    const query = normalize(deferredSearchQuery);
    if (!query) return data;
    return data.filter((prescription) => {
      const haystack = [
        prescription.prescriptionId?.toString(),
        prescription.appointmentId?.toString(),
        prescription.patientName,
        prescription.doctorName,
        prescription.status,
        prescription.createdAt,
        formatDate(prescription.createdAt),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [deferredSearchQuery, data]);

  const viewPrescription = useCallback(
    async (prescription: PrescriptionListItem) => {
      setLoadingPrescriptionId(prescription.prescriptionId);
      try {
        const details = await getPrescription(prescription.prescriptionId);

        setSelectedPrescription(details);
      } catch (error) {
        toast.error(getErrorMessage(error, "Could not load prescription"));
      } finally {
        setLoadingPrescriptionId(null);
      }
    },
    [],
  );

  const columns: Column<PrescriptionListItem>[] = useMemo(
    () => [
      {
        header: "ID",
        render: (p) => (
          <button
            type="button"
            className="cursor-pointer text-left font-semibold hover:text-primary hover:underline disabled:cursor-wait disabled:no-underline"
            onClick={() => viewPrescription(p)}
            disabled={loadingPrescriptionId === p.prescriptionId}
          >
            {loadingPrescriptionId === p.prescriptionId
              ? "Loading..."
              : highlightText(
                  p.prescriptionId?.toString() || "",
                  deferredSearchQuery,
                )}
          </button>
        ),
        className: "w-[120px] px-5 py-4 font-semibold text-foreground",
      },
      {
        header: "Appointment",
        render: (p) =>
          highlightText(p.appointmentId?.toString() || "", deferredSearchQuery),
      },
      {
        header: "Patient",
        render: (p) => highlightText(p.patientName || "", deferredSearchQuery),
      },
      {
        header: "Practitioner",
        render: (p) => highlightText(p.doctorName || "", deferredSearchQuery),
      },
      {
        header: "Status",
        render: (p: PrescriptionListItem) => <StatusBadge status={p.status} />,
      },
      {
        header: "Created At",
        render: (p: PrescriptionListItem) =>
          highlightText(formatDate(p.createdAt), deferredSearchQuery),
        className: "w-[190px] text-muted-foreground",
      },
    ],
    [deferredSearchQuery, loadingPrescriptionId, viewPrescription],
  );

  return (
    <>
      {showSearch && (
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by prescription, appointment, patient, doctor, or status"
          resultCount={filteredPrescriptions.length}
        />
      )}

      <div
        className={`overflow-hidden rounded-lg border border-border bg-card ${
          showSearch ? "mt-6" : ""
        }`}
      >
        <DataTable
          columns={columns}
          data={filteredPrescriptions}
          pageable={true}
          pageSize={10}
          pageSizeOptions={[5, 10, 50]}
          showActions={false}
          minWidth="980px"
          emptyMessage={
            loadingPrescriptionId
              ? `Loading prescription ${loadingPrescriptionId}...`
              : "No prescriptions found."
          }
        />
      </div>

      <PrescriptionDetailsDialog
        prescription={selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
      />
    </>
  );
}
