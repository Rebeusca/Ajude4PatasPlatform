"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

interface VeterinaryHistory {
  id: string
  animalId: string
  doctor: string | null
  date: string
  cost: string | null
  illness: string | null
  description: string
  animal: {
    id: string
    name: string
    imageUrl: string | null
  }
}

export default function VeterinarioPage() {
  const { data: session, status } = useSession()
  const [animals, setAnimals] = useState([])
  const [history, setHistory] = useState<VeterinaryHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [editingHistory, setEditingHistory] = useState<VeterinaryHistory | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  
  const [formData, setFormData] = useState({
    animalId: "",
    doctor: "",
    date: "",
    cost: "",
    illness: "",
    observations: ""
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/login")
    }
  }, [status])

  useEffect(() => {
    if (status === "authenticated") {
      fetchData()
    }
  }, [status])

  const fetchData = async () => {
    try {
      const [animaisRes, historicoRes] = await Promise.all([
        fetch("/api/animais"),
        fetch("/api/veterinario")
      ])
      
      const animaisData = await animaisRes.json()
      const historicoData = await historicoRes.json()
      
      setAnimals(animaisData)
      setHistory(historicoData)
      setLoading(false)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingHistory) {
        await fetch(`/api/veterinario/${editingHistory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            description: formData.observations
          })
        })
      } else {
        await fetch("/api/veterinario", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            description: formData.observations
          })
        })
      }

      setEditingHistory(null)
      setFormData({ 
        animalId: "", 
        doctor: "", 
        date: "", 
        cost: "", 
        illness: "", 
        observations: "" 
      })
      fetchData()
    } catch (error) {
      console.error("Erro ao salvar consulta:", error)
      alert("Erro ao registrar consulta. Verifique os campos.")
    }
  }

  const handleEdit = (item: VeterinaryHistory) => {
    setEditingHistory(item)
    setFormData({
      animalId: item.animalId,
      doctor: item.doctor || "",
      date: item.date.split('T')[0],
      cost: item.cost || "",
      illness: item.illness || "",
      observations: item.description
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este registro?")) {
      return
    }

    try {
      await fetch(`/api/veterinario/${id}`, {
        method: "DELETE"
      })
      fetchData()
    } catch (error) {
      console.error("Erro ao deletar registro:", error)
      alert("Erro ao deletar registro")
    }
  }

  const handleCancel = () => {
    setEditingHistory(null)
    setFormData({ 
      animalId: "", 
      doctor: "", 
      date: "", 
      cost: "", 
      illness: "", 
      observations: "" 
    })
  }

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

  const filteredHistory = history.filter((item) => {
    const search = searchTerm.toLowerCase()
    return (
      item.animal.name.toLowerCase().includes(search) ||
      (item.doctor && item.doctor.toLowerCase().includes(search)) ||
      (item.illness && item.illness.toLowerCase().includes(search)) ||
      item.description.toLowerCase().includes(search)
    )
  })

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6 bg-white rounded-lg p-6 shadow-xl">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {editingHistory ? "editar consulta" : "registrar nova consulta"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selecione o Animal *
                </label>
                <select 
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 transition-colors"
                  value={formData.animalId}
                  onChange={(e) => setFormData({...formData, animalId: e.target.value})}
                >
                  <option value="">Escolha um pet da lista...</option>
                  {animals.map((a: any) => (
                    <option key={a.id} value={a.id}>
                      {a.name} — {a.status}
                    </option>
                  ))}
                </select>
              </div>
              <Input 
                label="Veterinário" 
                placeholder="Nome do profissional"
                value={formData.doctor} 
                onChange={(e) => setFormData({...formData, doctor: e.target.value})}
              />
              <Input 
                label="Data da Consulta *" 
                type="date" 
                value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
              <Input 
                label="Investimento" 
                placeholder="R$ 0,00" 
                value={formData.cost} 
                onChange={(e) => setFormData({...formData, cost: e.target.value})}
              />
              <Input 
                label="Enfermidade" 
                placeholder="Descreva se houver"
                value={formData.illness} 
                onChange={(e) => setFormData({...formData, illness: e.target.value})}
              />
            </div>
            <div className="flex gap-3 justify-end w-85">
              <Button type="submit" className="min-w-[160px] text-sm py-2 px-4">
                {editingHistory ? "Salvar Alterações" : "Adicionar"}
              </Button>
              <Button type="button" variant="secondary" onClick={handleCancel} className="min-w-[160px] text-sm py-2 px-4">
                Cancelar
              </Button>
            </div>
          </form>
        </div>

        {/* Estatísticas */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
            <p className="text-sm text-gray-600 mb-1">Total de Consultas</p>
            <p className="text-2xl font-bold text-gray-900">{history.length}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-300">
            <p className="text-sm text-red-700 mb-1">Com Enfermidades</p>
            <p className="text-2xl font-bold text-red-900">
              {history.filter(h => h.illness).length}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
            <p className="text-sm text-blue-700 mb-1">Gasto Total</p>
            <p className="text-2xl font-bold text-blue-900">
              R$ {history.reduce((sum, h) => {
                const cost = parseFloat(h.cost?.replace('R$', '').replace(',', '.').trim() || '0')
                return sum + cost
              }, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Campo de Busca */}
        <div className="mb-4">
          <Input
            label="Buscar consulta"
            placeholder="Digite o nome do animal, veterinário, enfermidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-gray-900"
          />
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-600">
              {filteredHistory.length} {filteredHistory.length === 1 ? 'consulta encontrada' : 'consultas encontradas'}
            </p>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Animal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Veterinário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Enfermidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Observações
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Investimento
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'Nenhuma consulta encontrada com o termo de busca' : 'Nenhuma consulta registrada'}
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {item.animal.imageUrl ? (
                          <img 
                            src={item.animal.imageUrl} 
                            alt={item.animal.name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/40?text=Sem+Foto'
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                            {item.animal.name.charAt(0)}
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-900">{item.animal.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.doctor || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(item.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.illness ? (
                        <span className="text-red-600 font-medium">{item.illness}</span>
                      ) : (
                        <span className="text-gray-400">nenhuma</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.cost || "R$ 0,00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-teal-600 hover:text-teal-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}