"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export default function VeterinarioPage() {
  const [animals, setAnimals] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Estado do formulário com onChange para permitir a escrita
  const [formData, setFormData] = useState({
    animalId: "",
    doctor: "",
    date: "",
    cost: "",
    illness: "",
    observations: ""
  })

  // Busca inicial de dados
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
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Envia para a rota de API veterinario
    const res = await fetch("/api/veterinario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
    
    if (res.ok) {
      // Limpa o formulário
      setFormData({ 
        animalId: "", 
        doctor: "", 
        date: "", 
        cost: "", 
        illness: "", 
        observations: "" 
      })
      
      // Atualiza a lista imediatamente chamando a função de busca
      fetchData()
    } else {
      alert("Erro ao registrar consulta. Verifique os campos.")
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Seção de Registro - Conforme image_4c7071.png */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 lowercase">registrar nova consulta</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 lowercase">selecione o animal</label>
                <select 
                  required
                  className="w-full p-2.5 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-orange-400 text-gray-700"
                  value={formData.animalId}
                  onChange={(e) => setFormData({...formData, animalId: e.target.value})}
                >
                  <option value="">Escolha um pet da lista...</option>
                  {animals.map((a: any) => (
                    <option key={a.id} value={a.id}>
                      {a.name} — (ID: {a.id.slice(-5)}) — {a.status}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400 mt-1">* Apenas animais cadastrados aparecem aqui.</p>
              </div>

              <Input 
                label="veterinário" 
                placeholder="nome do profissional"
                value={formData.doctor} 
                onChange={(e) => setFormData({...formData, doctor: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="data da consulta" 
                  type="date" 
                  value={formData.date} 
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
                <Input 
                  label="investimento" 
                  placeholder="R$ 0,00" 
                  value={formData.cost} 
                  onChange={(e) => setFormData({...formData, cost: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-4 flex flex-col">
              <Input 
                label="alguma enfermidade?" 
                placeholder="descreva se houver"
                value={formData.illness} 
                onChange={(e) => setFormData({...formData, illness: e.target.value})}
              />
              <div className="flex flex-col flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 lowercase">observações gerais</label>
                <textarea 
                  className="flex-1 p-3 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-orange-400 resize-none text-gray-700"
                  value={formData.observations}
                  onChange={(e) => setFormData({...formData, observations: e.target.value})}
                />
              </div>
              <div className="flex justify-end mt-2">
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 w-full md:w-40 text-white font-bold py-3 rounded-xl transition-colors">
                  adicionar +
                </Button>
              </div>
            </div>
          </form>
        </section>

        {/* Tabela de Histórico - Conforme protótipo image_9a3f86.png */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 lowercase">registro geral de resgates</h2>
            <div className="bg-gray-100 px-4 py-1 rounded-lg flex items-center gap-2">
              <span className="text-xs text-gray-400 font-bold uppercase">filtro</span>
              <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" />
              </svg>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-gray-400 uppercase border-b border-gray-50">
                  <th className="pb-4">nome</th>
                  <th className="pb-4">veterinário</th>
                  <th className="pb-4">vacinas/remédios</th>
                  <th className="pb-4">data</th>
                  <th className="pb-4">enfermidades</th>
                  <th className="pb-4">gasto total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-400 italic">Nenhum registro encontrado.</td>
                  </tr>
                ) : (
                  history.map((item: any) => (
                    <tr key={item.id} className="text-gray-700 hover:bg-gray-50 transition-colors">
                      <td className="py-4 flex items-center gap-3">
                        <img 
                          src={item.animal?.imageUrl || "/placeholder-pet.png"} 
                          className="w-10 h-10 rounded-full object-cover border border-gray-200" 
                        />
                        <span className="font-bold">{item.animal?.name || "Pet"}</span>
                      </td>
                      <td className="py-4">{item.doctor || "Não informado"}</td>
                      <td className="py-4 text-gray-500 max-w-xs truncate">{item.description || "Consulta"}</td>
                      <td className="py-4 text-gray-400">
                        {item.date ? new Date(item.date).toLocaleDateString('pt-BR') : "--"}
                      </td>
                      <td className="py-4">
                        <span className={item.illness ? "text-red-500 font-medium" : "text-gray-400"}>
                          {item.illness || "nenhuma"}
                        </span>
                      </td>
                      <td className="py-4 font-bold text-gray-900">
                        R$ {item.cost || "0,00"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}