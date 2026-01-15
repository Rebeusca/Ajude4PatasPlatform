"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

interface Adopter {
  id: string
  name: string
  address: string | null
  addressNum: string | null
  zipCode: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
  phone: string | null
  birthDate: string
  email: string | null
  observations: string
  imagemUrl: string | null
}

export default function AdocoesPage() {
  const { data: session, status } = useSession()
  const [adopters, setAdopters] = useState<Adopter[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAdopter, setEditingAdopter] = useState<Adopter | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showInfo, setShowInfo] = useState(false)

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    address: "",
    addressNum: "",
    zipCode: "",
    neighborhood: "",
    city: "",
    state: "",
    phone: "",
    birthDate: "",
    email: "",
    observations: "",
    imagemUrl: ""
  })

  useEffect(() => {
    if (status === "unauthenticated") redirect("/auth/login")
    if (status === "authenticated") fetchAdoptions()
  }, [status])

  const fetchAdoptions = async () => {
    try {
      const res = await fetch("/api/adotante")
      const data = await res.json()
      setAdopters(data)
      setLoading(false)
    } catch (error) {
      console.error("Erro ao buscar adoções:", error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = editingAdopter ? "PUT" : "POST"
      const url = editingAdopter ? `/api/adotante/${formData.id}` : "/api/adotante"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        throw new Error("Erro ao salvar adotante")
      }

      // Limpa o formulário e fecha o modal
      setFormData({
        id: "",
        name: "",
        address: "",
        addressNum: "",
        zipCode: "",
        neighborhood: "",
        city: "",
        state: "",
        phone: "",
        birthDate: "",
        email: "",
        observations: "",
        imagemUrl: ""
      })
      setEditingAdopter(null)
    } catch (error) {
      console.error("Erro ao salvar adotante:", error)
    }

    setShowForm(false)
    fetchAdoptions()
  }

  const formatDateForInput = (dateString: string | null) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
  };

  const filteredAdopters = adopters.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 lowercase">registro geral de adotantes</h1>
          
          <div className="flex items-center gap-3">
            <Input
              placeholder="Buscar adotante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-gray-900"
            />
            <Button 
              onClick={() => {
                setShowForm(true);
                setEditingAdopter(null);
                setFormData({
                  id: "",
                  name: "",
                  address: "",
                  addressNum: "",
                  zipCode: "",
                  neighborhood: "",
                  city: "",
                  state: "",
                  phone: "",
                  birthDate: "",
                  email: "",
                  observations: "",
                  imagemUrl: ""
                });
              }}
              className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-bold whitespace-nowrap"
            >
              Novo Adotante
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
            <p className="text-sm text-gray-600 mb-1">Total de Adotantes</p>
            <p className="text-2xl font-bold text-gray-900">{adopters.length}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
            <p className="text-sm text-blue-700 mb-1">Com Observações</p>
            <p className="text-2xl font-bold text-blue-900">
              {adopters.filter(a => a.observations && a.observations !== "Nenhuma observação adicionada.").length}
            </p>
          </div>
        </div>

    {/* Formulário de Cadastro */}
    {/* MODAL DE CADASTRO (Substitui o formulário antigo) */}
{showForm && (
  <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-4">
    {/* Card Branco Centralizado */}
    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{editingAdopter ? "editar adotante" : "cadastrar novo adotante"}</h2>
          {/* Botão de Fechar (X) */}
          <button 
            onClick={() => {
              setShowForm(false);
              if(editingAdopter) setEditingAdopter(null);
              setFormData({
                id: "",
                name: "",
                address: "",
                addressNum: "",
                zipCode: "",
                neighborhood: "",
                city: "",
                state: "",
                phone: "",
                birthDate: "",
                email: "",
                observations: "",
                imagemUrl: ""
              });
            }}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <span className="text-2xl">✕</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Nome *" 
              placeholder="Nome do adotante"
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
            <Input 
              label="Data de Nascimento *" 
              type="date" 
              value={formData.birthDate} 
              onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
              required
            />
            <Input 
              label="Cidade *" 
              placeholder="São Paulo"
              value={formData.city}
              onChange={e => setFormData({...formData, city: e.target.value})}
              required
            />
            <Input 
              label="Estado *" 
              placeholder="SP"
              value={formData.state}
              onChange={e => setFormData({...formData, state: e.target.value})}
              required
            />
            <div className="md:col-span-2 grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Input 
                  label="Endereço *"
                  placeholder="Rua Exemplo"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>
              <div>
                <Input 
                  label="Número *"
                  placeholder="nº"
                  value={formData.addressNum}
                  onChange={e => setFormData({...formData, addressNum: e.target.value})}
                  required
                />
              </div>
            </div>
            <Input 
              label="Bairro *" 
              placeholder="Centro"
              value={formData.neighborhood}
              onChange={e => setFormData({...formData, neighborhood: e.target.value})}
              required
            />
            <Input 
              label="CEP *" 
              placeholder="00000-000"
              value={formData.zipCode}
              onChange={e => setFormData({...formData, zipCode: e.target.value})}
              required
            />
            <Input 
              label="E-mail" 
              placeholder="digite o e-mail do adotante"
              type="email"
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
            <Input
              label="Telefone *"
              placeholder="(99) 99999-9999"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 justify-end w-85">
            <Button type="submit" className="min-w-[160px] text-sm py-2 px-4">
              {editingAdopter ? "Salvar Alterações" : "Adicionar"}
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => {
                setShowForm(false);
                if(editingAdopter) setEditingAdopter(null);
                setFormData({
                  id: "",
                  name: "",
                  address: "",
                  addressNum: "",
                  zipCode: "",
                  neighborhood: "",
                  city: "",
                  state: "",
                  phone: "",
                  birthDate: "",
                  email: "",
                  observations: "",
                  imagemUrl: ""
                });
              }}
              className="min-w-[160px] text-sm py-2 px-4"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

{showInfo && (
          <div className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">Detalhes do Adotante</h2>
                <button onClick={() => setShowInfo(false)} className="text-gray hover:text-red-500">❌</button>
              </div>
              <div className="space-y-4">
                <p><strong className="text-black">Observações:</strong></p>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-700 italic border border-gray-200">
                  {adopters.find(a => a.id === formData.id)?.observations || "Sem observações adicionais."}
                </div>
              </div>
            </div>
          </div>
        )}

    {filteredAdopters.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">👤</div> {/* Opcional: Emoji ou Ícone */}
        <p className="text-gray-400 italic text-lg">
          Nenhum registro encontrado.
        </p>
      </div>
    ) : (
      // SE TIVER DADOS, MOSTRA O GRID
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAdopters.map((a) => (
          <div key={a.id} className="bg-white rounded-[2rem] p-6 shadow-md border border-gray-50 relative group hover:-translate-y-1 transition-transform">
            <div className="absolute top-4 right-6 flex gap-2">
                <button 
                  className="text-gray-400 hover:text-teal-600"
                  onClick={() => {
                    setShowForm(true)
                    setEditingAdopter(a)
                    setFormData({
                      id: a.id,
                      name: a.name,
                      address: a.address || "",
                      addressNum: a.addressNum || "",
                      zipCode: a.zipCode || "",
                      neighborhood: a.neighborhood || "",
                      city: a.city || "",
                      state: a.state  || "",
                      phone: a.phone || "",
                      // ALTERAÇÃO AQUI: Formata a data antes de passar para o estado
                      birthDate: formatDateForInput(a.birthDate), 
                      email: a.email || "",
                      observations: a.observations || "",
                      imagemUrl: a.imagemUrl || ""
                    })
                  }}
                >
                  ✏️
                </button>
              <button className="text-gray-400 hover:text-teal-600"
              onClick={() => {setShowInfo(true)
                setFormData(prev => ({...prev, id: a.id}))
              
              }}
              >ℹ️</button>
                <button className="text-gray-400 hover:text-red-500"
                onClick={async () => {
                const confirmDelete = window.confirm("Tem certeza que deseja deletar este adotante?");
                if (confirmDelete) {
                  try {
                  await fetch(`/api/adotante/${a.id}`, {
                    method: "DELETE",
                  });
                  fetchAdoptions();
                  } catch (error) {
                  console.error("Erro ao deletar adotante:", error);
                  }
                }
                }}
                >❌</button>
            </div>

            <div className="flex flex-col items-start w-full">
              <h3 className="text-lg font-bold text-gray-800 mb-4">{a.name}</h3>
              
              {/* Fotos Cruzadas */}
              <div className="w-full flex justify-center mb-6">
                <div className="flex -space-x-4">
                  <img 
                    src={a.imagemUrl || "/default-avatar.png"} 
                    className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-sm z-10"
                  />
                </div>
              </div>

              <div className="space-y-1 text-[11px] text-gray-600 w-full">
                <p><strong>nome completo:</strong> {a.name}</p>
                <p><strong>endereço:</strong> {a.address},N°{a.addressNum}.{a.neighborhood} - CEP {a.zipCode}</p>
                <p><strong>telefone:</strong> {a.phone}</p>
                <p><strong>e-mail:</strong> {a.email}</p>
                <p><strong>data da adoção:</strong> {new Date(a.birthDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
    {/* --- FIM DA LÓGICA --- */}

  </div>
</DashboardLayout>
  )
}