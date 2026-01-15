"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { User, PawPrint, Calendar, Edit, Info, Trash2, CheckCircle, XCircle, Clock, Phone, Mail, MapPin, Home, Building2 } from "lucide-react"

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
    city: string | null
    state: string | null
    phone: string
    email: string | null
    birthDate: string
  }
  animal: {
    id: string
    name: string
    species: string // Adicionado para exibir no select
    imageUrl: string | null
  }
}

interface Animal {
  id: string
  name: string
  species: string
  status: string
  imageUrl: string | null
}

export default function AdocoesPage() {
  const { data: session, status } = useSession()
  const [adoptions, setAdoptions] = useState<Adoption[]>([])
  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [showInfo, setShowInfo] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingAdoption, setEditingAdoption] = useState<Adoption | null>(null)

  const [formData, setFormData] = useState({
    id: "",
    animalId: "",
    adoptionDate: "",
    status: "em adaptação",
    observations: "",
    // Dados do adotante
    adopterName: "",
    adopterPhone: "",
    adopterEmail: "",
    adopterAddress: "",
    adopterAddressNum: "",
    adopterZipCode: "",
    adopterNeighborhood: "",
    adopterCity: "",
    adopterState: "",
    adopterBirthDate: ""
  })

  useEffect(() => {
    if (status === "unauthenticated") redirect("/auth/login")
    if (status === "authenticated") fetchAdoptions()
  }, [status])

  const fetchAdoptions = async () => {
    try {
      const [resAdocoes, resAnimais] = await Promise.all([
        fetch("/api/adocoes"),
        fetch("/api/animais")
      ])
      
      const data = await resAdocoes.json()
      const animaisData = await resAnimais.json()
      
      // Garantir que data seja sempre um array
      if (Array.isArray(data)) {
        setAdoptions(data)
      } else {
        console.error("Resposta da API não é um array:", data)
        setAdoptions([])
      }
      
      // Garantir que animaisData seja sempre um array
      if (Array.isArray(animaisData)) {
        setAnimals(animaisData)
      } else {
        console.error("Resposta da API de animais não é um array:", animaisData)
        setAnimals([])
      }
      
      setLoading(false)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      setAdoptions([])
      setAnimals([])
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
        adoptionDate: formData.adoptionDate ? `${formData.adoptionDate}T12:00:00` : "",
        // Enviar dados do adotante apenas se não estiver editando (na edição, o adotante já existe)
        ...(editingAdoption ? {} : {
          adopterName: formData.adopterName,
          adopterPhone: formData.adopterPhone,
          adopterEmail: formData.adopterEmail,
          adopterAddress: formData.adopterAddress,
          adopterAddressNum: formData.adopterAddressNum,
          adopterZipCode: formData.adopterZipCode,
          adopterNeighborhood: formData.adopterNeighborhood,
          adopterCity: formData.adopterCity,
          adopterState: formData.adopterState,
          adopterBirthDate: formData.adopterBirthDate
        })
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend)
      })

      if (!res.ok) throw new Error("Erro ao processar requisição")

      setEditingAdoption(null)
      fetchAdoptions()
      setFormData({ 
        id: "", 
        animalId: "", 
        adoptionDate: "", 
        status: "em adaptação", 
        observations: "",
        adopterName: "",
        adopterPhone: "",
        adopterEmail: "",
        adopterAddress: "",
        adopterAddressNum: "",
        adopterZipCode: "",
        adopterNeighborhood: "",
        adopterCity: "",
        adopterState: "",
        adopterBirthDate: ""
      })
    } catch (error) {
      console.error("Erro ao salvar adoção:", error)
      alert("Erro ao salvar adoção. Verifique os campos obrigatórios.")
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      await fetch(`/api/adocoes/${id}`, { method: "DELETE" })
      fetchAdoptions()
    }
  }

  const handleCancel = () => {
    setEditingAdoption(null)
    setFormData({ 
      id: "", 
      animalId: "", 
      adoptionDate: "", 
      status: "em adaptação", 
      observations: "",
      adopterName: "",
      adopterPhone: "",
      adopterEmail: "",
      adopterAddress: "",
      adopterAddressNum: "",
      adopterZipCode: "",
      adopterNeighborhood: "",
      adopterCity: "",
      adopterState: "",
      adopterBirthDate: ""
    })
  }

