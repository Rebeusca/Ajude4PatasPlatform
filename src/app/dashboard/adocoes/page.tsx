"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

interface Adoption {
  id: string
  adoptionDate: string
  status: string
  observations?: string
  adopter: {
    id: string
    name: string
    imageUrl: string | null
    address: string | null
    addressNum: string | null
    zipCode: string | null
    neighborhood: string | null
    phone: string
    email: string | null
  }
  animal: {
    id: string
    name: string
    species: string // Adicionado para exibir no select
    imageUrl: string | null
  }
}

export default function AdocoesPage() {
  const { data: session, status } = useSession()
  const [adoptions, setAdoptions] = useState<Adoption[]>([])
  const [animals, setAnimals] = useState([])
  const [adopters, setAdopters] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingAdoption, setEditingAdoption] = useState<Adoption | null>(null)

  const [formData, setFormData] = useState({
    id: "",
    animalId: "",
    adopterId: "",
    adoptionDate: "",
    status: "em adaptação",
    observations: ""
  })

  useEffect(() => {
    if (status === "unauthenticated") redirect("/auth/login")
    if (status === "authenticated") fetchAdoptions()
  }, [status])

  const fetchAdoptions = async () => {
    try {
      const [resAdocoes, resAnimais, resAdotantes] = await Promise.all([
        fetch("/api/adocoes"),
        fetch("/api/animais"),
        fetch("/api/adotante")
      ])
      
      const data = await resAdocoes.json()
      const animaisData = await resAnimais.json()
      const adotantesData = await resAdotantes.json()
      
      setAdoptions(data)
      setAnimals(animaisData)
      setAdopters(adotantesData)
      setLoading(false)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      setLoading(false)
    }
  }

  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return "";
    return dateString.split('T')[0];
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = editingAdoption ? "PUT" : "POST"
      const url = editingAdoption ? `/api/adocoes/${formData.id}` : "/api/adocoes"

      const dataToSend = {
        ...formData,
        adoptionDate: formData.adoptionDate ? `${formData.adoptionDate}T12:00:00` : ""
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend)
      })

      if (!res.ok) throw new Error("Erro ao processar requisição")

      setShowForm(false)
      setEditingAdoption(null)
      fetchAdoptions()
      setFormData({ id: "", animalId: "", adopterId: "", adoptionDate: "", status: "em adaptação", observations: "" })
    } catch (error) {
      console.error("Erro ao salvar adoção.")
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      await fetch(`/api/adocoes/${id}`, { method: "DELETE" })
      fetchAdoptions()
    }
  }

