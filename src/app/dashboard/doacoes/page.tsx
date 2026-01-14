"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export default function DoacoesPage() {
  const [donations, setDonations] = useState([])
  const [formData, setFormData] = useState({
    donorName: "",
    donationDate: "",
    quantity: "",
    product: "",
    observations: ""
  })

  const fetchDonations = async () => {
    const res = await fetch("/api/doacoes")
    const data = await res.json()
    setDonations(data)
  }

  useEffect(() => { fetchDonations() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch("/api/doacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
    setFormData({ donorName: "", donationDate: "", quantity: "", product: "", observations: "" })
    fetchDonations()
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Card de Registro */}
        <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">registrar doação de produtos</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="nome do doador" 
              placeholder="digite o nome do doador"
              value={formData.donorName}
              onChange={e => setFormData({...formData, donorName: e.target.value})}
            />
            <Input 
              label="data da doação" 
              type="date"
              value={formData.donationDate}
              onChange={e => setFormData({...formData, donationDate: e.target.value})}
            />
            <div className="space-y-4">
              <Input 
                label="quantidade" 
                placeholder="selecione uma quantidade"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: e.target.value})}
              />
              <Input 
                label="tipo de produto" 
                placeholder="selecione um tipo de produto"
                value={formData.product}
                onChange={e => setFormData({...formData, product: e.target.value})}
              />
            </div>
            <div className="flex flex-col h-full">
               <label className="text-sm font-medium text-gray-700 mb-1">observações gerais</label>
               <textarea 
                 className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                 value={formData.observations}
                 onChange={e => setFormData({...formData, observations: e.target.value})}
               />
               <div className="mt-4 flex justify-end">
                 <Button type="submit" className="w-48 bg-orange-400 hover:bg-orange-500">
                   adicionar +
                 </Button>
               </div>
            </div>
          </form>
        </section>

        {/* Tabela de Doações */}
        <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">registro geral de doações</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm text-gray-500 border-b">
                <th className="pb-4 font-medium">nome do doador</th>
                <th className="pb-4 font-medium">produto</th>
                <th className="pb-4 font-medium">quantidade</th>
                <th className="pb-4 font-medium">data da doação</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {donations.map((d: any) => (
                <tr key={d.id} className="text-gray-700">
                  <td className="py-4 font-bold">{d.donorName}</td>
                  <td className="py-4">{d.product}</td>
                  <td className="py-4 text-center">{d.quantity}</td>
                  <td className="py-4">{new Date(d.donationDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </DashboardLayout>
  )
}