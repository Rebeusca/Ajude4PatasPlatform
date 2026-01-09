"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { HomeIcon, PawPrintIcon, HeartPulseIcon, UsersIcon, HeartHandshakeIcon, HeartIcon } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigationItems = [
  { name: "visão geral", href: "/dashboard", icon: <HomeIcon /> },
  { name: "animais", href: "/dashboard/animais", icon: <PawPrintIcon /> },
  { name: "histórico veterinário", href: "/dashboard/veterinario", icon: <HeartPulseIcon /> },
  { name: "voluntários", href: "/dashboard/voluntarios", icon: <UsersIcon /> },
  { name: "doações", href: "/dashboard/doacoes", icon: <HeartHandshakeIcon /> },
  { name: "adoções", href: "/dashboard/adocoes", icon: < HeartIcon /> },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-80 flex-shrink-0 flex flex-col" style={{ backgroundColor: '#0DB2AC' }}>
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: '#0A8C87' }}>
          <div className="flex items-center justify-center">
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
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-4 pb-4 pl-4 pr-0 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/dashboard" && pathname?.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 pl-4 pr-4 py-3 rounded-l-lg transition-colors
                  ${isActive 
                    ? "text-white font-medium" 
                    : "text-white/90 hover:bg-white/10"
                  }
                `}
                style={isActive ? { backgroundColor: '#0A8C87' } : {}}
              >
                <span className="text-sm">{item.icon}</span>
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
            className="w-full px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: '#0A8C87' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0A8C87'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0A8C87'}
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: '#FFE66D' }}>
          {children}
        </div>
      </main>
    </div>
  )
}

