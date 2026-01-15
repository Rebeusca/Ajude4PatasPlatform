import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const history = await prisma.veterinaryHistory.findUnique({
      where: { id },
      include: {
        animal: true
      }
    })

    if (!history) {
      return NextResponse.json(
        { error: "Registro não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(history)
  } catch (error) {
    console.error("Erro ao buscar registro:", error)
    return NextResponse.json(
      { error: "Erro ao buscar registro" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { animalId, doctor, date, cost, illness, description } = body

    if (!animalId) {
      return NextResponse.json(
        { error: "Animal é obrigatório" },
        { status: 400 }
      )
    }

    const history = await prisma.veterinaryHistory.update({
      where: { id },
      data: {
        animalId,
        doctor: doctor || null,
        date: date ? new Date(date) : undefined,
        cost: cost || null,
        illness: illness || null,
        description: description || ""
      },
      include: {
        animal: true
      }
    })

    return NextResponse.json(history)
  } catch (error) {
    console.error("Erro ao atualizar registro:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar registro" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.veterinaryHistory.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao deletar registro:", error)
    return NextResponse.json(
      { error: "Erro ao deletar registro" },
      { status: 500 }
    )
  }
}
