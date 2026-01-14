import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const adotantes = await prisma.adopter.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(adotantes);
    } catch (error) {
        console.error("Erro ao buscar adotantes:", error);
        return NextResponse.json(
            { error: "Erro ao buscar adotantes" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, address, addressNum, zipCode, neighborhood, city, state, birthDate, imageUrl, email, phone, observations } = body;
        if (!name || !email) {
            return NextResponse.json(
                { error: "Nome e email são obrigatórios" },
                { status: 400 }
            );
        }

        const adotante = await prisma.adopter.create({
            data: {
                name,
                address: address,
                addressNum: addressNum,
                zipCode: zipCode,
                neighborhood: neighborhood,
                city: city,
                state: state,
                birthDate: new Date(birthDate),
                imageUrl: imageUrl?.trim() || null,
                observations: observations || "Nenhuma observação adicionada.",
                email: email || null,
                phone: phone?.trim() || null,
            }
        });

        return NextResponse.json(adotante, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar adotante:", error);
        return NextResponse.json(
            { error: "Erro ao criar adotante" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name, email, phone, address, addressNum, zipCode, neighborhood, city, state, birthDate, imageUrl, observations } = body;

        if (!id) {
            return NextResponse.json(
                { error: "ID do adotante é obrigatório" },
                { status: 400 }
            );
        }

        const adotante = await prisma.adopter.update({
            where: { id },
            data: {
                name: name?.trim() || undefined,
                email: email?.trim() || undefined,
                phone: phone?.trim() || undefined,
                address: address?.trim() || undefined,
                addressNum: addressNum?.trim() || undefined,
                zipCode: zipCode?.trim() || undefined,
                neighborhood: neighborhood?.trim() || undefined,
                city: city?.trim() || undefined,
                state: state?.trim() || undefined,
                birthDate: birthDate || undefined,
                imageUrl: imageUrl?.trim() || undefined,
                observations: observations || "Nenhuma observação adicionada."
            }
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

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "ID do adotante é obrigatório" },
                { status: 400 }
            );
        }

        await prisma.adopter.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Adotante deletado com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar adotante:", error);
        return NextResponse.json(
            { error: "Erro ao deletar adotante" },
            { status: 500 }
        );
    }
}