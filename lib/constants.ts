// lib/constants.ts

export type Reservation = {
  id: string;
  requesterName: string;
  labId: string;
  date: string;
  startTime: string;
  endTime: string;
};

export const LABORATORIES = [
  { id: "quimica", name: "Química", color: "bg-blue-500" },
  { id: "informatica", name: "Informática", color: "bg-purple-500" },
  { id: "matematica", name: "Matemática", color: "bg-emerald-500" },
  { id: "linguas", name: "Línguas", color: "bg-amber-500" },
];

export const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export const generateHours = () => {
  const hours = [];
  for (let i = 7; i <= 22; i++) {
    hours.push(`${i.toString().padStart(2, "0")}:00`);
  }
  return hours;
};

export const AVAILABLE_HOURS = generateHours();