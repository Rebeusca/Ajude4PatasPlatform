"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

interface Donation {
  id: string
  donorName: string
  donationDate: string
  quantity: string
  product: string
  observations: string | null
  createdAt: string
}

export default function DoacoesPage() {
  const { data: session, status } = useSession()
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    donorName: "",
    donationDate: "",
    quantity: "",
    product: "",
    observations: ""
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/login")
    }
  }, [status])

  useEffect(() => {
    if (status === "authenticated") {
      fetchDonations()
    }
  }, [status])

  const fetchDonations = async () => {
    try {
      const res = await fetch("/api/doacoes")
      const data = await res.json()
      setDonations(data)
      setLoading(false)
    } catch (error) {
      console.error("Erro ao buscar doações:", error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingDonation) {
        await fetch(`/api/doacoes/${editingDonation.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        })
      } else {
        await fetch("/api/doacoes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        })
      }

      setEditingDonation(null)
      setFormData({ donorName: "", donationDate: "", quantity: "", product: "", observations: "" })
      fetchDonations()
    } catch (error) {
      console.error("Erro ao salvar doação:", error)
      alert("Erro ao salvar doação")
    }
  }

  const handleEdit = (donation: Donation) => {
    setEditingDonation(donation)
    setFormData({
      donorName: donation.donorName,
      donationDate: donation.donationDate.split('T')[0],
      quantity: donation.quantity,
      product: donation.product,
      observations: donation.observations || ""
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta doação?")) {
      return
    }

    try {
      await fetch(`/api/doacoes/${id}`, {
        method: "DELETE"
      })
      fetchDonations()
    } catch (error) {
      console.error("Erro ao deletar doação:", error)
      alert("Erro ao deletar doação")
    }
  }

  const handleCancel = () => {
    setEditingDonation(null)
    setFormData({ donorName: "", donationDate: "", quantity: "", product: "", observations: "" })
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

  const filteredDonations = donations.filter((donation) => {
    const search = searchTerm.toLowerCase()
    return (
      donation.donorName.toLowerCase().includes(search) ||
      donation.product.toLowerCase().includes(search) ||
      donation.quantity.toLowerCase().includes(search)
    )
  })

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6 bg-white rounded-lg p-6 shadow-xl">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {editingDonation ? "editar doação" : "cadastrar nova doação"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome do Doador *"
                value={formData.donorName}
                onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                required
              />
              <Input
                label="Data da Doação *"
                type="date"
                value={formData.donationDate}
                onChange={(e) => setFormData({ ...formData, donationDate: e.target.value })}
                required
              />
              <Input
                label="Quantidade *"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
              <Input
                label="Tipo de Produto *"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                required
              />
            </div>
            <div className="flex gap-3 justify-end w-85">
              <Button type="submit" className="min-w-[160px] text-sm py-2 px-4">
                {editingDonation ? "Salvar Alterações" : "Adicionar"}
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
            <p className="text-sm text-gray-600 mb-1">Total de Doações</p>
            <p className="text-2xl font-bold text-gray-900">{donations.length}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-300">
            <p className="text-sm text-orange-700 mb-1">Este Mês</p>
            <p className="text-2xl font-bold text-orange-900">
              {donations.filter(d => {
                const donationDate = new Date(d.donationDate)
                const now = new Date()
                return donationDate.getMonth() === now.getMonth() && donationDate.getFullYear() === now.getFullYear()
              }).length}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
            <p className="text-sm text-blue-700 mb-1">Produtos Únicos</p>
            <p className="text-2xl font-bold text-blue-900">
              {new Set(donations.map(d => d.product)).size}
            </p>
          </div>
        </div>

        {/* Campo de Busca */}
        <div className="mb-4">
          <Input
            label="Buscar doação"
            placeholder="Digite o nome do doador, produto, quantidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-gray-900"
          />
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-600">
              {filteredDonations.length} {filteredDonations.length === 1 ? 'doação encontrada' : 'doações encontradas'}
            </p>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Nome do Doador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Data da Doação
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'Nenhuma doação encontrada com o termo de busca' : 'Nenhuma doação cadastrada'}
                  </td>
                </tr>
              ) : (
                filteredDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {donation.donorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {donation.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {donation.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(donation.donationDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={() => handleEdit(donation)}
                          className="text-teal-600 hover:text-teal-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(donation.id)}
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