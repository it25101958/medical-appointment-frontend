import type { DayOfWeek } from "../types/room-schedule.types";

export function formatDayOfWeek(day?: DayOfWeek | string | null) {
  if (!day) return "-";

  const normalized = day.toLowerCase().replace(/_/g, " ");
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}
