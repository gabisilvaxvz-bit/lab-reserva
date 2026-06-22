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
  { id: "eletromecanica", name: "Eletromecânica", color: "bg-blue-500" },
  { id: "hardwere", name: "Hardwere", color: "bg-purple-500" },
  { id: "datashows", name: "Datashows", color: "bg-emerald-500" },
];

export const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export const generateHours = () => {
  const hours = [];

  let hour = 7;
  let minute = 10;

  while (hour < 16 || (hour === 16 && minute <= 40)) {
    hours.push(
      `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`
    );

    minute += 10; // intervalo de 10 minutos

    if (minute === 60) {
      minute = 0;
      hour++;
    }
  }

  return hours;
};

export const AVAILABLE_HOURS = generateHours();