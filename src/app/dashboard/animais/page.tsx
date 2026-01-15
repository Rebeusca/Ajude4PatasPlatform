"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

interface Animal {
  id: string
  name: string
  species: string
  breed: string | null
  age: number | null
  gender: string | null
  status: string
  imageUrl: string | null
  admissionDate: string
  createdAt: string
}

export default function AnimaisPage() {
  const { data: session, status } = useSession()
  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    gender: "",
    status: "",
    imageUrl: ""
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/login")
    }
  }, [status])

  useEffect(() => {
    if (status === "authenticated") {
      fetchAnimals()
    }
  }, [status])

  const fetchAnimals = async () => {
    try {
      const response = await fetch("/api/animais")
      const data = await response.json()
      setAnimals(data)
      setLoading(false)
    } catch (error) {
      console.error("Erro ao buscar animais:", error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const imageUrlValue = formData.imageUrl?.trim() || null
      
      const payload = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed?.trim() || null,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || null,
        status: formData.status,
        imageUrl: imageUrlValue
      }

      if (editingAnimal) {
        const response = await fetch(`/api/animais/${editingAnimal.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Erro ao atualizar animal")
        }
      } else {
        const response = await fetch("/api/animais", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Erro ao criar animal")
        }
      }

      setEditingAnimal(null)
      setFormData({
        name: "",
        species: "",
        breed: "",
        age: "",
        gender: "",
        status: "",
        imageUrl: ""
      })
      fetchAnimals()
    } catch (error) {
      console.error("Erro ao salvar animal:", error)
      alert("Erro ao salvar animal")
    }
  }

  const handleEdit = (animal: Animal) => {
    setEditingAnimal(animal)
    setFormData({
      name: animal.name,
      species: animal.species,
      breed: animal.breed || "",
      age: animal.age?.toString() || "",
      gender: animal.gender || "",
      status: animal.status,
      imageUrl: animal.imageUrl || ""
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este animal?")) {
      return
    }

    try {
      await fetch(`/api/animais/${id}`, {
        method: "DELETE"
      })
      fetchAnimals()
    } catch (error) {
      console.error("Erro ao deletar animal:", error)
      alert("Erro ao deletar animal")
    }
  }

  const handleCancel = () => {
    setEditingAnimal(null)
    setFormData({
      name: "",
      species: "",
      breed: "",
      age: "",
      gender: "",
      status: "",
      imageUrl: ""
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

  // Filtrar animais baseado no termo de busca
  const filteredAnimals = animals.filter((animal) => {
    const search = searchTerm.toLowerCase()
    return (
      animal.name.toLowerCase().includes(search) ||
      animal.species.toLowerCase().includes(search) ||
      (animal.breed && animal.breed.toLowerCase().includes(search)) ||
      animal.status.toLowerCase().includes(search) ||
      (animal.gender && animal.gender.toLowerCase().includes(search)) ||
      (animal.age && animal.age.toString().includes(search))
    )
  })

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6 bg-white rounded-lg p-6 shadow-xl">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {editingAnimal ? "editar animal" : "cadastrar novo animal"}
          </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Espécie *
                  </label>
                  <select
                    value={formData.species}
                    onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 transition-colors"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="cão">Cão</option>
                    <option value="gato">Gato</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <Input
                  label="Raça"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                />
                <Input
                  label="Idade"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gênero
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 transition-colors"
                  >
                    <option value="">Selecione...</option>
                    <option value="macho">Macho</option>
                    <option value="fêmea">Fêmea</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 transition-colors"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="disponível">Disponível</option>
                    <option value="adotado">Adotado</option>
                    <option value="em tratamento">Em Tratamento</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="URL da Foto"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://exemplo.com/foto.jpg"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end w-85">
                <Button type="submit" className="min-w-[160px] text-sm py-2 px-4">
                  {editingAnimal ? "Salvar Alterações" : "Adicionar"}
                </Button>
                <Button type="button" variant="secondary" onClick={handleCancel} className="min-w-[160px] text-sm py-2 px-4">
                  Cancelar
                </Button>
              </div>
            </form>
          </div>

        {/* Estatísticas */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{animals.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-300">
            <p className="text-sm text-green-700 mb-1">Disponíveis</p>
            <p className="text-2xl font-bold text-green-900">
              {animals.filter(a => a.status === "disponível").length}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-300">
            <p className="text-sm text-yellow-700 mb-1">Em Tratamento</p>
            <p className="text-2xl font-bold text-yellow-900">
              {animals.filter(a => a.status === "em tratamento").length}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
            <p className="text-sm text-blue-700 mb-1">Adotados</p>
            <p className="text-2xl font-bold text-blue-900">
              {animals.filter(a => a.status === "adotado").length}
            </p>
          </div>
        </div>

        {/* Campo de Busca */}
        <div className="mb-4">
          <Input
            label="Buscar animal"
            placeholder="Digite o nome, espécie, raça, status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-gray-900"
          />
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-600">
              {filteredAnimals.length} {filteredAnimals.length === 1 ? 'animal encontrado' : 'animais encontrados'}
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
                  Espécie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Raça
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Idade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Gênero
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Data de Admissão
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAnimals.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'Nenhum animal encontrado com o termo de busca' : 'Nenhum animal cadastrado'}
                  </td>
                </tr>
              ) : (
                filteredAnimals.map((animal) => (
                  <tr key={animal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {animal.imageUrl ? (
                        <img 
                          src={animal.imageUrl} 
                          alt={animal.name}
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
                      {animal.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                      {animal.species}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {animal.breed || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {animal.age ? `${animal.age} anos` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                      {animal.gender || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        animal.status === "disponível" 
                          ? "bg-green-100 text-green-800"
                          : animal.status === "adotado"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                      }`}>
                        {animal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(animal.admissionDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={() => handleEdit(animal)}
                          className="text-teal-600 hover:text-teal-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(animal.id)}
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

