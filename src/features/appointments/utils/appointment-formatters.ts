// Basic appointment formatting helpers
export function formatAppointmentDate(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString();
}

export function formatAppointmentTime(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatAppointmentDateTime(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  return `${formatAppointmentDate(d)} ${formatAppointmentTime(d)}`;
}

export default null;
