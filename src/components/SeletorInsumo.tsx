'use client'

import { useState } from 'react'
import { Insumo } from '@/types'
import { Search, X } from 'lucide-react'

interface SeletorInsumoProps {
  insumos: Insumo[]
  onSelect: (insumoId: string) => void
  disabled?: boolean
  placeholder?: string
}

export default function SeletorInsumo({ 
  insumos, 
  onSelect, 
  disabled = false, 
  placeholder = "Selecione um insumo..." 
}: SeletorInsumoProps) {
  const [busca, setBusca] = useState('')
  const [aberto, setAberto] = useState(false)

  const insumosFiltrados = insumos.filter(insumo => 
    insumo.ativo && 
    insumo.nome.toLowerCase().includes(busca.toLowerCase())
  )

  const handleSelect = (insumoId: string) => {
    onSelect(insumoId)
    setBusca('')
    setAberto(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value)
            setAberto(true)
          }}
          onFocus={() => setAberto(true)}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {busca && (
          <button
            onClick={() => {
              setBusca('')
              setAberto(false)
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {aberto && !disabled && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setAberto(false)} 
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {insumosFiltrados.length > 0 ? (
              insumosFiltrados.map((insumo) => (
                <button
                  key={insumo.id}
                  onClick={() => handleSelect(insumo.id)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{insumo.nome}</p>
                      <p className="text-sm text-gray-500 capitalize">{insumo.tipo.replace('_', ' ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">
                        R$ {insumo.precoPorGrama.toFixed(4)}/g
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-gray-500">
                {busca ? 'Nenhum insumo encontrado' : 'Nenhum insumo disponível'}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}