// components/ReservationModal.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LABORATORIES, AVAILABLE_HOURS, Reservation } from "@/lib/constants";
import { isValidTimeRange } from "@/lib/reservations";
import toast from "react-hot-toast";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reservation: Omit<Reservation, "id">) => Promise<void>;
  todayString: string;
  isLoading?: boolean;
}

export function ReservationModal({ isOpen, onClose, onSubmit, todayString, isLoading }: ReservationModalProps) {
  const [requester, setRequester] = useState("");
  const [lab, setLab] = useState(LABORATORIES[0].id);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const resetForm = () => {
    setRequester("");
    setLab(LABORATORIES[0].id);
    setDate("");
    setStartTime("");
    setEndTime("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requester || !date || !startTime || !endTime) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    if (!isValidTimeRange(startTime, endTime)) {
      toast.error("O horário de fim deve ser posterior ao horário de início.");
      return;
    }

    try {
      await onSubmit({ requesterName: requester, labId: lab, date, startTime, endTime });
      resetForm();
    } catch {
      return;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nova Reserva de Espaço</DialogTitle>
            <DialogDescription>Preencha as informações para agendar o laboratório.</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label htmlFor="solicitante">Nome do Solicitante</Label>
              <Input id="solicitante" value={requester} onChange={(e) => setRequester(e.target.value)} autoFocus />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="laboratorio">Laboratório</Label>
                <Select value={lab} onValueChange={setLab}>
                  <SelectTrigger id="laboratorio"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {LABORATORIES.map((l) => (<SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="data-reserva">Data</Label>
                <Input id="data-reserva" type="date" value={date} min={todayString} onChange={(e) => setDate(e.target.value)} className="w-full" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="hora-inicio">Hora de Início</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger id="hora-inicio"><SelectValue placeholder="00:00" /></SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_HOURS.map((hour) => (<SelectItem key={hour} value={hour}>{hour}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hora-fim">Hora de Fim</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger id="hora-fim"><SelectValue placeholder="00:00" /></SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_HOURS.map((hour) => (
                      <SelectItem key={hour} value={hour} disabled={startTime ? hour <= startTime : false}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "A Guardar..." : "Confirmar Reserva"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
