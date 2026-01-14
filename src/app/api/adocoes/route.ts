import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const adoptions = await prisma.adoption.findMany({
      include: {
        animal: true, 
        adopter: true
      },
      orderBy: { adoptionDate: 'desc' }
    })
    return NextResponse.json(adoptions)
  } catch (error) {
    console.error("Erro ao buscar adoções:", error)
    return NextResponse.json({ error: "Erro ao buscar adoções" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      animalId, 
      adopterId,
      adoptionDate,
      observations,
      status 
    } = body

    const adoption = await prisma.adoption.create({
      data: {
        animalId,
        adopterId,
        adoptionDate: new Date(adoptionDate),
        observations: observations || null,
        status: status || "finalizado"
      },
      include: { animal: true }
    })

    await prisma.animal.update({
      where: { id: animalId },
      data: { status: "adotado" }
    })

    return NextResponse.json(adoption, { status: 201 })
  } catch (error) {
    console.error("Erro ao registrar adoção:", error)
    return NextResponse.json({ error: "Erro ao registrar adoção" }, { status: 500 })
  }
}