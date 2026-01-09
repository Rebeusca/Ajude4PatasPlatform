import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import NextAuth from "next-auth"

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const user = await prisma.user.findUnique({
            where: { email: String(credentials.email) }
          })

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            String(credentials.password),
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error("Erro na autenticação:", error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  trustHost: true,
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Se a URL começar com /, é uma URL relativa
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Se a URL for do mesmo domínio, permitir
      if (new URL(url).origin === baseUrl) return url
      // Caso contrário, redirecionar para o dashboard
      return `${baseUrl}/dashboard`
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }: any) {
      if (session?.user && token) {
        if (token.id && typeof token.id !== 'function') {
          (session.user as any).id = token.id
        }
        if (token.role && typeof token.role !== 'function') {
          (session.user as any).role = token.role
        }
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Criar instância do NextAuth e exportar auth e handlers
export const { auth, handlers } = NextAuth(authOptions)