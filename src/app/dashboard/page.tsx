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
  monthlyMovements: Array<{ month: string; value: number }>
  activeVolunteers: Array<{ name: string; date: string; imageUrl: string | null }>
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
        <h1 className="text-md text-gray-500 mb-2">Bem-vindo de volta, {session.user.name}!</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mb-8">dashboard geral</h2>
      <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimalsAdmittedCard stats={stats} />
            <AnimalsAdoptedCard stats={stats} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdoptionsOverviewCard stats={stats} />
            <DonationsCard stats={stats} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <ActiveVolunteersCard stats={stats} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function AnimalsAdmittedCard({ stats }: { stats: DashboardStats }) {
  const total = stats?.animalsAdmitted || 0
  const caes = stats?.animalsBySpecies?.['cão'] || stats?.animalsBySpecies?.['cães'] || 0
  const gatos = stats?.animalsBySpecies?.['gato'] || stats?.animalsBySpecies?.['gatos'] || 0
  const outros = stats?.animalsBySpecies?.['outro'] || stats?.animalsBySpecies?.['outros'] || 0
  const totalSpecies = caes + gatos + outros || 1

  const caesPercent = totalSpecies > 0 ? (caes / totalSpecies) * 100 : 0
  const gatosPercent = totalSpecies > 0 ? (gatos / totalSpecies) * 100 : 0
  const outrosPercent = totalSpecies > 0 ? (outros / totalSpecies) * 100 : 0

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <p className="text-3xl font-bold text-gray-900 mb-1">{total} animais</p>
      <p className="text-sm text-gray-500 mb-10">admitidos desde o último mês</p>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 w-16">cães</span>
          <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-visible relative group">
            <div 
              className="h-full bg-orange-400 rounded-full cursor-pointer" 
              style={{ width: `${caesPercent}%` }}
            ></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              {caes} animais ({Math.round(caesPercent)}%)
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 w-16">gatos</span>
          <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-visible relative group">
            <div 
              className="h-full bg-orange-400 rounded-full cursor-pointer" 
              style={{ width: `${gatosPercent}%` }}
            ></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              {gatos} animais ({Math.round(gatosPercent)}%)
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 w-16">outros</span>
          <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-visible relative group">
            <div 
              className="h-full bg-gray-400 rounded-full cursor-pointer" 
              style={{ width: `${outrosPercent}%` }}
            ></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              {outros} animais ({Math.round(outrosPercent)}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AnimalsAdoptedCard({ stats }: { stats: DashboardStats }) {
  const total = stats?.adoptionsCount || 0
  const caes = stats?.adoptionsBySpecies?.['cão'] || stats?.adoptionsBySpecies?.['cães'] || 0
  const gatos = stats?.adoptionsBySpecies?.['gato'] || stats?.adoptionsBySpecies?.['gatos'] || 0
  const outros = stats?.adoptionsBySpecies?.['outro'] || stats?.adoptionsBySpecies?.['outros'] || 0
  const totalSpecies = (caes + gatos + outros) || 1

  const caesPercent = totalSpecies > 0 ? (caes / totalSpecies) * 100 : 0
  const gatosPercent = totalSpecies > 0 ? (gatos / totalSpecies) * 100 : 0
  const outrosPercent = totalSpecies > 0 ? (outros / totalSpecies) * 100 : 0

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <p className="text-3xl font-bold text-gray-900 mb-1">{total} adoções</p>
      <p className="text-sm text-gray-500 mb-10">desde o último mês</p>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 w-16">cães</span>
          <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-visible relative group">
            <div 
              className="h-full bg-orange-400 rounded-full cursor-pointer" 
              style={{ width: `${caesPercent}%` }}
            ></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              {caes} adoções ({Math.round(caesPercent)}%)
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 w-16">gatos</span>
          <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-visible relative group">
            <div 
              className="h-full bg-orange-400 rounded-full cursor-pointer" 
              style={{ width: `${gatosPercent}%` }}
            ></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              {gatos} adoções ({Math.round(gatosPercent)}%)
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 w-16">outros</span>
          <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-visible relative group">
            <div 
              className="h-full bg-gray-400 rounded-full cursor-pointer" 
              style={{ width: `${outrosPercent}%` }}
            ></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              {outros} adoções ({Math.round(outrosPercent)}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DonationsCard({ stats }: { stats: DashboardStats }) {
  const total = stats?.donationsCount || 0
  const donationsByProduct = stats?.donationsByMethod || {}
  
  // Obter os produtos mais doados (top 5)
  const products = Object.entries(donationsByProduct)
    .map(([product, data]) => ({
      product,
      count: data.count,
      percent: total > 0 ? (data.count / total) * 100 : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const colors = ['#f97316', '#0DB2AC', '#6b7280', '#8b5cf6', '#ec4899']

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <p className="text-3xl font-bold text-gray-900 mb-1">{total} doações</p>
      <p className="text-sm text-gray-500 mb-10">de produtos desde o último mês</p>
      
      {products.length > 0 ? (
        <>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-40 h-40">
              <svg className="transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                />
                {products.map((item, index) => {
                  const previousPercent = products.slice(0, index).reduce((sum, p) => sum + p.percent, 0)
                  return (
                    <circle
                      key={item.product}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={colors[index % colors.length]}
                      strokeWidth="12"
                      strokeDasharray={`${item.percent * 2.51} ${100 * 2.51}`}
                      strokeDashoffset={`-${previousPercent * 2.51}`}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  )
                })}
              </svg>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {products.map((item, index) => (
              <div key={item.product} className="relative group">
                <div className="flex items-center justify-between text-xs cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></div>
                    <span className="text-gray-600 capitalize">{item.product}</span>
                  </div>
                  <span className="text-gray-900 font-medium">{Math.round(item.percent)}%</span>
                </div>
                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                  {item.count} doações ({Math.round(item.percent)}%)
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-gray-500">Nenhuma doação de produtos no último mês</p>
        </div>
      )}
    </div>
  )
}

function AdoptionsOverviewCard({ stats }: { stats: DashboardStats }) {
  const finalizados = stats?.adoptionsByStatus?.['finalizado'] || 0
  const emAdaptacao = stats?.adoptionsByStatus?.['em adaptação'] || 0
  const solicitado = stats?.adoptionsByStatus?.['solicitado'] || 0
  const devolvido = stats?.adoptionsByStatus?.['devolvido'] || 0
  const totalReal = finalizados + emAdaptacao + solicitado + devolvido
  const total = totalReal || 1 // Usado apenas para cálculos, evita divisão por zero

  const finalizadosPercent = totalReal > 0 ? (finalizados / totalReal) * 100 : 0
  const emAdaptacaoPercent = totalReal > 0 ? (emAdaptacao / totalReal) * 100 : 0
  const solicitadoPercent = totalReal > 0 ? (solicitado / totalReal) * 100 : 0
  const devolvidoPercent = totalReal > 0 ? (devolvido / totalReal) * 100 : 0

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <p className="text-3xl font-bold text-gray-900 mb-1">visão geral de adoções</p>
      <p className="text-sm text-gray-500 mb-10">desde o último mês</p>
      <div className="flex items-center justify-center">
        <div className="relative w-40 h-40">
          <svg className="transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            {finalizadosPercent > 0 && (
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#0DB2AC"
                strokeWidth="12"
                strokeDasharray={`${finalizadosPercent * 2.51} ${100 * 2.51}`}
                strokeDashoffset="0"
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
            )}
            {emAdaptacaoPercent > 0 && (
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#f97316"
                strokeWidth="12"
                strokeDasharray={`${emAdaptacaoPercent * 2.51} ${100 * 2.51}`}
                strokeDashoffset={`-${finalizadosPercent * 2.51}`}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
            )}
            {solicitadoPercent > 0 && (
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="12"
                strokeDasharray={`${solicitadoPercent * 2.51} ${100 * 2.51}`}
                strokeDashoffset={`-${(finalizadosPercent + emAdaptacaoPercent) * 2.51}`}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
            )}
            {devolvidoPercent > 0 && (
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#ef4444"
                strokeWidth="12"
                strokeDasharray={`${devolvidoPercent * 2.51} ${100 * 2.51}`}
                strokeDashoffset={`-${(finalizadosPercent + emAdaptacaoPercent + solicitadoPercent) * 2.51}`}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
            )}
          </svg>
        </div>
      </div>
      <div className="mt-10 space-y-2">
        {finalizados > 0 && (
          <div className="relative group">
            <div className="flex items-center justify-between text-xs cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#0DB2AC' }}></div>
                <span className="text-gray-600">Finalizados</span>
              </div>
              <span className="text-gray-900 font-medium">{Math.round(finalizadosPercent)}%</span>
            </div>
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              {finalizados} adoções ({Math.round(finalizadosPercent)}%)
            </div>
          </div>
        )}
        {emAdaptacao > 0 && (
          <div className="relative group">
            <div className="flex items-center justify-between text-xs cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                <span className="text-gray-600">Em Adaptação</span>
              </div>
              <span className="text-gray-900 font-medium">{Math.round(emAdaptacaoPercent)}%</span>
            </div>
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              {emAdaptacao} adoções ({Math.round(emAdaptacaoPercent)}%)
            </div>
          </div>
        )}
        {solicitado > 0 && (
          <div className="relative group">
            <div className="flex items-center justify-between text-xs cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#8b5cf6' }}></div>
                <span className="text-gray-600">Solicitado</span>
              </div>
              <span className="text-gray-900 font-medium">{Math.round(solicitadoPercent)}%</span>
            </div>
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              {solicitado} adoções ({Math.round(solicitadoPercent)}%)
            </div>
          </div>
        )}
        {devolvido > 0 && (
          <div className="relative group">
            <div className="flex items-center justify-between text-xs cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }}></div>
                <span className="text-gray-600">Devolvido</span>
              </div>
              <span className="text-gray-900 font-medium">{Math.round(devolvidoPercent)}%</span>
            </div>
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              {devolvido} adoções ({Math.round(devolvidoPercent)}%)
            </div>
          </div>
        )}
        {totalReal === 0 && (
          <div className="flex items-center justify-center py-4">
            <p className="text-sm text-gray-500">Nenhuma adoção no último mês</p>
          </div>
        )}
      </div>
    </div>
  )
}

function VolunteerAvatar({ imageUrl, name }: { imageUrl: string | null; name: string }) {
  const [imageError, setImageError] = useState(false)

  if (imageUrl && !imageError) {
    return (
      <img 
        src={imageUrl} 
        alt={name}
        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
        onError={() => setImageError(true)}
      />
    )
  }

  return (
    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
      <span className="text-xs text-gray-600">{name?.charAt(0) || 'V'}</span>
    </div>
  )
}

function ActiveVolunteersCard({ stats }: { stats: DashboardStats }) {
  const volunteers = stats?.activeVolunteers || [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 min-h-[300px] flex flex-col">
      <p className="text-3xl font-bold text-gray-900 mb-1">voluntários ativos</p>
      
      {volunteers.length > 0 ? (
        <div className="space-y-3">
          {volunteers.map((volunteer, index) => (
            <div key={index} className="flex items-center gap-3">
              <VolunteerAvatar imageUrl={volunteer.imageUrl} name={volunteer.name} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{volunteer.name}</p>
                <p className="text-xs text-gray-500">data de entrada: {volunteer.date}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-md text-gray-500 text-center">nenhum voluntário ativo 😢</p>
        </div>
      )}
    </div>
  )
}
