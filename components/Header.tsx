// components/Header.tsx
import { Button } from "@/components/ui/button";
import { LABORATORIES } from "@/lib/constants";

interface HeaderProps {
  selectedFilter: string;
  onSelectFilter: (id: string) => void;
  onOpenModal: () => void;
}

export function Header({ selectedFilter, onSelectFilter, onOpenModal }: HeaderProps) {
  return (
    <header className="mb-8 space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Laboratórios</h1>
        <p className="text-muted-foreground">
          Acompanhe o calendário e efetue novas reservas de laboratório.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedFilter === "todos" ? "default" : "outline"}
            onClick={() => onSelectFilter("todos")}
            className="rounded-full"
          >
            Todos
          </Button>
          {LABORATORIES.map((lab) => (
            <Button
              key={lab.id}
              variant={selectedFilter === lab.id ? "default" : "outline"}
              onClick={() => onSelectFilter(lab.id)}
              className="rounded-full"
            >
              {lab.name}
            </Button>
          ))}
        </div>

        <Button size="lg" className="gap-2 shadow-md w-full sm:w-auto" onClick={onOpenModal}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
            <line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/>
            <line x1="3" x2="21" y1="10" y2="10"/><line x1="10" x2="14" y1="15" y2="15"/>
            <line x1="12" x2="12" y1="13" y2="17"/>
          </svg>
          Nova Reserva
        </Button>
      </div>
    </header>
  );
}