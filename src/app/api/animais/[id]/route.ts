import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const animal = await prisma.animal.findUnique({
      where: { id }
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, species, breed, age, gender, status, imageUrl } = body

    if (!name || !species) {
      return NextResponse.json(
        { error: "Nome e espécie são obrigatórios" },
        { status: 400 }
      )
    }

    // Buscar o animal atual para verificar o status anterior
    const animalBefore = await prisma.animal.findUnique({
      where: { id },
      include: {
        adoptions: true
      }
    })

    if (!animalBefore) {
      return NextResponse.json(
        { error: "Animal não encontrado" },
        { status: 404 }
      )
    }

    // Atualizar o animal
    const animal = await prisma.animal.update({
      where: { id },
      data: {
        name,
        species,
        breed: breed?.trim() || null,
        age: age ? parseInt(age) : null,
        gender: gender || null,
        status: status || "disponível",
        imageUrl: imageUrl?.trim() || null
      }
    })

    // Se o status foi alterado para "adotado" e não existe registro de adoção, criar um
    if (status === "adotado") {
      const existingAdoption = await prisma.adoption.findFirst({
        where: { animalId: id }
      })

      if (!existingAdoption) {
        await prisma.adoption.create({
          data: {
            animalId: id,
            adopterName: "Adotador não informado",
            status: "finalizado"
          }
        })
      }
    }

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.animal.delete({
      where: { id }
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

