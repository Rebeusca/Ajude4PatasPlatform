import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const history = await prisma.veterinaryHistory.findMany({
      include: {
        animal: true, 
      },
      orderBy: {
        date: 'desc', 
      },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("Erro ao buscar histórico veterinário:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const history = await prisma.veterinaryHistory.create({
      data: {
        animalId: body.animalId,
        doctor: body.doctor,         
        cost: body.cost,             
        illness: body.illness,       
        description: body.observations || "", 
        date: body.date ? new Date(body.date) : new Date(),
      },
      include: {
        animal: true, 
      },
    });

    return NextResponse.json(history, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar histórico veterinário:", error);
    return NextResponse.json(
      { error: "Erro ao salvar no banco de dados. Verifique se executou 'npx prisma db push'." },
      { status: 500 }
    );
  }
}