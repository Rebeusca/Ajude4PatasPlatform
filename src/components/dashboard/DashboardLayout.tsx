"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Home, PawPrint, HeartPulse, Users, HeartHandshake, Heart, Menu, X } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigationItems = [
  { name: "visão geral", href: "/dashboard", icon: Home },
  { name: "animais", href: "/dashboard/animais", icon: PawPrint },
  { name: "histórico veterinário", href: "/dashboard/veterinario", icon: HeartPulse },
  { name: "voluntários", href: "/dashboard/voluntarios", icon: Users },
  { name: "doações", href: "/dashboard/doacoes", icon: HeartHandshake },
  { name: "adoções", href: "/dashboard/adocoes", icon: Heart },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const handleLogout = async () => {
    try {
      await signOut({ 
        redirect: true,
        callbackUrl: "/auth/login"
      })
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      // Fallback: redirecionar manualmente em caso de erro
      router.push("/auth/login")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Overlay para mobile */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-50 w-80 flex-shrink-0 flex flex-col transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ backgroundColor: '#0DB2AC' }}
      >
        {/* Logo */}
        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: '#0A8C87' }}>
          <div className="flex items-center justify-center flex-1">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full"></div>
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={60} 
                height={60} 
                className="absolute z-10" 
              />
            </div>
          </div>
          {/* Botão fechar para mobile */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="md:hidden text-white hover:opacity-80 p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-4 pb-4 pl-4 pr-0 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/dashboard" && pathname?.startsWith(item.href))
            const IconComponent = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`
                  flex items-center gap-3 pl-4 pr-4 py-3 rounded-l-lg transition-colors cursor-pointer
                  ${isActive 
                    ? "text-white font-medium" 
                    : "text-white/90 hover:bg-white/10"
                  }
                `}
                style={isActive ? { backgroundColor: '#0A8C87' } : {}}
              >
                <IconComponent size={20} />
                <span className="capitalize text-sm">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t" style={{ borderColor: '#0A8C87' }}>
          <div className="mb-3">
            <p className="text-sm font-medium text-white">
              {session?.user?.name || session?.user?.email}
            </p>
            <p className="text-xs text-white/80 capitalize">
              {session?.user?.role}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer hover:opacity-90"
            style={{ backgroundColor: '#0A8C87' }}
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full md:w-auto">
        {/* Header Responsivo (mobile) */}
        <header className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3" style={{ backgroundColor: '#0DB2AC' }}>
          <div className="relative flex items-center justify-center">
            <div className="w-10 h-10 bg-white rounded-full"></div>
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={40} 
              height={40} 
              className="absolute z-10" 
            />
          </div>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 text-white hover:opacity-80 transition-opacity"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-16 md:pt-8" style={{ backgroundColor: '#FFE66D' }}>
          {children}
        </div>
      </main>
    </div>
  )
}

