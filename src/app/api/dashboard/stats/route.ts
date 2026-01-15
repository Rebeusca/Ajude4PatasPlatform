import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Data do último mês
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    // Animais admitidos desde o último mês
    const animalsAdmitted = await prisma.animal.count({
      where: {
        admissionDate: {
          gte: lastMonth
        }
      }
    })

    // Distribuição por espécie dos animais admitidos
    const animalsAdmittedList = await prisma.animal.findMany({
      where: {
        admissionDate: {
          gte: lastMonth
        }
      },
      select: {
        species: true
      }
    })

    const animalsBySpecies = animalsAdmittedList.reduce((acc, animal) => {
      acc[animal.species] = (acc[animal.species] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Animais adotados desde o último mês
    const adoptionsCount = await prisma.adoption.count({
      where: {
        adoptionDate: {
          gte: lastMonth
        }
      }
    })

    // Distribuição por espécie dos animais adotados
    const adoptionsBySpecies = await prisma.adoption.findMany({
      where: {
        adoptionDate: {
          gte: lastMonth
        }
      },
      include: {
        animal: true
      }
    })

    const adoptionsSpeciesCount = adoptionsBySpecies.reduce((acc, adoption) => {
      const species = adoption.animal.species
      acc[species] = (acc[species] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Doações desde o último mês
    const donationsCount = await prisma.donation.count({
      where: {
        createdAt: {
          gte: lastMonth
        }
      }
    })

    // Distribuição por produto (substituindo método de pagamento)
    const donationsList = await prisma.donation.findMany({
      where: {
        createdAt: {
          gte: lastMonth
        }
      },
      select: {
        product: true
      }
    })

    const donationsByMethod = donationsList.reduce((acc, donation) => {
      const product = donation.product || 'Outro'
      if (!acc[product]) {
        acc[product] = { count: 0, total: 0 }
      }
      acc[product].count += 1
      return acc
    }, {} as Record<string, { count: number; total: number }>)

    // Status das adoções
    const adoptionsList = await prisma.adoption.findMany({
      where: {
        adoptionDate: {
          gte: lastMonth
        }
      },
      select: {
        status: true
      }
    })

    const adoptionsByStatus = adoptionsList.reduce((acc, adoption) => {
      acc[adoption.status] = (acc[adoption.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Movimentações mensais (últimos 12 meses) - contagem de doações por mês
    const monthlyMovementsList = await prisma.donation.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
        }
      },
      select: {
        createdAt: true
      }
    })

    // Voluntários ativos
    const activeVolunteers = await prisma.volunteer.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        entryDate: 'desc'
      },
      take: 5
    })

    // Processar movimentações mensais
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (11 - i))
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      
      const monthMovements = monthlyMovementsList.filter(d => {
        const dDate = new Date(d.createdAt)
        return dDate >= monthStart && dDate <= monthEnd
      })
      
      const count = monthMovements.length
      
      return {
        month: date.toLocaleDateString('pt-BR', { month: 'short' }),
        value: count
      }
    })

    return NextResponse.json({
      animalsAdmitted,
      animalsBySpecies,
      adoptionsCount,
      adoptionsBySpecies: adoptionsSpeciesCount,
      donationsCount,
      donationsByMethod,
      adoptionsByStatus,
      monthlyMovements: monthlyData,
      activeVolunteers: activeVolunteers.map(v => ({
        name: v.name,
        date: v.entryDate.toLocaleDateString('pt-BR'),
        imageUrl: v.imageUrl
      }))
    })
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error)
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    )
  }
}

