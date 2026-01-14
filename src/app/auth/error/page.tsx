"use client"

import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { Suspense } from "react"

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const errorMessages: Record<string, string> = {
    Configuration: "Há um problema com a configuração do servidor.",
    AccessDenied: "Você não tem permissão para fazer login.",
    Verification: "O link de verificação expirou ou já foi usado.",
    CredentialsSignin: "Email ou senha inválidos. Verifique suas credenciais e tente novamente.",
    Default: "Ocorreu um erro ao fazer login. Tente novamente.",
  }

  const errorMessage = errorMessages[error || ""] || errorMessages.Default

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFFDD0] px-4">
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={120} 
            height={120} 
          />
        </div>

        <div className="rounded-2xl bg-white p-8 text-center shadow-xl">
          <div className="mb-4 text-6xl">⚠️</div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Erro na Autenticação
          </h1>
          <p className="mb-6 text-gray-600">
            {errorMessage}
          </p>

          <Link href="/auth/login">
            <Button className="w-full">
              Voltar para o Login
            </Button>
          </Link>
        </div>
      </div>

      <Image
        src="/dog-background-login.png"
        alt="Dog"
        width={850}
        height={850}
        className="absolute bottom-0 right-0 opacity-30"
      />
      
    </div>
  )
}
export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFFDD0] flex items-center justify-center">
        <div className="text-teal-400 text-lg">Carregando...</div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}