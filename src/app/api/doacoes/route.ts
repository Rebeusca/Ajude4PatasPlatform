import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { donationDate: 'desc' }
    })
    return NextResponse.json(donations)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar doações" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const donation = await prisma.donation.create({
      data: {
        donorName: body.donorName,
        product: body.product,
        quantity: body.quantity,
        donationDate: new Date(body.donationDate),
        observations: body.observations
      }
    })
    return NextResponse.json(donation, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao registrar doação" }, { status: 500 })
  }
}