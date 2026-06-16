import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { requesterName, labId, date, startTime, endTime } = body;

    // 1. Validação básica dos dados recebidos
    if (!requesterName || !labId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos." },
        { status: 400 } 
      );
    }

    // 2. Validação de lógica de negócio (início antes do fim)
    if (parseInt(startTime) >= parseInt(endTime)) {
      return NextResponse.json(
        { error: "A hora de início deve ser anterior à hora de fim." },
        { status: 400 }
      );
    }

    // 3. NOVA VALIDAÇÃO: Verificar sobreposição de horários no banco de dados
    const overlappingReservation = await prisma.reservation.findFirst({
      where: {
        labId: labId, // Tem que ser no mesmo laboratório
        date: date,   // Tem que ser no mesmo dia
        AND: [
          // A nova reserva começa antes da existente terminar?
          { startTime: { lt: endTime } }, 
          // A nova reserva termina depois da existente começar?
          { endTime: { gt: startTime } }  
        ]
      }
    });

    // Se encontrou alguma reserva que bate com as condições acima, bloqueia.
    if (overlappingReservation) {
      return NextResponse.json(
        { error: `Este laboratório já está reservado neste horário (Choque com reserva das ${overlappingReservation.startTime} às ${overlappingReservation.endTime}).` },
        { status: 409 } // 409 Conflict: O pedido entra em conflito com o estado atual do servidor
      );
    }

    // 4. Persistência no banco de dados
    const novaReserva = await prisma.reservation.create({
      data: {
        requesterName,
        labId,
        date,
        startTime,
        endTime,
      },
    });

    return NextResponse.json(
      { success: true, data: novaReserva },
      { status: 201 } 
    );

  } catch (error) {
    console.error("Erro na API de criação de reservas:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao processar a requisição." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const reservas = await prisma.reservation.findMany({
      orderBy: [
        { date: 'asc' },      // Ordena primeiro pela data
        { startTime: 'asc' }  // Depois pelo horário de início
      ]
    });

    return NextResponse.json(
      { success: true, data: reservas },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    return NextResponse.json(
      { error: "Erro interno ao carregar a lista de reservas." },
      { status: 500 }
    );
  }
}