'use client'

import Navigation from '@/components/Navigation'
import MarginCalculator from '@/components/MarginCalculator'

export default function CalculadoraPage() {


  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="md:pl-64">
        <main className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Calculadoras</h1>
              <p className="text-gray-600 mt-2">Ferramentas para cálculo de custos e margens</p>
            </div>
          </div>

          <MarginCalculator />

        </main>
      </div>
    </div>
  )
}