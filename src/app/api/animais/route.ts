import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const animals = await prisma.animal.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(animals)
  } catch (error) {
    console.error("Erro ao buscar animais:", error)
    return NextResponse.json(
      { error: "Erro ao buscar animais" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, species, breed, age, gender, status } = body

    if (!name || !species) {
      return NextResponse.json(
        { error: "Nome e espécie são obrigatórios" },
        { status: 400 }
      )
    }

    const animal = await prisma.animal.create({
      data: {
        name,
        species,
        breed: breed || null,
        age: age ? parseInt(age) : null,
        gender: gender || null,
        status: status || "disponível"
      }
    })

    return NextResponse.json(animal, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar animal:", error)
    return NextResponse.json(
      { error: "Erro ao criar animal" },
      { status: 500 }
    )
  }
}

