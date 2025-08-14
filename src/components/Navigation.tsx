'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Package, 
  Cherry, 
  ShoppingBag, 
  Calculator,
  FileText,
  Menu,
  X,
  BookOpen,
  ChefHat
} from 'lucide-react'
import { useState } from 'react'

const navigationItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/embalagens', label: 'Embalagens', icon: Package },
  { href: '/insumos', label: 'Insumos', icon: Cherry },
  { href: '/receitas', label: 'Receitas', icon: ChefHat },
  { href: '/produtos', label: 'Produtos', icon: ShoppingBag },
  { href: '/cardapio', label: 'Cardápio', icon: BookOpen },
  { href: '/calculadora', label: 'Calculadoras', icon: Calculator },
  { href: '/relatorios', label: 'Relatórios', icon: FileText },
]

export default function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow bg-purple-900 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Cherry className="w-6 h-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-white">Açaí Delivery</h1>
                <p className="text-purple-300 text-sm">Precificação</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-800 text-white'
                      : 'text-purple-200 hover:bg-purple-800 hover:text-white'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex items-center gap-x-4 bg-white px-4 py-4 shadow-sm sm:px-6 md:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="flex items-center">
          <Cherry className="w-8 h-8 text-purple-600" />
          <h1 className="ml-2 text-lg font-bold text-gray-900">Açaí Delivery</h1>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="relative z-50 md:hidden">
          <div className="fixed inset-0 bg-gray-900/80" />
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button
                  type="button"
                  className="-m-2.5 p-2.5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-purple-900 px-6 pb-2">
                <div className="flex h-16 shrink-0 items-center">
                  <Cherry className="h-8 w-8 text-white" />
                  <h1 className="ml-2 text-lg font-bold text-white">Açaí Delivery</h1>
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
                                className={`flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                                  isActive
                                    ? 'bg-purple-800 text-white'
                                    : 'text-purple-200 hover:text-white hover:bg-purple-800'
                                }`}
                              >
                                <Icon className="h-6 w-6 shrink-0" />
                                {item.label}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}