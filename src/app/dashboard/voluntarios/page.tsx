"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

interface Volunteer {
  id: string
  name: string
  age: number | null
  workArea: string
  schedule: string
  entryDate: string
  imageUrl: string | null
  workedHours: number
  absenteeism: number
  isActive: boolean
  createdAt: string
}

export default function VoluntariosPage() {
  const { data: session, status } = useSession()
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [loading, setLoading] = useState(true)
  const [editingVolunteer, setEditingVolunteer] = useState<Volunteer | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    name: "", 
    age: "", 
    workArea: "", 
    schedule: "", 
    entryDate: "", 
    imageUrl: ""
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/login")
    }
  }, [status])

  useEffect(() => {
    if (status === "authenticated") {
      fetchVolunteers()
    }
  }, [status])

  const fetchVolunteers = async () => {
    try {
      const res = await fetch("/api/voluntarios")
      const data = await res.json()
      setVolunteers(data)
      setLoading(false)
    } catch (error) {
      console.error("Erro ao buscar voluntários:", error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingVolunteer) {
        await fetch(`/api/voluntarios/${editingVolunteer.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            age: formData.age ? parseInt(formData.age) : null
          })
        })
      } else {
        await fetch("/api/voluntarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            age: formData.age ? parseInt(formData.age) : null
          })
        })
      }

      setEditingVolunteer(null)
      setFormData({ name: "", age: "", workArea: "", schedule: "", entryDate: "", imageUrl: "" })
      fetchVolunteers()
    } catch (error) {
      console.error("Erro ao salvar voluntário:", error)
      alert("Erro ao salvar voluntário")
    }
  }

  const handleEdit = (volunteer: Volunteer) => {
    setEditingVolunteer(volunteer)
    setFormData({
      name: volunteer.name,
      age: volunteer.age?.toString() || "",
      workArea: volunteer.workArea,
      schedule: volunteer.schedule,
      entryDate: volunteer.entryDate.split('T')[0],
      imageUrl: volunteer.imageUrl || ""
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este voluntário?")) {
      return
    }

    try {
      await fetch(`/api/voluntarios/${id}`, {
        method: "DELETE"
      })
      fetchVolunteers()
    } catch (error) {
      console.error("Erro ao deletar voluntário:", error)
      alert("Erro ao deletar voluntário")
    }
  }

  const handleCancel = () => {
    setEditingVolunteer(null)
    setFormData({ name: "", age: "", workArea: "", schedule: "", entryDate: "", imageUrl: "" })
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

  const filteredVolunteers = volunteers.filter((volunteer) => {
    const search = searchTerm.toLowerCase()
    return (
      volunteer.name.toLowerCase().includes(search) ||
      volunteer.workArea.toLowerCase().includes(search) ||
      volunteer.schedule.toLowerCase().includes(search) ||
      (volunteer.age && volunteer.age.toString().includes(search))
    )
  })

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6 bg-white rounded-lg p-6 shadow-xl">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {editingVolunteer ? "editar voluntário" : "cadastrar novo voluntário"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Idade"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
              <Input
                label="Área de Atuação *"
                value={formData.workArea}
                onChange={(e) => setFormData({ ...formData, workArea: e.target.value })}
                required
              />
              <Input
                label="Horários de Atuação *"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                placeholder="ex: 08:00 - 12:00"
                required
              />
              <Input
                label="Data de Entrada *"
                type="date"
                value={formData.entryDate}
                onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                required
              />
              <Input
                  label="URL da Foto"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://exemplo.com/foto.jpg"
              />
            </div>
            <div className="flex gap-3 justify-end w-85">
              <Button type="submit" className="min-w-[160px] text-sm py-2 px-4">
                {editingVolunteer ? "Salvar Alterações" : "Adicionar"}
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
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{volunteers.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-300">
            <p className="text-sm text-green-700 mb-1">Ativos</p>
            <p className="text-2xl font-bold text-green-900">
              {volunteers.filter(v => v.isActive).length}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
            <p className="text-sm text-blue-700 mb-1">Total de Horas</p>
            <p className="text-2xl font-bold text-blue-900">
              {volunteers.reduce((sum, v) => sum + (v.workedHours || 0), 0)}h
            </p>
          </div>
        </div>

        {/* Campo de Busca */}
        <div className="mb-4">
          <Input
            label="Buscar voluntário"
            placeholder="Digite o nome, área de atuação, horário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-gray-900"
          />
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-600">
              {filteredVolunteers.length} {filteredVolunteers.length === 1 ? 'voluntário encontrado' : 'voluntários encontrados'}
            </p>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Foto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Idade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Área de Atuação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Horário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Data de Entrada
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Horas Trabalhadas
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVolunteers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'Nenhum voluntário encontrado com o termo de busca' : 'Nenhum voluntário cadastrado'}
                  </td>
                </tr>
              ) : (
                filteredVolunteers.map((volunteer) => (
                  <tr key={volunteer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {volunteer.imageUrl ? (
                        <img 
                          src={volunteer.imageUrl} 
                          alt={volunteer.name}
                          className="w-16 h-16 object-cover rounded-full"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/64?text=Sem+Foto'
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs text-center">
                          Sem Foto
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {volunteer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {volunteer.age ? `${volunteer.age} anos` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {volunteer.workArea}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {volunteer.schedule}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(volunteer.entryDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {volunteer.workedHours || 0} horas
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={() => handleEdit(volunteer)}
                          className="text-teal-600 hover:text-teal-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(volunteer.id)}
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