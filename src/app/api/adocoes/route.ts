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
      status,
      // Dados do adotante
      adopterName,
      adopterPhone,
      adopterEmail,
      adopterAddress,
      adopterAddressNum,
      adopterZipCode,
      adopterNeighborhood,
      adopterCity,
      adopterState,
      adopterBirthDate
    } = body

    // Validação de campos obrigatórios
    if (!animalId) {
      return NextResponse.json(
        { error: "Animal é obrigatório" },
        { status: 400 }
      )
    }

    if (!adoptionDate) {
      return NextResponse.json(
        { error: "Data da adoção é obrigatória" },
        { status: 400 }
      )
    }

    // Verificar se o animal existe
    const animal = await prisma.animal.findUnique({
      where: { id: animalId }
    })

    if (!animal) {
      return NextResponse.json(
        { error: "Animal não encontrado" },
        { status: 404 }
      )
    }

    // Verificar se o animal já está adotado
    if (animal.status === "adotado") {
      return NextResponse.json(
        { error: "Este animal já foi adotado" },
        { status: 400 }
      )
    }

    let finalAdopterId = adopterId

    // Se não tiver adopterId mas tiver dados do adotante, criar o adotante
    if (!finalAdopterId) {
      // Validar campos obrigatórios do adotante
      if (!adopterName || !adopterPhone || !adopterAddress || !adopterAddressNum || 
          !adopterZipCode || !adopterNeighborhood || !adopterCity || !adopterState || !adopterBirthDate) {
        return NextResponse.json(
          { error: "Todos os dados do adotante são obrigatórios (nome, telefone, endereço completo, cidade, estado, CEP, bairro e data de nascimento)" },
          { status: 400 }
        )
      }

      // Verificar se já existe um adotante com o mesmo telefone
      const existingAdopter = await prisma.adopter.findFirst({
        where: { phone: adopterPhone }
      })

      if (existingAdopter) {
        // Se já existe, usar o adotante existente
        finalAdopterId = existingAdopter.id
      } else {
        // Criar novo adotante
        const newAdopter = await prisma.adopter.create({
          data: {
            name: adopterName,
            phone: adopterPhone,
            email: adopterEmail || null,
            address: adopterAddress,
            addressNum: adopterAddressNum,
            zipCode: adopterZipCode,
            neighborhood: adopterNeighborhood,
            city: adopterCity,
            state: adopterState,
            birthDate: new Date(adopterBirthDate),
            observations: "Nenhuma observação adicionada."
          }
        })
        finalAdopterId = newAdopter.id
      }
    } else {
      // Verificar se o adotante existe
      const adopter = await prisma.adopter.findUnique({
        where: { id: finalAdopterId }
      })

      if (!adopter) {
        return NextResponse.json(
          { error: "Adotante não encontrado" },
          { status: 404 }
        )
      }
    }

    // Criar a adoção
    const adoption = await prisma.adoption.create({
      data: {
        animalId,
        adopterId: finalAdopterId,
        adoptionDate: new Date(adoptionDate),
        observations: observations || null,
        status: status || "em adaptação"
      },
      include: { animal: true, adopter: true }
    })

    // Atualizar status do animal para "adotado"
    await prisma.animal.update({
      where: { id: animalId },
      data: { status: "adotado" }
    })

    return NextResponse.json(adoption, { status: 201 })
  } catch (error: any) {
    console.error("Erro ao registrar adoção:", error)
    
    // Tratamento de erros específicos do Prisma
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Já existe uma adoção com estes dados" },
        { status: 400 }
      )
    }

    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: "Referência inválida (animal ou adotante não encontrado)" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || "Erro ao registrar adoção" },
      { status: 500 }
    )
  }
}