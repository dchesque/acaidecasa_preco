'use client'

import { useState, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import { formatCurrency } from '@/utils/formatters'
import { 
  Crown, 
  Star, 
  BarChart3, 
  Table, 
  TrendingUp,
  TrendingDown,
  Clock,
  Shield,
  DollarSign,
  Award,
  CheckCircle,
  AlertTriangle,
  ArrowRightLeft,
  Download,
  Filter,
  Package
} from 'lucide-react'

interface FornecedorComparacao {
  id: string
  nome: string
  precoBruto: number
  percentualDesconto: number
  precoFinal: number
  prazoEntrega: number
  confiabilidade: number // 1-5
  tempoResposta: number // horas
  qualidade: number // 1-5
  ativo: boolean
  economia: number
  isRecomendado: boolean
}

interface ScoreIndicatorProps {
  score: number
  max: number
  size?: 'sm' | 'md' | 'lg'
}

interface ComparadorFornecedoresVisualProps {
  insumoId?: string
}

function ScoreIndicator({ score, max, size = 'md' }: ScoreIndicatorProps) {
  const sizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }
  
  return (
    <div className="flex gap-1">
      {[...Array(max)].map((_, i) => (
        <Star
          key={i}
          className={`${sizes[size]} ${
            i < score ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: 'ativo' | 'inativo' | 'recomendado' }) {
  const config = {
    ativo: { bg: 'bg-green-100', text: 'text-green-800', label: 'Ativo' },
    inativo: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inativo' },
    recomendado: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Recomendado' }
  }
  
  const { bg, text, label } = config[status]
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  )
}

function TabelaComparativa({ fornecedores, onTrocarFornecedor }: {
  fornecedores: FornecedorComparacao[]
  onTrocarFornecedor: (fornecedor: FornecedorComparacao) => void
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-4 font-medium text-gray-900">Fornecedor</th>
            <th className="text-center p-4 font-medium text-gray-900">Preço Base</th>
            <th className="text-center p-4 font-medium text-gray-900">Desconto</th>
            <th className="text-center p-4 font-medium text-gray-900">Preço Final</th>
            <th className="text-center p-4 font-medium text-gray-900">Prazo</th>
            <th className="text-center p-4 font-medium text-gray-900">Qualidade</th>
            <th className="text-center p-4 font-medium text-gray-900">Economia</th>
            <th className="text-center p-4 font-medium text-gray-900">Status</th>
            <th className="text-center p-4 font-medium text-gray-900">Ação</th>
          </tr>
        </thead>
        <tbody>
          {fornecedores.map((f, index) => (
            <tr 
              key={f.id}
              className={`border-b border-gray-100 ${
                f.isRecomendado ? 'bg-green-50' : 'hover:bg-gray-50'
              }`}
            >
              <td className="p-4">
                <div className="flex items-center gap-3">
                  {f.isRecomendado && <Crown className="text-yellow-500 h-5 w-5" />}
                  <div>
                    <div className="font-medium text-gray-900">{f.nome}</div>
                    <div className="text-sm text-gray-500">
                      Score: {(f.confiabilidade + f.qualidade).toFixed(1)}/10
                    </div>
                  </div>
                </div>
              </td>
              
              <td className="p-4 text-center">
                <span className="text-gray-600">{formatCurrency(f.precoBruto)}</span>
              </td>
              
              <td className="p-4 text-center">
                <span className="text-red-600 font-medium">
                  -{f.percentualDesconto}%
                </span>
              </td>
              
              <td className="p-4 text-center">
                <span className={`text-lg font-bold ${
                  f.isRecomendado ? 'text-green-600' : 'text-gray-900'
                }`}>
                  {formatCurrency(f.precoFinal)}
                </span>
              </td>
              
              <td className="p-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{f.prazoEntrega} dias</span>
                </div>
              </td>
              
              <td className="p-4 text-center">
                <ScoreIndicator score={f.qualidade} max={5} />
              </td>
              
              <td className="p-4 text-center">
                {f.isRecomendado ? (
                  <span className="text-green-600 font-bold flex items-center justify-center gap-1">
                    <Award className="h-4 w-4" />
                    Melhor preço
                  </span>
                ) : (
                  <div className="text-center">
                    <span className="text-red-600 font-medium">
                      +{formatCurrency(f.economia)}
                    </span>
                    <div className="text-xs text-gray-500">
                      vs melhor
                    </div>
                  </div>
                )}
              </td>
              
              <td className="p-4 text-center">
                <StatusBadge 
                  status={f.isRecomendado ? 'recomendado' : f.ativo ? 'ativo' : 'inativo'} 
                />
              </td>
              
              <td className="p-4 text-center">
                {!f.isRecomendado && f.ativo && (
                  <button
                    onClick={() => onTrocarFornecedor(f)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ArrowRightLeft className="h-3 w-3" />
                    Trocar
                  </button>
                )}
                {f.isRecomendado && (
                  <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                    <CheckCircle className="h-4 w-4" />
                    Atual
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function GraficoBarrasComparativo({ fornecedores }: { fornecedores: FornecedorComparacao[] }) {
  const maxPreco = Math.max(...fornecedores.map(f => f.precoFinal))
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-900 mb-6">Comparação Visual de Preços</h4>
      
      <div className="h-64 flex items-end gap-4">
        {fornecedores.map((f, index) => {
          const altura = (f.precoFinal / maxPreco) * 100
          
          return (
            <div key={f.id} className="flex-1 flex flex-col items-center">
              {/* Valor acima da barra */}
              <div className="mb-2 text-center">
                <span className={`text-sm font-bold ${
                  f.isRecomendado ? 'text-green-600' : 'text-gray-900'
                }`}>
                  {formatCurrency(f.precoFinal)}
                </span>
                {f.isRecomendado && (
                  <Crown className="h-4 w-4 text-yellow-500 mx-auto mt-1" />
                )}
              </div>
              
              {/* Barra */}
              <div 
                className={`w-full transition-all duration-500 rounded-t-lg relative ${
                  f.isRecomendado ? 'bg-green-500' : 'bg-gray-400'
                } hover:brightness-110`}
                style={{ height: `${altura}%`, minHeight: '20px' }}
              >
                {/* Economia dentro da barra */}
                {!f.isRecomendado && (
                  <div className="absolute top-2 left-0 right-0 text-center">
                    <span className="text-white text-xs font-bold">
                      +{formatCurrency(f.economia)}
                    </span>
                  </div>
                )}
                
                {/* Desconto na parte inferior */}
                {f.percentualDesconto > 0 && (
                  <div className="absolute bottom-1 left-0 right-0 text-center">
                    <span className="text-white text-xs">
                      -{f.percentualDesconto}%
                    </span>
                  </div>
                )}
              </div>
              
              {/* Nome do fornecedor e detalhes */}
              <div className="mt-3 text-center">
                <p className="font-medium text-gray-900 text-sm">{f.nome}</p>
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{f.prazoEntrega} dias</span>
                  </div>
                  <ScoreIndicator score={f.qualidade} max={5} size="sm" />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MatrizDecisao({ fornecedores }: { fornecedores: FornecedorComparacao[] }) {
  const top3 = fornecedores.slice(0, 3)
  
  const calcularScorePreco = (fornecedor: FornecedorComparacao) => {
    const menorPreco = Math.min(...fornecedores.map(f => f.precoFinal))
    const maiorPreco = Math.max(...fornecedores.map(f => f.precoFinal))
    const range = maiorPreco - menorPreco
    
    if (range === 0) return 5
    
    const score = 5 - ((fornecedor.precoFinal - menorPreco) / range) * 4
    return Math.max(1, Math.round(score))
  }
  
  const calcularScorePrazo = (fornecedor: FornecedorComparacao) => {
    const menorPrazo = Math.min(...fornecedores.map(f => f.prazoEntrega))
    const maiorPrazo = Math.max(...fornecedores.map(f => f.prazoEntrega))
    const range = maiorPrazo - menorPrazo
    
    if (range === 0) return 5
    
    const score = 5 - ((fornecedor.prazoEntrega - menorPrazo) / range) * 4
    return Math.max(1, Math.round(score))
  }
  
  const calcularScoreTotal = (fornecedor: FornecedorComparacao) => {
    return calcularScorePreco(fornecedor) + calcularScorePrazo(fornecedor) + fornecedor.confiabilidade
  }
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-900 mb-6">Matriz de Decisão Multi-critério</h4>
      
      <div className="grid grid-cols-4 gap-4">
        {/* Cabeçalho */}
        <div className="font-bold text-gray-900">Critério</div>
        {top3.map(f => (
          <div key={f.id} className="font-bold text-center text-gray-900">
            {f.nome}
            {f.isRecomendado && <Crown className="h-4 w-4 text-yellow-500 mx-auto mt-1" />}
          </div>
        ))}
        
        {/* Linha: Preço */}
        <div className="flex items-center gap-2 py-3 border-t border-gray-100">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <span>Preço</span>
        </div>
        {top3.map(f => (
          <div key={f.id} className="text-center py-3 border-t border-gray-100">
            <ScoreIndicator score={calcularScorePreco(f)} max={5} />
            <span className="text-xs text-gray-500 mt-1 block">
              {formatCurrency(f.precoFinal)}
            </span>
          </div>
        ))}
        
        {/* Linha: Prazo */}
        <div className="flex items-center gap-2 py-3">
          <Clock className="h-4 w-4 text-gray-500" />
          <span>Prazo Entrega</span>
        </div>
        {top3.map(f => (
          <div key={f.id} className="text-center py-3">
            <ScoreIndicator score={calcularScorePrazo(f)} max={5} />
            <span className="text-xs text-gray-500 mt-1 block">
              {f.prazoEntrega} dias
            </span>
          </div>
        ))}
        
        {/* Linha: Confiabilidade */}
        <div className="flex items-center gap-2 py-3">
          <Shield className="h-4 w-4 text-gray-500" />
          <span>Confiabilidade</span>
        </div>
        {top3.map(f => (
          <div key={f.id} className="text-center py-3">
            <ScoreIndicator score={f.confiabilidade} max={5} />
            <span className="text-xs text-gray-500 mt-1 block">
              {f.confiabilidade}/5
            </span>
          </div>
        ))}
        
        {/* Total */}
        <div className="font-bold border-t-2 border-gray-300 pt-3 flex items-center gap-2">
          <Award className="h-4 w-4 text-gray-500" />
          <span>Score Total</span>
        </div>
        {top3.map(f => {
          const scoreTotal = calcularScoreTotal(f)
          const isVencedor = scoreTotal === Math.max(...top3.map(calcularScoreTotal))
          
          return (
            <div key={f.id} className={`text-center font-bold border-t-2 border-gray-300 pt-3 ${
              isVencedor ? 'text-green-600' : 'text-gray-900'
            }`}>
              <span className="text-xl">{scoreTotal}/15</span>
              {isVencedor && (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span className="text-xs">Vencedor</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ComparadorFornecedoresVisual({ insumoId }: ComparadorFornecedoresVisualProps) {
  const { insumos, fornecedores } = useApp()
  const [insumoSelecionado, setInsumoSelecionado] = useState(insumoId || '')
  const [viewMode, setViewMode] = useState<'table' | 'chart' | 'matrix'>('table')
  
  // Mock de dados de fornecedores para demonstração
  const fornecedoresComparacao: FornecedorComparacao[] = useMemo(() => {
    if (!insumoSelecionado) return []
    
    // Simular dados de fornecedores para o insumo selecionado
    const fornecedoresMock = [
      {
        id: 'f1',
        nome: 'Fornecedor Premium',
        precoBruto: 15.50,
        percentualDesconto: 15,
        prazoEntrega: 2,
        confiabilidade: 5,
        tempoResposta: 2,
        qualidade: 5,
        ativo: true
      },
      {
        id: 'f2',
        nome: 'Distribuidora Central',
        precoBruto: 14.80,
        percentualDesconto: 8,
        prazoEntrega: 3,
        confiabilidade: 4,
        tempoResposta: 4,
        qualidade: 4,
        ativo: true
      },
      {
        id: 'f3',
        nome: 'Açaí Nordeste',
        precoBruto: 16.20,
        percentualDesconto: 20,
        prazoEntrega: 5,
        confiabilidade: 3,
        tempoResposta: 8,
        qualidade: 4,
        ativo: true
      },
      {
        id: 'f4',
        nome: 'Cooperativa Regional',
        precoBruto: 13.90,
        percentualDesconto: 5,
        prazoEntrega: 4,
        confiabilidade: 4,
        tempoResposta: 6,
        qualidade: 3,
        ativo: true
      }
    ]
    
    const fornecedoresCalculados = fornecedoresMock.map(f => ({
      ...f,
      precoFinal: f.precoBruto * (1 - f.percentualDesconto / 100),
      economia: 0,
      isRecomendado: false
    }))
    
    // Ordenar por preço final e marcar o melhor
    fornecedoresCalculados.sort((a, b) => a.precoFinal - b.precoFinal)
    const melhorPreco = fornecedoresCalculados[0].precoFinal
    
    return fornecedoresCalculados.map((f, index) => ({
      ...f,
      economia: f.precoFinal - melhorPreco,
      isRecomendado: index === 0
    }))
  }, [insumoSelecionado])
  
  const insumoAtual = insumos.find(i => i.id === insumoSelecionado)
  const melhorFornecedor = fornecedoresComparacao.find(f => f.isRecomendado)
  const economiaEstimada = melhorFornecedor 
    ? fornecedoresComparacao.reduce((acc, f) => acc + f.economia, 0) / fornecedoresComparacao.length * 100 // Estimativa mensal
    : 0
  
  const handleTrocarFornecedor = (fornecedor: FornecedorComparacao) => {
    console.log('Trocando para fornecedor:', fornecedor.nome)
    // Aqui implementaria a lógica real de troca
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Comparação Visual de Fornecedores
            </h2>
            <p className="text-gray-600 mt-1">
              Analise preços, prazos e qualidade em diferentes visualizações
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <Download className="h-4 w-4" />
              Exportar
            </button>
            
            <div className="flex rounded-lg border border-gray-300">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 text-sm rounded-l-lg flex items-center gap-2 ${
                  viewMode === 'table' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Table className="h-4 w-4" />
                Tabela
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`px-3 py-2 text-sm border-l border-gray-300 flex items-center gap-2 ${
                  viewMode === 'chart' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Gráfico
              </button>
              <button
                onClick={() => setViewMode('matrix')}
                className={`px-3 py-2 text-sm rounded-r-lg border-l border-gray-300 flex items-center gap-2 ${
                  viewMode === 'matrix' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Award className="h-4 w-4" />
                Matriz
              </button>
            </div>
          </div>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Insumo:</span>
          </div>
          
          <select
            value={insumoSelecionado}
            onChange={(e) => setInsumoSelecionado(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Selecione um insumo</option>
            {insumos.filter(i => i.ativo).map(insumo => (
              <option key={insumo.id} value={insumo.id}>
                {insumo.nome}
              </option>
            ))}
          </select>
          
          {insumoAtual && (
            <div className="text-sm text-gray-600">
              Preço atual: <span className="font-medium">{formatCurrency(insumoAtual.precoPorGrama)}</span>
            </div>
          )}
        </div>
        
        {!insumoSelecionado ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Selecione um insumo
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Escolha um insumo acima para comparar fornecedores
            </p>
          </div>
        ) : fornecedoresComparacao.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhum fornecedor encontrado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Não há fornecedores cadastrados para este insumo
            </p>
          </div>
        ) : (
          <>
            {/* Conteúdo principal */}
            {viewMode === 'table' && (
              <TabelaComparativa 
                fornecedores={fornecedoresComparacao}
                onTrocarFornecedor={handleTrocarFornecedor}
              />
            )}
            
            {viewMode === 'chart' && (
              <GraficoBarrasComparativo fornecedores={fornecedoresComparacao} />
            )}
            
            {viewMode === 'matrix' && (
              <MatrizDecisao fornecedores={fornecedoresComparacao} />
            )}
            
            {/* Resumo de economia */}
            {melhorFornecedor && economiaEstimada > 0 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">
                        Oportunidade de Economia
                      </h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      Economia mensal estimada ao escolher <strong>{melhorFornecedor.nome}</strong>:
                    </p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">
                      {formatCurrency(economiaEstimada)}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleTrocarFornecedor(melhorFornecedor)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                    Trocar para {melhorFornecedor.nome}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}