const filteredAdoptions = Array.isArray(adoptions) 
  ? adoptions.filter(a => {
      // O uso de ?. evita o erro "cannot access property name of undefined"
      const adopterName = a.adopter?.name?.toLowerCase() || "";
      const animalName = a.animal?.name?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();
      
      return adopterName.includes(search) || animalName.includes(search);
    })
  : [];

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        
        {/* Formulário no Topo */}
        <div className="mb-6 bg-white rounded-lg p-6 shadow-xl">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {editingAdoption ? "editar adoção" : "cadastrar nova adoção"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dados do Adotante */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">dados do adotante</h3>
              </div>
              
              <Input
                label="Nome do Adotante *"
                value={formData.adopterName}
                onChange={(e) => setFormData({ ...formData, adopterName: e.target.value })}
                required
                disabled={!!editingAdoption}
              />
              <Input
                label="Telefone *"
                value={formData.adopterPhone}
                onChange={(e) => setFormData({ ...formData, adopterPhone: e.target.value })}
                placeholder="(99) 99999-9999"
                required
                disabled={!!editingAdoption}
              />
              <Input
                label="E-mail"
                type="email"
                value={formData.adopterEmail}
                onChange={(e) => setFormData({ ...formData, adopterEmail: e.target.value })}
                disabled={!!editingAdoption}
              />
              <Input
                label="Data de Nascimento *"
                type="date"
                value={formData.adopterBirthDate}
                onChange={(e) => setFormData({ ...formData, adopterBirthDate: e.target.value })}
                required
                disabled={!!editingAdoption}
              />
              <Input
                label="Cidade *"
                value={formData.adopterCity}
                onChange={(e) => setFormData({ ...formData, adopterCity: e.target.value })}
                required
                disabled={!!editingAdoption}
              />
              <Input
                label="Estado *"
                value={formData.adopterState}
                onChange={(e) => setFormData({ ...formData, adopterState: e.target.value })}
                required
                disabled={!!editingAdoption}
              />
              <div className="md:col-span-2 grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Input
                    label="Endereço *"
                    value={formData.adopterAddress}
                    onChange={(e) => setFormData({ ...formData, adopterAddress: e.target.value })}
                    required
                    disabled={!!editingAdoption}
                  />
                </div>
                <div>
                  <Input
                    label="Número *"
                    value={formData.adopterAddressNum}
                    onChange={(e) => setFormData({ ...formData, adopterAddressNum: e.target.value })}
                    required
                    disabled={!!editingAdoption}
                  />
                </div>
              </div>
              <Input
                label="Bairro *"
                value={formData.adopterNeighborhood}
                onChange={(e) => setFormData({ ...formData, adopterNeighborhood: e.target.value })}
                required
                disabled={!!editingAdoption}
              />
              <Input
                label="CEP *"
                value={formData.adopterZipCode}
                onChange={(e) => setFormData({ ...formData, adopterZipCode: e.target.value })}
                required
                disabled={!!editingAdoption}
              />

              {/* Dados da Adoção */}
              <div className="md:col-span-2 mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">dados da adoção</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selecione o animal *</label>
                <select 
                  required 
                  disabled={!!editingAdoption}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 transition-colors ${editingAdoption ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  value={formData.animalId}
                  onChange={e => setFormData({...formData, animalId: e.target.value})}
                >
                  <option value="">Escolha um pet da lista...</option>
                  {animals
                    .filter((a: any) => a.status === "disponível" || a.status === "em tratamento" || a.id === formData.animalId)
                    .map((an: any) => (
                      <option key={an.id} value={an.id}>
                        {an.name} ({an.species}) — {an.status}
                      </option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 transition-colors"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="solicitado">Solicitado</option>
                  <option value="em adaptação">Em Adaptação</option>
                  <option value="finalizado">Finalizado</option>
                  <option value="devolvido">Devolvido</option>
                </select>
              </div>

              <Input 
                disabled={!!editingAdoption}
                label="Data da adoção *" 
                type="date" 
                required
                value={formData.adoptionDate}
                onChange={e => setFormData({...formData, adoptionDate: e.target.value})}
              />
            </div>
            <div className="flex gap-3 justify-end w-85">
              <Button type="submit" className="min-w-[160px] text-sm py-2 px-4">
                {editingAdoption ? "Salvar Alterações" : "Adicionar"}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleCancel}
                className="min-w-[160px] text-sm py-2 px-4"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>

        {/* Campo de Busca */}
        <div className="mb-4">
          <Input
            label="buscar adoção"
            placeholder="Digite o nome do adotante ou animal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-gray-900"
          />
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-600">
              {filteredAdoptions.length} {filteredAdoptions.length === 1 ? 'adoção encontrada' : 'adoções encontradas'}
            </p>
          )}
        </div>

        {/* Estatísticas */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{adoptions.length}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-300">
            <p className="text-sm text-yellow-700 mb-1">Em Adaptação</p>
            <p className="text-2xl font-bold text-yellow-900">
              {adoptions.filter(a => a.status === "em adaptação").length}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-300">
            <p className="text-sm text-green-700 mb-1">Finalizadas</p>
            <p className="text-2xl font-bold text-green-900">
              {adoptions.filter(a => a.status === "finalizado").length}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-300">
            <p className="text-sm text-red-700 mb-1">Devolvidas</p>
            <p className="text-2xl font-bold text-red-900">
              {adoptions.filter(a => a.status === "devolvido").length}
            </p>
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

        {/* LISTAGEM */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAdoptions.map((a) => (
            <div key={a.id} className="bg-white rounded-[2rem] p-6 shadow-md border border-gray-50 relative group hover:-translate-y-1 transition-transform">
              <div className="absolute top-4 right-6 flex gap-2">
                <button 
                  className="text-gray-400 hover:text-teal-600 transition-colors p-1" 
                  onClick={() => {
                    setEditingAdoption(a);
                    setFormData({
                      id: a.id,
                      animalId: a.animal?.id || "",
                      adoptionDate: formatDateForInput(a.adoptionDate),
                      status: a.status,
                      observations: a.observations || "",
                      adopterName: a.adopter?.name || "",
                      adopterPhone: a.adopter?.phone || "",
                      adopterEmail: a.adopter?.email || "",
                      adopterAddress: a.adopter?.address || "",
                      adopterAddressNum: a.adopter?.addressNum || "",
                      adopterZipCode: a.adopter?.zipCode || "",
                      adopterNeighborhood: a.adopter?.neighborhood || "",
                      adopterCity: a.adopter?.city || "",
                      adopterState: a.adopter?.state || "",
                      adopterBirthDate: formatDateForInput(a.adopter?.birthDate || null)
                    });
                    // Scroll para o topo do formulário
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  title="Editar"
                >
                  <Edit size={18} />
                </button>
                <button 
                  className="text-gray-400 hover:text-teal-600 transition-colors p-1" 
                  onClick={() => {
                    setFormData(prev => ({ ...prev, id: a.id }));
                    setShowInfo(true);
                  }}
                  title="Informações"
                >
                  <Info size={18} />
                </button>
                <button 
                  className="text-gray-400 hover:text-red-500 transition-colors p-1" 
                  onClick={() => handleDelete(a.id)}
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex flex-col items-start w-full">
                <h3 className="mt-8 text-lg font-bold text-gray-800 mb-4">{a.adopter?.name} e {a.animal?.name}</h3>
                <div className="w-full flex justify-center mb-6">
                  <div className="flex -space-x-4">
                    <img src={a.animal?.imageUrl || "/default-animal.png"} className="w-16 h-16 rounded-full border-2 border-white object-cover z-0 shadow-sm" />
                  </div>
                </div>

                <div className="space-y-2 text-[11px] text-gray-700 w-full font-medium">
                  <div className="flex items-center gap-4">
                    <User size={14} className="text-gray-500 flex-shrink-0" />
                    <p><strong className="text-gray-900">Adotante:</strong> {a.adopter?.name}</p>
                  </div>
                  {a.adopter?.phone && (
                    <div className="flex items-center gap-4">
                      <Phone size={14} className="text-gray-500 flex-shrink-0" />
                      <p><strong className="text-gray-900">Telefone:</strong> {a.adopter.phone}</p>
                    </div>
                  )}
                  {a.adopter?.email && (
                    <div className="flex items-center gap-4">
                      <Mail size={14} className="text-gray-500 flex-shrink-0" />
                      <p><strong className="text-gray-900">E-mail:</strong> {a.adopter.email}</p>
                    </div>
                  )}
                  {a.adopter?.birthDate && (
                    <div className="flex items-center gap-4">
                      <Calendar size={14} className="text-gray-500 flex-shrink-0" />
                      <p><strong className="text-gray-900">Nascimento:</strong> {new Date(a.adopter.birthDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                    </div>
                  )}
                  {(a.adopter?.address || a.adopter?.addressNum) && (
                    <div className="flex items-center gap-4">
                      <Home size={14} className="text-gray-500 flex-shrink-0" />
                      <p><strong className="text-gray-900">Endereço:</strong> {a.adopter.address}{a.adopter.addressNum ? `, nº ${a.adopter.addressNum}` : ''}</p>
                    </div>
                  )}
                  {a.adopter?.neighborhood && (
                    <div className="flex items-center gap-4">
                      <Building2 size={14} className="text-gray-500 flex-shrink-0" />
                      <p><strong className="text-gray-900">Bairro:</strong> {a.adopter.neighborhood}</p>
                    </div>
                  )}
                  {(a.adopter?.city || a.adopter?.state) && (
                    <div className="flex items-center gap-4">
                      <MapPin size={14} className="text-gray-500 flex-shrink-0" />
                      <p><strong className="text-gray-900">Cidade/Estado:</strong> {[a.adopter.city, a.adopter.state].filter(Boolean).join(' - ')}</p>
                    </div>
                  )}
                  {a.adopter?.zipCode && (
                    <div className="flex items-center gap-4">
                      <MapPin size={14} className="text-gray-500 flex-shrink-0" />
                      <p><strong className="text-gray-900">CEP:</strong> {a.adopter.zipCode}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-4 pt-2">
                    <PawPrint size={14} className="text-gray-500 flex-shrink-0" />
                    <p><strong className="text-gray-900">Animal:</strong> {a.animal?.name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Calendar size={14} className="text-gray-500 flex-shrink-0" />
                    <p><strong className="text-gray-900">Data da Adoção:</strong> {new Date(a.adoptionDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                  </div>
                  <div className="pt-2">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold text-[10px] ${
                      a.status === 'devolvido' 
                        ? 'bg-red-100 text-red-700' 
                        : a.status === 'finalizado'
                        ? 'bg-green-100 text-green-700'
                        : a.status === 'em adaptação'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {a.status === 'devolvido' && <XCircle size={12} />}
                      {a.status === 'finalizado' && <CheckCircle size={12} />}
                      {(a.status === 'em adaptação' || a.status === 'solicitado') && <Clock size={12} />}
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