"use client"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Verificar se há erro na URL (vindo de redirecionamento)
  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      setError("Email ou senha inválidos. Verifique suas credenciais e tente novamente.")
      // Limpar o parâmetro da URL
      router.replace("/auth/login", { scroll: false })
    }
  }, [searchParams, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
    
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: callbackUrl,
      })

      if (result?.error) {
        setError("Email ou senha inválidos. Verifique suas credenciais e tente novamente.")
        setIsLoading(false)
      } else if (result?.ok) {
        await new Promise(resolve => setTimeout(resolve, 200))
        
        try {
          const sessionResponse = await fetch("/api/auth/session", {
            method: "GET",
            cache: "no-store",
            credentials: "include",
          })
          
          const sessionData = await sessionResponse.json()
          
          if (sessionData && sessionData.user) {
            window.location.href = callbackUrl
          } else {
            await new Promise(resolve => setTimeout(resolve, 300))
            window.location.href = callbackUrl
          }
        } catch (err) {
          console.error("Erro ao verificar sessão:", err)
          await new Promise(resolve => setTimeout(resolve, 500))
          window.location.href = callbackUrl
        }
      } else {
        setError("Erro ao fazer login. Tente novamente.")
        setIsLoading(false)
      }
    } catch (err: any) {
      console.error("Erro no login:", err)
      setError("Erro ao fazer login. Tente novamente.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFDD0] relative overflow-hidden">
      {/* Header with logo */}
      <header className="absolute top-8 left-8 z-10">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={64} height={64} />
          <span className="text-teal-400 text-lg font-semibold">
            página administrativa
          </span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex items-center justify-center min-h-screen px-4 py-20">
        <div className="w-full max-w-md relative z-10">
          {/* Large logo above card - sobrepondo o card */}
          <div className="flex justify-center -mb-12 relative z-20">
            <Image src="/logo.png" alt="Logo" width={160} height={160} />
          </div>

          {/* Login card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 pt-16 relative z-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Input
                type="email"
                placeholder="e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-gray-700 placeholder:text-gray-400"
              />

              <Input
                type="password"
                placeholder="senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-gray-700 placeholder:text-gray-400"
              />

              <div className="pt-6">
                <Button type="submit" isLoading={isLoading}>
                  entrar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Image src="/dog-background-login.png" alt="Dog" width={850} height={850} className="absolute bottom-0 right-0" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFFDD0] flex items-center justify-center">
        <div className="text-teal-400 text-lg">Carregando...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}