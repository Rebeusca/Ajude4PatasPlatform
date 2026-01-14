import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const adotante = await prisma.adopter.findUnique({
            where: { id },
        });

        if (!adotante) {
            return NextResponse.json(
                { error: "Adotante não encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(adotante);
    } catch (error) {
        console.error("Erro ao buscar adotante:", error);
        return NextResponse.json(
            { error: "Erro ao buscar adotante" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, email, phone, address, addressNum, zipCode, neighborhood, city, state, birthDate, imageUrl, observations } = body;

        if (!name || !email) {
            return NextResponse.json(
                { error: "Nome e email são obrigatórios" },
                { status: 400 }
            );
        }

        const adotante = await prisma.adopter.update({
            where: { id },
            data: {
                name,
                email: email || null,
                address: address,
                addressNum: addressNum,
                zipCode: zipCode,
                neighborhood: neighborhood,
                city: city,
                state: state,
                birthDate: birthDate ? new Date(birthDate) : undefined,
                observations: observations || "Nenhuma observação adicionada.",
                imageUrl: imageUrl || null,
                phone: phone,
            },
        });

        return NextResponse.json(adotante);
    } catch (error) {
        console.error("Erro ao atualizar adotante:", error);
        return NextResponse.json(
            { error: "Erro ao atualizar adotante" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.adopter.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao deletar adotante:", error);
        return NextResponse.json(
            { error: "Erro ao deletar adotante" },
            { status: 500 }
        );
    }
}