const filteredAdoptions = adoptions.filter(a => {
  // O uso de ?. evita o erro "cannot access property name of undefined"
  const adopterName = a.adopter?.name?.toLowerCase() || "";
  const animalName = a.animal?.name?.toLowerCase() || "";
  const search = searchTerm.toLowerCase();
  
  return adopterName.includes(search) || animalName.includes(search);
});

  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[500px]">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 lowercase">registro geral de adoções</h1>
          <div className="flex items-center gap-3">
            <input 
              type="text" placeholder="filtro de busca..."
              className="bg-gray-200 text-gray-700 placeholder:text-gray-500 px-4 py-3 rounded-lg text-sm outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button 
              onClick={() => {
                setEditingAdoption(null);
                setFormData({ id: "", animalId: "", adopterId: "", adoptionDate: "", status: "em adaptação", observations: "" });
                setShowForm(true);
              }}
              className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-xl font-bold"
            >
              Nova Adoção
            </Button>
          </div>
        </div>

        {/* MODAL DE INFORMAÇÕES */}
        {showInfo && (
          <div className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">Detalhes da Adoção</h2>
                <button onClick={() => setShowInfo(false)} className="text-black hover:text-red-500">✕</button>
              </div>
              <div className="space-y-4">
                <p className="text-black"><strong className="text-black">Status:</strong> {adoptions.find(a => a.id === formData.id)?.status}</p>
                <p><strong className="text-black">Observações:</strong></p>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-700 italic border border-gray-200">
                  {adoptions.find(a => a.id === formData.id)?.observations || "Sem observações adicionais."}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE FORMULÁRIO */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{editingAdoption ? "Editar Adoção" : "Registrar Nova Adoção"}</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500 text-2xl">✕</button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700 lowercase">Adotante</label>
                  <select 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
                    value={formData.adopterId}
                    onChange={e => setFormData({...formData, adopterId: e.target.value})}
                  >
                    <option value="" className="text-gray-500">Selecione o adotante...</option>
                    {adopters.map((ad: any) => <option key={ad.id} value={ad.id}>{ad.name}</option>)}
                  </select>

                  <label className="text-sm font-medium text-gray-700 lowercase">Status</label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="solicitado">Solicitado</option>
                    <option value="em adaptação">Em Adaptação</option>
                    <option value="finalizado">Finalizado</option>
                    <option value="devolvido">Devolvido</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700 lowercase">selecione o animal</label>
                  <select 
                    required 
                    // BLOQUEIA O SELECT SE FOR EDIÇÃO
                    disabled={!!editingAdoption}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 ${editingAdoption ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    value={formData.animalId}
                    onChange={e => setFormData({...formData, animalId: e.target.value})}
                  >
                    <option value="" className="text-gray-500">Escolha um pet da lista...</option>
                    {animals
                      // FILTRO: Disponível ou Em Tratamento
                      .filter((a: any) => a.status === "disponível" || a.status === "em tratamento" || a.id === formData.animalId)
                      .map((an: any) => (
                        <option key={an.id} value={an.id}>
                          {an.name} ({an.species}) — {an.status}
                        </option>
                      ))
                    }
                  </select>

                  <Input 
                    disabled={!!editingAdoption}
                    label="Data da Adoção" type="date" required
                    value={formData.adoptionDate}
                    onChange={e => setFormData({...formData, adoptionDate: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 lowercase">Observações</label>
                  <textarea 
                    className="w-full p-4 border border-gray-300 rounded-xl h-24 outline-none focus:ring-2 focus:ring-orange-400 text-gray-900 placeholder:text-gray-500"
                    placeholder="Descreva detalhes da adoção..."
                    value={formData.observations}
                    onChange={e => setFormData({...formData, observations: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2 flex justify-center mt-4">
                  <Button type="submit" className="bg-orange-400 hover:bg-orange-500 text-white px-12 py-3 rounded-xl font-bold">
                    {editingAdoption ? "Atualizar" : "Salvar +"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* LISTAGEM */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAdoptions.map((a) => (
            <div key={a.id} className="bg-white rounded-[2rem] p-6 shadow-md border border-gray-50 relative group hover:-translate-y-1 transition-transform">
              <div className="absolute top-4 right-6 flex gap-2">
                <button className="text-gray-400 hover:text-teal-600" onClick={() => {
                  setEditingAdoption(a);
                  setFormData({
                    id: a.id,
                    animalId: a.animal?.id || "",
                    adopterId: a.adopter?.id || "",
                    adoptionDate: formatDateForInput(a.adoptionDate),
                    status: a.status,
                    observations: a.observations || ""
                  });
                  setShowForm(true);
                }}>✏️</button>
                <button className="text-gray-400 hover:text-teal-600" onClick={() => {
                  setFormData(prev => ({ ...prev, id: a.id }));
                  setShowInfo(true);
                }}>ℹ️</button>
                <button className="text-gray-400 hover:text-red-500" onClick={() => handleDelete(a.id)}>❌</button>
              </div>

              <div className="flex flex-col items-start w-full">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{a.adopter?.name} e {a.animal?.name}</h3>
                <div className="w-full flex justify-center mb-6">
                  <div className="flex -space-x-4">
                    <img src={a.adopter?.imageUrl || "/default-avatar.png"} className="w-16 h-16 rounded-full border-2 border-white object-cover z-10 shadow-sm" />
                    <img src={a.animal?.imageUrl || "/default-animal.png"} className="w-16 h-16 rounded-full border-2 border-white object-cover z-0 shadow-sm" />
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-gray-700 w-full font-medium">
                  <p><strong className="text-gray-900">Adotante:</strong> {a.adopter?.name}</p>
                  <p><strong className="text-gray-900">Animal:</strong> {a.animal?.name}</p>
                  <p><strong className="text-gray-900">Data:</strong> {new Date(a.adoptionDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                  <div className="pt-2">
                    <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                      a.status === 'devolvido' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {a.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}