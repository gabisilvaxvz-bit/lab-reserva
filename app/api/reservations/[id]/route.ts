import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  isLabId,
  isValidDateInput,
  isValidHour,
  isValidTimeRange,
  type ReservationInput,
} from "@/lib/reservations";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id.trim()) {
      return NextResponse.json(
        { error: "ID da reserva inválido." },
        { status: 400 }
      );
    }

    const deletedReservation = await prisma.reservation.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, data: deletedReservation },
      { status: 200 }
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Reserva não encontrada." },
        { status: 404 }
      );
    }

    console.error("Erro ao excluir reserva:", error);
    return NextResponse.json(
      { error: "Erro interno ao excluir a reserva." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: unknown = await request.json();
    const { requesterName, labId, date, startTime, endTime } = body as Partial<ReservationInput>;

    if (!id.trim()) {
      return NextResponse.json(
        { error: "ID da reserva inválido." },
        { status: 400 }
      );
    }

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
        id: { not: id },
        labId: normalizedLabId,
        date: normalizedDate,
        AND: [
          { startTime: { lt: normalizedEndTime } },
          { endTime: { gt: normalizedStartTime } },
        ],
      },
    });

    if (overlappingReservation) {
      return NextResponse.json(
        {
          error: `Este laboratório já está reservado neste horário (choque com reserva das ${overlappingReservation.startTime} às ${overlappingReservation.endTime}).`,
        },
        { status: 409 }
      );
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: {
        requesterName: normalizedRequesterName,
        labId: normalizedLabId,
        date: normalizedDate,
        startTime: normalizedStartTime,
        endTime: normalizedEndTime,
      },
    });

    return NextResponse.json(
      { success: true, data: updatedReservation },
      { status: 200 }
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Reserva não encontrada." },
        { status: 404 }
      );
    }

    console.error("Erro ao editar reserva:", error);
    return NextResponse.json(
      { error: "Erro interno ao editar a reserva." },
      { status: 500 }
    );
  }
}
