import { AVAILABLE_HOURS, LABORATORIES, type Reservation } from "@/lib/constants";

export type ReservationInput = Omit<Reservation, "id">;
export type LabId = (typeof LABORATORIES)[number]["id"];
export type LabFilter = "todos" | LabId;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function formatLocalDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatBrazilianDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");

  return `${day}/${month}/${year}`;
}

export function isLabId(value: string): value is LabId {
  return LABORATORIES.some((lab) => lab.id === value);
}

export function isValidDateInput(value: string): boolean {
  return DATE_PATTERN.test(value);
}

export function isValidHour(value: string): boolean {
  return AVAILABLE_HOURS.includes(value);
}

export function isValidTimeRange(startTime: string, endTime: string): boolean {
  return startTime < endTime;
}

export function sortReservationsByDateAndTime(reservations: Reservation[]): Reservation[] {
  return [...reservations].sort((a, b) => {
    const dateComparison = a.date.localeCompare(b.date);

    if (dateComparison !== 0) {
      return dateComparison;
    }

    return a.startTime.localeCompare(b.startTime);
  });
}

