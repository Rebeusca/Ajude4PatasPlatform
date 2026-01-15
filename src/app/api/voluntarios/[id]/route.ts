import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const volunteer = await prisma.volunteer.findUnique({
      where: { id }
    })

    if (!volunteer) {
      return NextResponse.json(
        { error: "Voluntário não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(volunteer)
  } catch (error) {
    console.error("Erro ao buscar voluntário:", error)
    return NextResponse.json(
      { error: "Erro ao buscar voluntário" },
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
    const { name, age, workArea, schedule, entryDate, imageUrl } = body

    if (!name || !workArea || !schedule) {
      return NextResponse.json(
        { error: "Nome, área de atuação e horário são obrigatórios" },
        { status: 400 }
      )
    }

    const volunteer = await prisma.volunteer.update({
      where: { id },
      data: {
        name,
        age: age ? parseInt(age) : null,
        workArea,
        schedule,
        entryDate: entryDate ? new Date(entryDate) : undefined,
        imageUrl: imageUrl || null
      }
    })

    return NextResponse.json(volunteer)
  } catch (error) {
    console.error("Erro ao atualizar voluntário:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar voluntário" },
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
    await prisma.volunteer.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao deletar voluntário:", error)
    return NextResponse.json(
      { error: "Erro ao deletar voluntário" },
      { status: 500 }
    )
  }
}
