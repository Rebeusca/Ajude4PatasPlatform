import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const donation = await prisma.donation.findUnique({
      where: { id }
    })

    if (!donation) {
      return NextResponse.json(
        { error: "Doação não encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(donation)
  } catch (error) {
    console.error("Erro ao buscar doação:", error)
    return NextResponse.json(
      { error: "Erro ao buscar doação" },
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
    const { donorName, product, quantity, donationDate, observations } = body

    if (!donorName || !product || !quantity || !donationDate) {
      return NextResponse.json(
        { error: "Nome do doador, produto, quantidade e data são obrigatórios" },
        { status: 400 }
      )
    }

    const donation = await prisma.donation.update({
      where: { id },
      data: {
        donorName,
        product,
        quantity,
        donationDate: new Date(donationDate),
        observations: observations || null
      }
    })

    return NextResponse.json(donation)
  } catch (error) {
    console.error("Erro ao atualizar doação:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar doação" },
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
    await prisma.donation.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao deletar doação:", error)
    return NextResponse.json(
      { error: "Erro ao deletar doação" },
      { status: 500 }
    )
  }
}
