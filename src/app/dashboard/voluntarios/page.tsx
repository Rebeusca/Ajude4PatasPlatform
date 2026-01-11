"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export default function VoluntariosPage() {
  const [volunteers, setVolunteers] = useState([])
  // Estado para controlar os campos do formulário
  const [formData, setFormData] = useState({
    name: "", 
    age: "", 
    workArea: "", 
    schedule: "", 
    entryDate: "", 
    imageUrl: ""
  })

  const fetchVolunteers = async () => {
    const res = await fetch("/api/voluntarios")
    const data = await res.json()
    setVolunteers(data)
  }

  useEffect(() => { fetchVolunteers() }, [])

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch("/api/voluntarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
    // Limpa o formulário após adicionar
    setFormData({ name: "", age: "", workArea: "", schedule: "", entryDate: "", imageUrl: "" })
    fetchVolunteers()
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 p-4 md:p-0">
        <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">registrar novo voluntário</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* O segredo está no onChange abaixo: ele atualiza o estado conforme você digita */}
            <Input 
              label="nome do voluntário" 
              placeholder="digite o nome" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <Input 
              label="horários de atuação" 
              placeholder="ex: 08:00 - 12:00" 
              value={formData.schedule} 
              onChange={(e) => setFormData({...formData, schedule: e.target.value})}
            />
            <Input 
              label="idade" 
              type="number" 
              value={formData.age} 
              onChange={(e) => setFormData({...formData, age: e.target.value})}
            />
            <Input 
              label="área de atuação" 
              placeholder="ex: berçário" 
              value={formData.workArea} 
              onChange={(e) => setFormData({...formData, workArea: e.target.value})}
            />
            <Input 
              label="data da entrada" 
              type="date" 
              value={formData.entryDate} 
              onChange={(e) => setFormData({...formData, entryDate: e.target.value})}
            />
            <Input 
              label="URL da foto (opcional)" 
              placeholder="https://..." 
              value={formData.imageUrl} 
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
            />
            <div className="md:col-span-2 flex justify-end mt-4">
              <Button type="submit" className="w-full md:w-48 bg-orange-400">adicionar +</Button>
            </div>
          </form>
        </section>

        {/* Grid de Cards conforme image_9a428e.png */}
        <h2 className="text-xl font-bold text-gray-800">registro geral de voluntários</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {volunteers.map((v: any) => (
            <div key={v.id} className="bg-white rounded-2xl p-6 shadow-md border border-gray-50 relative">
               <div className="flex flex-col items-center">
                  <img 
                    src={v.imageUrl || "/default-avatar.png"} 
                    className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-100" 
                  />
                  <h3 className="text-lg font-bold text-gray-900">{v.name}</h3>
                  <div className="w-full mt-4 space-y-1 text-[11px] text-gray-600">
                    <p><strong>idade:</strong> {v.age} anos</p>
                    <p><strong>data de entrada:</strong> {v.entryDate ? new Date(v.entryDate).toLocaleDateString() : '--'}</p>
                    <p><strong>área de atuação:</strong> {v.workArea}</p>
                    <p><strong>horário de atuação:</strong> {v.schedule}</p>
                  </div>
                  
                  {/* Barras de Status Conforme Protótipo */}
                  <div className="w-full mt-4 space-y-2">
                    <div className="h-5 bg-green-100 rounded-full flex items-center px-3 text-[10px] text-green-700 font-bold justify-between">
                      <span>horas trabalhadas:</span>
                      <span>{v.workedHours || 0} horas</span>
                    </div>
                    <div className="h-5 bg-red-100 rounded-full flex items-center px-3 text-[10px] text-red-700 font-bold justify-between">
                      <span>absenteísmo:</span>
                      <span>{v.absenteeism || 0}%</span>
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