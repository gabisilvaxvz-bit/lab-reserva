// components/Calendar.tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MONTH_NAMES, Reservation } from "@/lib/constants";

interface CalendarProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
  reservations: Reservation[];
  today: Date;
}

export function Calendar({ 
  currentMonth, onPrevMonth, onNextMonth, selectedDate, onSelectDate, reservations, today 
}: CalendarProps) {
  
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayOfWeek = new Date(year, month, 1).getDay();

  const getDayStatus = (date: Date) => {
    if (date.getTime() < today.getTime()) return "passado";
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return "fim-de-semana";

    const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    const hasReservations = reservations.some(r => r.date === dateString);
    
    return hasReservations ? "com-reservas" : "disponivel";
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div>
          <CardTitle className="text-xl capitalize flex items-center gap-2">
            {MONTH_NAMES[month]} {year}
          </CardTitle>
          <CardDescription>
            {selectedDate ? "Exibindo reservas do dia selecionado." : "Clique num dia para filtrar as reservas."}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" size="icon" className="h-8 w-8" onClick={onPrevMonth}
            disabled={year === today.getFullYear() && month === today.getMonth()}
          >
            &larr;
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={onNextMonth}>
            &rarr;
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4 text-center text-sm font-semibold text-muted-foreground">
          <div>DOM</div><div>SEG</div><div>TER</div><div>QUA</div><div>QUI</div><div>SEX</div><div>SÁB</div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-16 w-full" />
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const currentIteratedDate = new Date(year, month, day);
            const status = getDayStatus(currentIteratedDate);
            const isDisabled = status === "passado" || status === "fim-de-semana";
            const isSelected = selectedDate?.getTime() === currentIteratedDate.getTime();

            return (
              <Button
                key={day}
                variant={isSelected ? "default" : "ghost"}
                disabled={isDisabled}
                onClick={() => onSelectDate(isSelected ? null : currentIteratedDate)}
                className={cn(
                  "h-16 w-full flex flex-col items-center justify-center gap-1.5 rounded-md font-medium border border-transparent transition-all",
                  isDisabled && "opacity-30 cursor-not-allowed",
                  !isDisabled && !isSelected && "hover:border-primary/20 hover:bg-primary/5 hover:shadow-sm",
                  isSelected && "shadow-md"
                )}
              >
                <span className="text-lg">{day}</span>
                {status === "com-reservas" && !isDisabled && (
                  <span className={cn("w-2 h-2 rounded-full", isSelected ? "bg-white" : "bg-blue-500")} />
                )}
              </Button>
            );
          })}
        </div>

        <div className="flex justify-center gap-6 mt-8 pt-6 border-t text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Dia com reservas</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs border px-2 py-1 rounded-md">
              Clique no dia para filtrar
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}