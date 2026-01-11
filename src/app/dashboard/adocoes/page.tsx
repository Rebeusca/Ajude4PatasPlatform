"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

interface Adoption {
  id: string
  adopterName: string
  adopterAddress: string | null
  adopterPhone: string | null
  adopterEmail: string | null
  adopterImageUrl: string | null
  volunteerInCharge: string | null
  adoptionDate: string
  status: string
  animal: {
    name: string
    imageUrl: string | null
  }
}

export default function AdocoesPage() {
  const { data: session, status } = useSession()
  const [adoptions, setAdoptions] = useState<Adoption[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const [formData, setFormData] = useState({
    animalId: "",
    adopterName: "",
    adopterAddress: "",
    adopterPhone: "",
    adopterEmail: "",
    adopterImageUrl: "",
    volunteerInCharge: "",
    status: "finalizado"
  })

  useEffect(() => {
    if (status === "unauthenticated") redirect("/auth/login")
    if (status === "authenticated") fetchAdoptions()
  }, [status])

  const fetchAdoptions = async () => {
    try {
      const res = await fetch("/api/adocoes")
      const data = await res.json()
      setAdoptions(data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch("/api/adocoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
    setShowForm(false)
    fetchAdoptions()
  }

  const filteredAdoptions = adoptions.filter(a => 
    a.adopterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.animal.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Cabeçalho Conforme Protótipo */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">registro geral de adoções</h1>
          
          <div className="flex items-center gap-3">
            <input 
              type="text"
              placeholder="filtro"
              className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm outline-none w-48"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-xl font-bold"
            >
              adicionar +
            </Button>
          </div>
        </div>

        {/* Formulário de Cadastro */}
        {showForm && (
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">cadastrar nova adoção</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="ID do Animal" value={formData.animalId} onChange={e => setFormData({...formData, animalId: e.target.value})} />
              <Input label="Nome do Adotante" value={formData.adopterName} onChange={e => setFormData({...formData, adopterName: e.target.value})} />
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>cancelar</Button>
                <Button type="submit" className="bg-teal-500">salvar</Button>
              </div>
            </form>
          </section>
        )}

        {/* Grid de Cards - Implementação fiel à image_4013a6.png */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAdoptions.map((a) => (
            <div key={a.id} className="bg-white rounded-[2rem] p-6 shadow-md border border-gray-50 relative group">
              <div className="absolute top-4 right-6 flex gap-2">
                <button className="text-gray-400 hover:text-teal-600">✎</button>
                <button className="text-gray-400 hover:text-red-500">✕</button>
              </div>

              <div className="flex flex-col items-start">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{a.adopterName} e {a.animal.name}</h3>
                
                {/* Fotos Cruzadas */}
                <div className="w-full flex justify-center mb-6">
                  <div className="flex -space-x-4">
                    <img 
                      src={a.adopterImageUrl || "/default-avatar.png"} 
                      className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-sm z-10"
                    />
                    <img 
                      src={a.animal.imageUrl || "/default-animal.png"} 
                      className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-sm z-0"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-gray-600 w-full">
                  <p><strong>nome completo:</strong> {a.adopterName}</p>
                  <p><strong>endereço:</strong> {a.adopterAddress}</p>
                  <p><strong>telefone:</strong> {a.adopterPhone}</p>
                  <p><strong>e-mail:</strong> {a.adopterEmail}</p>
                  <p><strong>voluntário responsável:</strong> {a.volunteerInCharge}</p>
                  <p><strong>data da adoção:</strong> {new Date(a.adoptionDate).toLocaleDateString()}</p>
                  <div className="pt-2">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-[10px]">
                      status da adoção: {a.status}
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