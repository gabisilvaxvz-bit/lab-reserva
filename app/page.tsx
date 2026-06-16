"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import { Calendar } from "@/components/Calendar";
import { ReservationList } from "@/components/ReservationList";
import { ReservationModal } from "@/components/ReservationModal";
import { Reservation } from "@/lib/constants";
import toast from "react-hot-toast";

export default function ReservaLaboratorios() {
  const [isLoading, setIsLoading] = useState(false);
  // Novo estado para controlar o carregamento inicial dos dados da API
  const [isLoadingData, setIsLoadingData] = useState(true);

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
  
  // Removido o dado estático, iniciando com array vazio
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Busca as reservas do banco de dados ao carregar a página
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('/api/reservations');
        const result = await response.json();

        if (response.ok) {
          setReservations(result.data);
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
  const handleAddReservation = async (newResData: Omit<Reservation, "id">) => {
    setIsLoading(true); // Inicia o estado de carregamento

    try {
      // 1. Faz a requisição POST para a sua API
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newResData),
      });

      // 2. Converte a resposta para JSON
      const result = await response.json();

      // 3. Verifica se a API retornou algum erro (status 400 ou 500)
      if (!response.ok) {
        throw new Error(result.error || 'Erro desconhecido ao criar reserva.');
      }

      // 4. Se sucesso, adiciona a reserva retornada pelo banco ao estado local
      setReservations(prev => 
        [...prev, result.data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      );
      
      setIsModalOpen(false);
      toast.success("Reserva confirmada com sucesso!"); 

    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error(error instanceof Error ? error.message : "Ocorreu um erro ao comunicar com o servidor.");
    } finally {
      setIsLoading(false); // Finaliza o estado de carregamento independente de dar erro ou sucesso
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

        {/* Exibe o estado de carregamento ou o conteúdo principal */}
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