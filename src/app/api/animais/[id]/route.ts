import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const animal = await prisma.animal.findUnique({
      where: { id: params.id }
    })

    if (!animal) {
      return NextResponse.json(
        { error: "Animal não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(animal)
  } catch (error) {
    console.error("Erro ao buscar animal:", error)
    return NextResponse.json(
      { error: "Erro ao buscar animal" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, species, breed, age, gender, status } = body

    if (!name || !species) {
      return NextResponse.json(
        { error: "Nome e espécie são obrigatórios" },
        { status: 400 }
      )
    }

    const animal = await prisma.animal.update({
      where: { id: params.id },
      data: {
        name,
        species,
        breed: breed || null,
        age: age ? parseInt(age) : null,
        gender: gender || null,
        status: status || "disponível"
      }
    })

    return NextResponse.json(animal)
  } catch (error) {
    console.error("Erro ao atualizar animal:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar animal" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.animal.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao deletar animal:", error)
    return NextResponse.json(
      { error: "Erro ao deletar animal" },
      { status: 500 }
    )
  }
}

