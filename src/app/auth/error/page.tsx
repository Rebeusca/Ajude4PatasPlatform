"use client"

import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { Suspense } from "react"

// Força o Next.js a tratar a página como dinâmica, ignorando erros de build estático
export const dynamic = "force-dynamic";

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
    <div className="min-h-screen bg-[#FFFDD0] relative overflow-hidden flex items-center justify-center px-4">
      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <Image src="/logo.png" alt="Logo" width={120} height={120} />
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro na Autenticação</h1>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <Link href="/auth/login">
            <Button className="w-full">Voltar para o Login</Button>
          </Link>
        </div>
      </div>
      <Image src="/dog-background-login.png" alt="Dog" width={850} height={850} className="absolute bottom-0 right-0 opacity-30" />
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AuthErrorContent />
    </Suspense>
  )
}