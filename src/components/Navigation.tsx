'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Package, 
  Cherry, 
  Calculator,
  FileText,
  Menu,
  X,
  BookOpen,
  ChefHat,
  Truck,
  Coffee,
  Brain,
  Settings
} from 'lucide-react'
import { useState } from 'react'

const navigationItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/embalagens', label: 'Embalagens', icon: Package },
  { href: '/insumos', label: 'Insumos', icon: Cherry },
  { href: '/copos', label: 'Copos', icon: Coffee },
  { href: '/fornecedores', label: 'Fornecedores', icon: Truck },
  { href: '/receitas', label: 'Receitas', icon: ChefHat },
  { href: '/cardapio', label: 'Cardápio', icon: BookOpen },
  { href: '/calculadora', label: 'Calculadoras', icon: Calculator },
  { href: '/avancado', label: 'IA Avançada', icon: Brain, badge: 'NOVO' },
  { href: '/integracao', label: 'Integração', icon: Package, badge: 'BETA' },
  { href: '/relatorios', label: 'Relatórios', icon: FileText },
]

export default function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow sidebar-gradient overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 py-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Cherry className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold text-white">Açaí Delivery</h1>
                <p className="text-purple-200 text-sm font-medium">Sistema Premium</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-4 space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-purple-800/50 text-white border-r-2 border-purple-400 font-semibold shadow-lg'
                      : 'text-purple-200 hover:text-white hover:bg-purple-800/30'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 transition-all duration-200 ${
                    isActive ? 'text-purple-200' : 'text-purple-300 group-hover:text-white'
                  }`} />
                  <span className="flex-1">{item.label}</span>
                  {'badge' in item && (
                    <span className="ml-2 px-2 py-1 text-xs font-bold bg-yellow-400 text-yellow-900 rounded-full">
                      {(item as { badge: string }).badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
          
          {/* Footer da Sidebar */}
          <div className="p-4 mt-auto">
            <div className="bg-purple-800/30 rounded-lg p-3 backdrop-blur-sm border border-purple-700/50">
              <p className="text-xs text-purple-200 text-center font-medium">
                Design System Premium
              </p>
              <p className="text-xs text-purple-300 text-center mt-1">
                v2.0 - Glassmorphism
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex items-center gap-x-4 bg-white/95 backdrop-blur-md border-b border-purple-100/50 px-4 py-4 shadow-lg sm:px-6 md:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Cherry className="w-5 h-5 text-white" />
          </div>
          <h1 className="ml-3 heading-section">Açaí Delivery</h1>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="relative z-50 md:hidden">
          <div className="fixed inset-0 modal-overlay" />
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button
                  type="button"
                  className="-m-2.5 p-2.5 bg-black/20 rounded-full backdrop-blur-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              
              <div className="flex grow flex-col gap-y-5 overflow-y-auto sidebar-gradient px-6 pb-4">
                <div className="flex h-20 shrink-0 items-center pt-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Cherry className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <h1 className="text-lg font-bold text-white">Açaí Delivery</h1>
                    <p className="text-purple-200 text-xs">Sistema Premium</p>
                  </div>
                </div>
                
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigationItems.map((item) => {
                          const isActive = pathname === item.href
                          const Icon = item.icon
                          
                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium transition-all duration-200 ${
                                  isActive
                                    ? 'bg-purple-800/50 text-white font-semibold shadow-lg'
                                    : 'text-purple-200 hover:text-white hover:bg-purple-800/30'
                                }`}
                              >
                                <Icon className="h-5 w-5 shrink-0" />
                                {item.label}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </li>
                  </ul>
                </nav>
                
                {/* Footer Mobile */}
                <div className="mt-auto">
                  <div className="bg-purple-800/30 rounded-lg p-3 backdrop-blur-sm border border-purple-700/50">
                    <p className="text-xs text-purple-200 text-center font-medium">
                      v2.0 - Glassmorphism
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}