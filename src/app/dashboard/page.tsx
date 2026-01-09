"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"

interface DashboardStats {
  animalsAdmitted: number
  animalsBySpecies: Record<string, number>
  adoptionsCount: number
  adoptionsBySpecies: Record<string, number>
  donationsCount: number
  donationsByMethod: Record<string, { count: number; total: number }>
  adoptionsByStatus: Record<string, number>
  totalBalance: number
  monthlyMovements: Array<{ month: string; value: number }>
  activeVolunteers: Array<{ name: string; date: string }>
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/login")
    }
  }, [status])

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/dashboard/stats")
        .then(res => res.json())
        .then(data => {
          setStats(data)
          setLoading(false)
        })
        .catch(err => {
          console.error("Erro ao buscar estatísticas:", err)
          setLoading(false)
        })
    }
  }, [status])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFE66D' }}>
        <p className="text-gray-600">Carregando...</p>
      </div>
    )
  }

  if (!session || !session.user) {
    return null
  }

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600">Erro ao carregar dados</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Dashboard Geral</h2>
        <div className="space-y-6">
          {/* Primeira linha: 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimalsAdmittedCard stats={stats} />
            <AnimalsAdoptedCard stats={stats} />
            <DonationsCard stats={stats} />
          </div>

          {/* Segunda linha: 2 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdoptionsOverviewCard stats={stats} />
            <TotalBalanceCard stats={stats} />
          </div>

          {/* Terceira linha: 2 cards (gráfico grande + lista) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MovementsOverviewCard stats={stats} />
            <ActiveVolunteersCard stats={stats} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function AnimalsAdmittedCard({ stats }: { stats: DashboardStats }) {
  const total = stats.animalsAdmitted
  const caes = stats.animalsBySpecies['cão'] || stats.animalsBySpecies['cães'] || 0
  const gatos = stats.animalsBySpecies['gato'] || stats.animalsBySpecies['gatos'] || 0
  const outros = stats.animalsBySpecies['outro'] || stats.animalsBySpecies['outros'] || 0
  const totalSpecies = caes + gatos + outros || 1

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-sm font-medium text-gray-600 mb-2">animais admitidos</h3>
      <p className="text-2xl font-bold text-gray-900 mb-1">{total} animais</p>
      <p className="text-xs text-gray-500 mb-4">desde o último mês</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">cães</span>
          <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-orange-400 rounded-full" style={{ width: `${(caes / totalSpecies) * 100}%` }}></div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">gatos</span>
          <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-orange-400 rounded-full" style={{ width: `${(gatos / totalSpecies) * 100}%` }}></div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">outros</span>
          <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gray-400 rounded-full" style={{ width: `${(outros / totalSpecies) * 100}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AnimalsAdoptedCard({ stats }: { stats: DashboardStats }) {
  const total = stats.adoptionsCount
  const caes = stats.adoptionsBySpecies['cão'] || stats.adoptionsBySpecies['cães'] || 0
  const gatos = stats.adoptionsBySpecies['gato'] || stats.adoptionsBySpecies['gatos'] || 0
  const outros = stats.adoptionsBySpecies['outro'] || stats.adoptionsBySpecies['outros'] || 0
  const totalSpecies = caes + gatos + outros || 1

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-sm font-medium text-gray-600 mb-2">animais adotados</h3>
      <p className="text-2xl font-bold text-gray-900 mb-1">{total} adoções</p>
      <p className="text-xs text-gray-500 mb-4">desde o último mês</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">cães</span>
          <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-orange-400 rounded-full" style={{ width: `${(caes / totalSpecies) * 100}%` }}></div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">gatos</span>
          <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-orange-400 rounded-full" style={{ width: `${(gatos / totalSpecies) * 100}%` }}></div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">outros</span>
          <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gray-400 rounded-full" style={{ width: `${(outros / totalSpecies) * 100}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DonationsCard({ stats }: { stats: DashboardStats }) {
  const total = stats.donationsCount
  const pix = stats.donationsByMethod['pix']?.count || 0
  const boleto = stats.donationsByMethod['boleto']?.count || 0
  const cartao = stats.donationsByMethod['cartão'] || stats.donationsByMethod['cartao'] || { count: 0 }
  const totalMethods = pix + boleto + cartao.count || 1
  
  const pixPercent = (pix / totalMethods) * 100
  const boletoPercent = (boleto / totalMethods) * 100
  const cartaoPercent = (cartao.count / totalMethods) * 100

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-sm font-medium text-gray-600 mb-2">doações</h3>
      <p className="text-2xl font-bold text-gray-900 mb-1">{total} doações</p>
      <p className="text-xs text-gray-500 mb-4">desde o último mês</p>
      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f97316"
              strokeWidth="8"
              strokeDasharray={`${pixPercent * 2.51} ${100 * 2.51}`}
              strokeDashoffset="0"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#0DB2AC"
              strokeWidth="8"
              strokeDasharray={`${boletoPercent * 2.51} ${100 * 2.51}`}
              strokeDashoffset={`-${pixPercent * 2.51}`}
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#6b7280"
              strokeWidth="8"
              strokeDasharray={`${cartaoPercent * 2.51} ${100 * 2.51}`}
              strokeDashoffset={`-${(pixPercent + boletoPercent) * 2.51}`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs text-gray-600">{Math.round(pixPercent)}% pix</p>
              <p className="text-xs text-gray-600">{Math.round(boletoPercent)}% boleto</p>
              <p className="text-xs text-gray-600">{Math.round(cartaoPercent)}% cartão</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdoptionsOverviewCard({ stats }: { stats: DashboardStats }) {
  const finalizados = stats.adoptionsByStatus['finalizado'] || stats.adoptionsByStatus['finalizados'] || 0
  const acompanhamento = stats.adoptionsByStatus['em acompanhamento'] || 0
  const andamento = stats.adoptionsByStatus['em andamento'] || 0
  const total = finalizados + acompanhamento + andamento || 1

  const finalizadosPercent = (finalizados / total) * 100
  const acompanhamentoPercent = (acompanhamento / total) * 100
  const andamentoPercent = (andamento / total) * 100

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-sm font-medium text-gray-600 mb-2">visão geral de adoções</h3>
      <p className="text-xs text-gray-500 mb-4">desde o último mês</p>
      <div className="flex items-center justify-center">
        <div className="relative w-40 h-40">
          <svg className="transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#0DB2AC"
              strokeWidth="8"
              strokeDasharray={`${finalizadosPercent * 2.51} ${100 * 2.51}`}
              strokeDashoffset="0"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f97316"
              strokeWidth="8"
              strokeDasharray={`${acompanhamentoPercent * 2.51} ${100 * 2.51}`}
              strokeDashoffset={`-${finalizadosPercent * 2.51}`}
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#6b7280"
              strokeWidth="8"
              strokeDasharray={`${andamentoPercent * 2.51} ${100 * 2.51}`}
              strokeDashoffset={`-${(finalizadosPercent + acompanhamentoPercent) * 2.51}`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs text-gray-600">{Math.round(finalizadosPercent)}% finalizados</p>
              <p className="text-xs text-gray-600">{Math.round(acompanhamentoPercent)}% em acompanhamento</p>
              <p className="text-xs text-gray-600">{Math.round(andamentoPercent)}% em andamento</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TotalBalanceCard({ stats }: { stats: DashboardStats }) {
  const balance = stats.totalBalance.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-center">
      <div className="text-center">
        <p className="text-sm font-medium text-gray-600 mb-2">saldo total em caixa</p>
        <p className="text-5xl font-bold text-gray-900">{balance}</p>
        <p className="text-sm text-gray-500 mt-2">reais</p>
      </div>
    </div>
  )
}

function MovementsOverviewCard({ stats }: { stats: DashboardStats }) {
  const maxValue = Math.max(...stats.monthlyMovements.map(m => m.value), 1)
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
      <h3 className="text-sm font-medium text-gray-600 mb-4">visão geral de movimentações</h3>
      <div className="h-64 flex items-end justify-between gap-2">
        {stats.monthlyMovements.map((movement) => {
          const height = maxValue > 0 ? (movement.value / maxValue) * 100 : 0
          return (
            <div key={movement.month} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full rounded-t" 
                style={{ 
                  backgroundColor: '#0DB2AC', 
                  height: `${Math.max(height, 5)}%`,
                  minHeight: '5px'
                }}
              ></div>
              <span className="text-xs text-gray-500 mt-2">{movement.month}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ActiveVolunteersCard({ stats }: { stats: DashboardStats }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-sm font-medium text-gray-600 mb-4">voluntários ativos</h3>
      <div className="space-y-3">
        {stats.activeVolunteers.length > 0 ? (
          stats.activeVolunteers.map((volunteer, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs text-gray-600">{volunteer.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{volunteer.name}</p>
                <p className="text-xs text-gray-500">data de entrada: {volunteer.date}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Nenhum voluntário ativo</p>
        )}
      </div>
    </div>
  )
}
