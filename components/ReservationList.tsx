// components/ReservationList.tsx
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LABORATORIES, MONTH_NAMES, Reservation } from "@/lib/constants";

interface ReservationListProps {
  reservations: Reservation[];
  selectedDate: Date | null;
}

export function ReservationList({ reservations, selectedDate }: ReservationListProps) {
  const formatDateBR = (isoDate: string) => {
    const [y, m, d] = isoDate.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <Card className="h-full flex flex-col shadow-sm border-primary/10">
      <CardHeader className="bg-muted/30 pb-4 border-b">
        <CardTitle className="text-lg flex items-center justify-between">
          Próximas Reservas
          <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-semibold">
            {reservations.length}
          </span>
        </CardTitle>
        <CardDescription>
          {selectedDate 
            ? `Filtrado para ${selectedDate.getDate()} de ${MONTH_NAMES[selectedDate.getMonth()]}` 
            : "Lista de todos os agendamentos futuros."}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <div className="h-[500px] overflow-y-auto p-6 space-y-4">
          {reservations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-60">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <p className="text-sm">Nenhuma reserva encontrada para este filtro.</p>
            </div>
          ) : (
            reservations.map((res) => {
              const labInfo = LABORATORIES.find(l => l.id === res.labId);
              return (
                <div key={res.id} className="group relative bg-card border rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                  <div className={cn("absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl", labInfo?.color)} />
                  
                  <div className="pl-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-sm line-clamp-1" title={res.requesterName}>
                        {res.requesterName}
                      </p>
                      <span className="text-xs font-medium bg-muted px-2 py-0.5 rounded-md whitespace-nowrap">
                        {formatDateBR(res.date)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {res.startTime} - {res.endTime}
                      </span>
                      <span>•</span>
                      <span className="font-medium">{labInfo?.name}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}