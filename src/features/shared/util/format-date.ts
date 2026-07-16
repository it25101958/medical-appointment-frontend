type DateInput = Date | string | number | null | undefined;

const EMPTY_VALUE = "-";

function toDate(value: DateInput) {
  if (!value) return null;

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateTime(value: DateInput) {
  const date = toDate(value);

  if (!date) return EMPTY_VALUE;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatDateOnly(value: DateInput) {
  const date = toDate(value);

  if (!date) return EMPTY_VALUE;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatTime(value?: string | null) {
  if (!value) return EMPTY_VALUE;

  const date = toDate(`1970-01-01T${value}`);

  if (!date) return EMPTY_VALUE;

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatAppointmentDateTime(
  date?: string | null,
  time?: string | null,
) {
  if (date && time) {
    return formatDateTime(`${date}T${time}`);
  }

  if (date) return formatDateOnly(date);
  if (time) return formatTime(time);

  return EMPTY_VALUE;
}

export function formatDate(value?: string) {
  return formatDateTime(value);
}
