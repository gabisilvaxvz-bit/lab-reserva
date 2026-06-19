import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  isLabId,
  isValidDateInput,
  isValidHour,
  isValidTimeRange,
  type ReservationInput,
} from "@/lib/reservations";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const { requesterName, labId, date, startTime, endTime } = body as Partial<ReservationInput>;

    if (
      typeof requesterName !== "string" ||
      typeof labId !== "string" ||
      typeof date !== "string" ||
      typeof startTime !== "string" ||
      typeof endTime !== "string"
    ) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos." },
        { status: 400 }
      );
    }

    const normalizedRequesterName = requesterName.trim();
    const normalizedLabId = labId.trim();
    const normalizedDate = date.trim();
    const normalizedStartTime = startTime.trim();
    const normalizedEndTime = endTime.trim();

    if (!normalizedRequesterName) {
      return NextResponse.json(
        { error: "O nome do solicitante é obrigatório." },
        { status: 400 }
      );
    }

    if (!isLabId(normalizedLabId)) {
      return NextResponse.json(
        { error: "Laboratório inválido." },
        { status: 400 }
      );
    }

    if (!isValidDateInput(normalizedDate)) {
      return NextResponse.json(
        { error: "Data inválida." },
        { status: 400 }
      );
    }

    if (!isValidHour(normalizedStartTime) || !isValidHour(normalizedEndTime)) {
      return NextResponse.json(
        { error: "Horário inválido." },
        { status: 400 }
      );
    }

    if (!isValidTimeRange(normalizedStartTime, normalizedEndTime)) {
      return NextResponse.json(
        { error: "A hora de início deve ser anterior à hora de fim." },
        { status: 400 }
      );
    }

    const overlappingReservation = await prisma.reservation.findFirst({
      where: {
        labId: normalizedLabId,
        date: normalizedDate,
        AND: [
          { startTime: { lt: normalizedEndTime } },
          { endTime: { gt: normalizedStartTime } },
        ]
      }
    });

    if (overlappingReservation) {
      return NextResponse.json(
        {
          error: `Este laboratório já está reservado neste horário (choque com reserva das ${overlappingReservation.startTime} às ${overlappingReservation.endTime}).`,
        },
        { status: 409 }
      );
    }

    const novaReserva = await prisma.reservation.create({
      data: {
        requesterName: normalizedRequesterName,
        labId: normalizedLabId,
        date: normalizedDate,
        startTime: normalizedStartTime,
        endTime: normalizedEndTime,
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
        { date: "asc" },
        { startTime: "asc" }
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
