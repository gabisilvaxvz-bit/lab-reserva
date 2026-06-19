"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Calendar } from "@/components/Calendar";
import { ReservationList } from "@/components/ReservationList";
import { ReservationModal } from "@/components/ReservationModal";
import { Reservation } from "@/lib/constants";
import type { LabFilter } from "@/lib/reservations";
import {
  formatLocalDateInput,
  sortReservationsByDateAndTime,
} from "@/lib/reservations";
import toast from "react-hot-toast";

export default function ReservaLaboratorios() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const today = useMemo(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return currentDate;
  }, []);
  const todayString = formatLocalDateInput(today);

  const [selectedLabFilter, setSelectedLabFilter] = useState<LabFilter>("todos");
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("/api/reservations");
        const result = await response.json();

        if (response.ok) {
          setReservations(sortReservationsByDateAndTime(result.data));
        } else {
          toast.error(result.error || "Erro ao carregar as reservas.");
        }
      } catch (error) {
        console.error("Erro de conexão:", error);
        toast.error("Erro de conexão ao buscar reservas do banco.");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchReservations();
  }, []);

  const upcomingReservations = useMemo(() => {
    let filtered = reservations.filter((reservation) => reservation.date >= todayString);

    if (selectedLabFilter !== "todos") {
      filtered = filtered.filter((reservation) => reservation.labId === selectedLabFilter);
    }

    if (selectedCalendarDate) {
      const selectedDateString = formatLocalDateInput(selectedCalendarDate);
      filtered = filtered.filter((reservation) => reservation.date === selectedDateString);
    }

    return filtered;
  }, [reservations, selectedLabFilter, selectedCalendarDate, todayString]);

  const handleAddReservation = async (newResData: Omit<Reservation, "id">) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/reservations", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newResData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro desconhecido ao criar reserva.");
      }

      setReservations((previousReservations) =>
        sortReservationsByDateAndTime([...previousReservations, result.data]),
      );

      setIsModalOpen(false);
      toast.success("Reserva confirmada com sucesso!"); 

    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error(error instanceof Error ? error.message : "Ocorreu um erro ao comunicar com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans text-foreground">
      <div className="max-w-7xl mx-auto">
        
        <Header 
          selectedFilter={selectedLabFilter} 
          onSelectFilter={setSelectedLabFilter} 
          onOpenModal={() => setIsModalOpen(true)} 
        />

        {isLoadingData ? (
          <div className="flex items-center justify-center h-[50vh]">
            <p className="text-muted-foreground animate-pulse text-lg font-medium">
              A carregar reservas do sistema...
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <Calendar 
                currentMonth={currentMonth}
                onPrevMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                onNextMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                selectedDate={selectedCalendarDate}
                onSelectDate={setSelectedCalendarDate}
                reservations={reservations}
                today={today}
              />
            </div>

            <div className="w-full lg:w-[400px]">
              <ReservationList 
                reservations={upcomingReservations} 
                selectedDate={selectedCalendarDate} 
              />
            </div>
          </div>
        )}

        <ReservationModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleAddReservation} 
          todayString={todayString}
          isLoading={isLoading}
        />

      </div>
    </div>
  );
}
