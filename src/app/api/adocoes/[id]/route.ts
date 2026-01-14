import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Ajuste para Promise (padrão Next.js atual)
) {
  try {
    const { id } = await params; // Aguarda o ID ser resolvido
    const body = await request.json();
    const { adoptionDate, status, observations, animalId } = body;

    // Verifica se o ID realmente existe antes de chamar o Prisma
    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    const adocaoAtualizada = await prisma.adoption.update({
      where: { id: id }, // Força a busca pelo id capturado
      data: {
        adoptionDate: adoptionDate ? new Date(adoptionDate) : undefined,
        status: status || undefined,
        observations: observations ?? "",
      },
    });

    // Sincronização de status do animal
    if (status === "devolvido" && animalId) {
      await prisma.animal.update({
        where: { id: animalId },
        data: { status: "disponível" }
      });
    }

    return NextResponse.json(adocaoAtualizada);
  } catch (error) {
    console.error("Erro no Prisma:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const adocao = await prisma.adoption.findUnique({
      where: { id },
      select: { animalId: true }
    });

    if (adocao) {
      await prisma.animal.update({
        where: { id: adocao.animalId },
        data: { status: "disponível" }
      });
    }

    await prisma.adoption.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Excluído com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar" }, { status: 500 });
  }
}