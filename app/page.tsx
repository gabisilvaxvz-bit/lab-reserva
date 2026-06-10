"use client";

import React, { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Calendar } from "@/components/Calendar";
import { ReservationList } from "@/components/ReservationList";
import { ReservationModal } from "@/components/ReservationModal";
import { Reservation } from "@/lib/constants";

export default function ReservaLaboratorios() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const todayString = today.toISOString().split("T")[0];

  // Estados Globais
  const [selectedLabFilter, setSelectedLabFilter] = useState<string | "todos">("todos");
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: "1",
      requesterName: "Prof. Silva",
      labId: "informatica",
      date: "2026-06-12",
      startTime: "09:00",
      endTime: "11:00",
    }
  ]);

  // Filtragem de Reservas para a Sidebar
  const upcomingReservations = useMemo(() => {
    let filtered = reservations.filter(r => new Date(r.date).getTime() >= today.getTime());
    
    if (selectedLabFilter !== "todos") {
      filtered = filtered.filter(r => r.labId === selectedLabFilter);
    }
    
    if (selectedCalendarDate) {
      const selectedDateString = `${selectedCalendarDate.getFullYear()}-${(selectedCalendarDate.getMonth() + 1).toString().padStart(2, "0")}-${selectedCalendarDate.getDate().toString().padStart(2, "0")}`;
      filtered = filtered.filter(r => r.date === selectedDateString);
    }

    return filtered;
  }, [reservations, selectedLabFilter, selectedCalendarDate, today]);

  // Handler para adicionar nova reserva vinda do modal
  const handleAddReservation = (newResData: Omit<Reservation, "id">) => {
    const newReservation: Reservation = {
      id: Math.random().toString(36).substr(2, 9),
      ...newResData,
    };
    
    setReservations(prev => 
      [...prev, newReservation].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    );
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans text-foreground">
      <div className="max-w-7xl mx-auto">
        
        <Header 
          selectedFilter={selectedLabFilter} 
          onSelectFilter={setSelectedLabFilter} 
          onOpenModal={() => setIsModalOpen(true)} 
        />

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

        <ReservationModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleAddReservation} 
          todayString={todayString}
        />

      </div>
    </div>
  );
}