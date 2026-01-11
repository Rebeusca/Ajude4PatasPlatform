import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const volunteers = await prisma.volunteer.findMany({
      orderBy: { entryDate: 'desc' }
    })
    return NextResponse.json(volunteers)
  } catch (error) {
    console.error("Erro ao buscar voluntários:", error)
    return NextResponse.json({ error: "Erro ao buscar voluntários" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, age, workArea, schedule, entryDate, imageUrl } = body

    const volunteer = await prisma.volunteer.create({
      data: {
        name,
        age: age ? parseInt(age) : null,
        workArea,
        schedule,
        entryDate: entryDate ? new Date(entryDate) : new Date(),
        imageUrl: imageUrl || null,
        isActive: true
      }
    })

    return NextResponse.json(volunteer, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar voluntário:", error)
    return NextResponse.json({ error: "Erro ao criar voluntário" }, { status: 500 })
  }
}