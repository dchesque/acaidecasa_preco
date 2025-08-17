'use client'

import { useState, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import { formatCurrency } from '@/utils/formatters'
import { calcularPrecoComMargem, calcularMargem } from '@/utils/margemUtils'
import { 
  Sparkles, 
  RefreshCw, 
  Save, 
  Download,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Settings,
  Package,
  Building2,
  Percent,
  DollarSign,
  Users,
  CheckCircle,
  AlertTriangle,
  FileText
} from 'lucide-react'

export interface CenarioWhatIf {
  id: string
  nome: string
  descricao: string
  tipo: 'fornecedor' | 'ingrediente' | 'porcao' | 'margem' | 'multiplo'
  alteracoes: AlteracaoWhatIf[]
  impacto: ImpactoWhatIf
  salvo: boolean
  dataCriacao: Date
}

export interface AlteracaoWhatIf {
  tipo: 'trocar_fornecedor' | 'mudar_ingrediente' | 'ajustar_porcao' | 'alterar_margem'
  de: any
  para: any
  produtos_afetados: string[]
}

export interface ImpactoWhatIf {
  custoAntes: number
  custoDepois: number
  margemAntes: number
  margemDepois: number
  lucroAntes: number
  lucroDepois: number
  produtosAfetados: number
  economiaTotal: number
  percentualImpacto: number
}

type TipoSimulacao = 'fornecedor' | 'ingrediente' | 'porcao' | 'margem' | 'combo' | 'multiplo'

interface VariacaoIndicatorProps {
  valor: number
  percentual: number
  tipo?: 'preco' | 'margem' | 'custo'
}

function VariacaoIndicator({ valor, percentual, tipo = 'preco' }: VariacaoIndicatorProps) {
  const isPositivo = valor > 0
  const isNeutro = Math.abs(valor) < 0.01
  
  if (isNeutro) {
    return (
      <div className="flex items-center gap-1 text-gray-500">
        <Minus className="h-4 w-4" />
        <span className="text-sm">Sem alteração</span>
      </div>
    )
  }
  
  return (
    <div className={`flex items-center gap-1 ${
      isPositivo ? 'text-green-600' : 'text-red-600'
    }`}>
      {isPositivo ? (
        <ArrowUpRight className="h-4 w-4" />
      ) : (
        <ArrowDownRight className="h-4 w-4" />
      )}
      <div className="text-sm">
        <span className="font-medium">
          {isPositivo ? '+' : ''}{tipo === 'preco' ? formatCurrency(valor) : `${valor.toFixed(1)}%`}
        </span>
        <span className="text-xs ml-1">
          ({isPositivo ? '+' : ''}{percentual.toFixed(1)}%)
        </span>
      </div>
    </div>
  )
}

interface MetricaImpactoProps {
  label: string
  antes: number
  depois: number
  formato: 'currency' | 'percentage'
}

function MetricaImpacto({ label, antes, depois, formato }: MetricaImpactoProps) {
  const diferenca = depois - antes
  const percentual = antes > 0 ? (diferenca / antes) * 100 : 0
  
  return (
    <div className="text-center">
      <p className="text-sm text-gray-600 mb-2">{label}</p>
      <div className="space-y-1">
        <p className="text-lg font-bold text-gray-900">
          {formato === 'currency' ? formatCurrency(depois) : `${depois.toFixed(1)}%`}
        </p>
        <VariacaoIndicator 
          valor={diferenca}
          percentual={percentual}
          tipo={formato === 'currency' ? 'preco' : 'margem'}
        />
      </div>
    </div>
  )
}

interface SimuladorFornecedorProps {
  onSimular: (params: any) => void
}

function SimuladorFornecedor({ onSimular }: SimuladorFornecedorProps) {
  const { insumos, fornecedores } = useApp()
  const [insumoSelecionado, setInsumoSelecionado] = useState('')
  const [fornecedorAtual, setFornecedorAtual] = useState('')
  const [fornecedorNovo, setFornecedorNovo] = useState('')
  
  const handleSimular = () => {
    if (insumoSelecionado && fornecedorAtual && fornecedorNovo) {
      onSimular({
        tipo: 'fornecedor',
        insumoId: insumoSelecionado,
        fornecedorAtualId: fornecedorAtual,
        fornecedorNovoId: fornecedorNovo
      })
    }
  }
  
  return (
    <div className="space-y-3">
      <label>
        <span className="text-sm font-medium text-gray-700">Insumo:</span>
        <select 
          className="w-full mt-1 rounded-lg border-gray-300"
          value={insumoSelecionado}
          onChange={(e) => setInsumoSelecionado(e.target.value)}
        >
          <option value="">Selecione um insumo</option>
          {insumos.filter(i => i.ativo).map(i => (
            <option key={i.id} value={i.id}>{i.nome}</option>
          ))}
        </select>
      </label>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-sm text-gray-700">Fornecedor Atual:</span>
          <select 
            className="w-full mt-1 rounded-lg border-gray-300"
            value={fornecedorAtual}
            onChange={(e) => setFornecedorAtual(e.target.value)}
          >
            <option value="">Atual</option>
            {fornecedores.filter(f => f.ativo).map(f => (
              <option key={f.id} value={f.id}>{f.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <span className="text-sm text-gray-700">Novo Fornecedor:</span>
          <select 
            className="w-full mt-1 rounded-lg border-gray-300"
            value={fornecedorNovo}
            onChange={(e) => setFornecedorNovo(e.target.value)}
          >
            <option value="">Selecione</option>
            {fornecedores.filter(f => f.ativo && f.id !== fornecedorAtual).map(f => (
              <option key={f.id} value={f.id}>{f.nome}</option>
            ))}
          </select>
        </div>
      </div>
      
      <button 
        onClick={handleSimular}
        disabled={!insumoSelecionado || !fornecedorAtual || !fornecedorNovo}
        className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Simular Troca de Fornecedor
      </button>
    </div>
  )
}

interface SimuladorMargemProps {
  onSimular: (params: any) => void
}

function SimuladorMargem({ onSimular }: SimuladorMargemProps) {
  const [margemNova, setMargemNova] = useState(50)
  const [aplicarTodos, setAplicarTodos] = useState(true)
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([])
  
  const categorias = [
    'chocolates', 'mousses', 'sorvetes', 'coberturas', 
    'cremes_premium', 'frutas', 'complementos', 'receitas', 'copos', 'combinados'
  ]
  
  const handleSimular = () => {
    onSimular({
      tipo: 'margem',
      margemNova,
      aplicarTodos,
      categorias: aplicarTodos ? [] : categoriasSelecionadas
    })
  }
  
  return (
    <div className="space-y-3">
      <label>
        <span className="text-sm font-medium text-gray-700">Nova Margem (%):</span>
        <input 
          type="number"
          min="0"
          max="100"
          value={margemNova}
          onChange={(e) => setMargemNova(Number(e.target.value))}
          className="w-full mt-1 rounded-lg border-gray-300"
        />
      </label>
      
      <label className="flex items-center gap-2">
        <input 
          type="checkbox" 
          checked={aplicarTodos}
          onChange={(e) => setAplicarTodos(e.target.checked)}
          className="rounded border-gray-300"
        />
        <span className="text-sm text-gray-700">Aplicar a todos os produtos</span>
      </label>
      
      {!aplicarTodos && (
        <div>
          <span className="text-sm font-medium text-gray-700">Categorias:</span>
          <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
            {categorias.map(categoria => (
              <label key={categoria} className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={categoriasSelecionadas.includes(categoria)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCategoriasSelecionadas([...categoriasSelecionadas, categoria])
                    } else {
                      setCategoriasSelecionadas(categoriasSelecionadas.filter(c => c !== categoria))
                    }
                  }}
                  className="rounded border-gray-300"
                />
                <span className="text-sm capitalize">{categoria.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      
      <button 
        onClick={handleSimular}
        className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700"
      >
        Simular Ajuste de Margem
      </button>
    </div>
  )
}

interface ResultadoSimulacaoProps {
  cenario: CenarioWhatIf
  onSalvar: () => void
  onAplicar: () => void
  onExportar: () => void
}

function ResultadoSimulacao({ cenario, onSalvar, onAplicar, onExportar }: ResultadoSimulacaoProps) {
  const { cardapio } = useApp()
  
  const produtosAfetados = useMemo(() => {
    return cardapio.filter(p => 
      cenario.alteracoes.some(alt => alt.produtos_afetados.includes(p.id))
    ).map(produto => ({
      ...produto,
      custoAntes: produto.custo,
      custoDepois: produto.custo * 0.95, // Mock - seria calculado baseado na alteração
      margemAntes: produto.percentualMargem,
      margemDepois: produto.percentualMargem + 5, // Mock
      impacto: Math.random() * 20 - 10 // Mock
    }))
  }, [cardapio, cenario])
  
  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header com resumo */}
      <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold mb-2">
              Resultado da Simulação
            </h3>
            <p className="text-gray-600">
              {cenario.descricao}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Impacto Total</p>
            <p className={`text-3xl font-bold ${
              cenario.impacto.economiaTotal > 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {cenario.impacto.economiaTotal > 0 ? '+' : ''}
              R$ {cenario.impacto.economiaTotal.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              por mês estimado
            </p>
          </div>
        </div>
      </div>
      
      {/* Métricas de Impacto */}
      <div className="p-6 grid grid-cols-3 gap-4 border-b">
        <MetricaImpacto
          label="Custo Total"
          antes={cenario.impacto.custoAntes}
          depois={cenario.impacto.custoDepois}
          formato="currency"
        />
        <MetricaImpacto
          label="Margem Média"
          antes={cenario.impacto.margemAntes}
          depois={cenario.impacto.margemDepois}
          formato="percentage"
        />
        <MetricaImpacto
          label="Lucro Médio"
          antes={cenario.impacto.lucroAntes}
          depois={cenario.impacto.lucroDepois}
          formato="currency"
        />
      </div>
      
      {/* Lista de Produtos Afetados */}
      <div className="p-6">
        <h4 className="font-medium mb-4">
          Produtos Afetados ({cenario.impacto.produtosAfetados})
        </h4>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {produtosAfetados.slice(0, 10).map(produto => (
            <div 
              key={produto.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
            >
              <div>
                <p className="font-medium">{produto.nome}</p>
                <p className="text-sm text-gray-500">
                  {produto.categoria}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Custo</p>
                  <p className="font-medium">
                    {formatCurrency(produto.custoAntes)} → {formatCurrency(produto.custoDepois)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Margem</p>
                  <p className="font-medium">
                    {produto.margemAntes.toFixed(1)}% → {produto.margemDepois.toFixed(1)}%
                  </p>
                </div>
                <VariacaoIndicator 
                  valor={produto.impacto}
                  percentual={produto.impacto}
                  tipo="preco"
                />
              </div>
            </div>
          ))}
          {produtosAfetados.length > 10 && (
            <p className="text-center text-sm text-gray-500 py-2">
              ... e mais {produtosAfetados.length - 10} produtos
            </p>
          )}
        </div>
      </div>
      
      {/* Ações */}
      <div className="p-6 border-t bg-gray-50 flex justify-between">
        <div className="flex gap-2">
          <button 
            onClick={onSalvar}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
          >
            <Save className="h-4 w-4" />
            Salvar Cenário
          </button>
          <button 
            onClick={onExportar}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
          >
            <Download className="h-4 w-4" />
            Exportar PDF
          </button>
        </div>
        <button 
          onClick={onAplicar}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <CheckCircle className="h-4 w-4" />
          Aplicar Mudanças
        </button>
      </div>
    </div>
  )
}

export default function AnaliseWhatIf() {
  const { cardapio } = useApp()
  const [tipoSimulacao, setTipoSimulacao] = useState<TipoSimulacao>('margem')
  const [cenarioAtivo, setCenarioAtivo] = useState<CenarioWhatIf | null>(null)
  const [cenariosSalvos, setCenariosSalvos] = useState<CenarioWhatIf[]>([])
  const [simulando, setSimulando] = useState(false)
  
  const simular = async (params: any) => {
    setSimulando(true)
    
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock de cálculo de impacto - seria substituído por lógica real
    const cenario: CenarioWhatIf = {
      id: Date.now().toString(),
      nome: `Simulação ${tipoSimulacao}`,
      descricao: gerarDescricaoSimulacao(tipoSimulacao, params),
      tipo: tipoSimulacao,
      alteracoes: [{
        tipo: 'alterar_margem',
        de: params.margemAtual || 45,
        para: params.margemNova || 50,
        produtos_afetados: cardapio.filter(p => p.ativo).map(p => p.id)
      }],
      impacto: {
        custoAntes: 1250.50,
        custoDepois: 1180.75,
        margemAntes: 45.2,
        margemDepois: params.margemNova || 50,
        lucroAntes: 850.30,
        lucroDepois: 920.15,
        produtosAfetados: cardapio.filter(p => p.ativo).length,
        economiaTotal: 69.85,
        percentualImpacto: 5.6
      },
      salvo: false,
      dataCriacao: new Date()
    }
    
    setCenarioAtivo(cenario)
    setSimulando(false)
  }
  
  const gerarDescricaoSimulacao = (tipo: TipoSimulacao, params: any): string => {
    switch (tipo) {
      case 'margem':
        return `Ajustar margem para ${params.margemNova}% em ${params.aplicarTodos ? 'todos os produtos' : 'categorias selecionadas'}`
      case 'fornecedor':
        return `Trocar fornecedor do insumo selecionado`
      default:
        return `Simulação de ${tipo}`
    }
  }
  
  const salvarCenario = () => {
    if (cenarioAtivo) {
      const cenarioSalvo = { ...cenarioAtivo, salvo: true }
      setCenariosSalvos([...cenariosSalvos, cenarioSalvo])
      setCenarioAtivo(cenarioSalvo)
    }
  }
  
  const aplicarCenario = () => {
    if (cenarioAtivo) {
      // Aqui seria implementada a lógica para aplicar as mudanças aos produtos
      alert('Cenário aplicado com sucesso!')
    }
  }
  
  const exportarRelatorio = () => {
    if (cenarioAtivo) {
      // Aqui seria implementada a lógica de exportação para PDF
      alert('Relatório exportado!')
    }
  }
  
  const carregarCenario = (cenario: CenarioWhatIf) => {
    setCenarioAtivo(cenario)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            Análise What-If
          </h2>
          <p className="text-gray-600 mt-1">
            Simule mudanças e veja o impacto antes de aplicar
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Coluna Esquerda - Controles */}
        <div className="col-span-4 space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              Configurar Simulação
            </h3>
            
            {/* Tipo de Simulação */}
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  O que você quer simular?
                </span>
                <select 
                  className="mt-1 w-full rounded-lg border-gray-300"
                  value={tipoSimulacao}
                  onChange={(e) => setTipoSimulacao(e.target.value as TipoSimulacao)}
                >
                  <option value="margem">Alterar Margens</option>
                  <option value="fornecedor">Trocar Fornecedor</option>
                  <option value="ingrediente">Substituir Ingrediente</option>
                  <option value="porcao">Ajustar Porções</option>
                  <option value="combo">Criar Combo</option>
                  <option value="multiplo">Múltiplas Alterações</option>
                </select>
              </label>
              
              {/* Controles Dinâmicos baseados no tipo */}
              {tipoSimulacao === 'fornecedor' && (
                <SimuladorFornecedor onSimular={simular} />
              )}
              
              {tipoSimulacao === 'margem' && (
                <SimuladorMargem onSimular={simular} />
              )}
              
              {tipoSimulacao === 'ingrediente' && (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Ex: Trocar Nutella por creme de avelã caseiro
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      placeholder="Ingrediente atual"
                      className="w-full rounded-lg border-gray-300"
                    />
                    <input 
                      placeholder="Novo ingrediente"
                      className="w-full rounded-lg border-gray-300"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="number"
                      placeholder="Custo atual/g"
                      className="w-full rounded-lg border-gray-300"
                    />
                    <input 
                      type="number"
                      placeholder="Novo custo/g"
                      className="w-full rounded-lg border-gray-300"
                    />
                  </div>
                  
                  <button 
                    onClick={() => simular({ tipo: 'ingrediente' })}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700"
                  >
                    Simular Substituição
                  </button>
                </div>
              )}
              
              {simulando && (
                <div className="flex items-center justify-center py-4">
                  <RefreshCw className="h-6 w-6 animate-spin text-purple-600" />
                  <span className="ml-2 text-purple-600">Simulando...</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Cenários Salvos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-medium mb-3">Cenários Salvos</h4>
            <div className="space-y-2">
              {cenariosSalvos.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhum cenário salvo ainda
                </p>
              ) : (
                cenariosSalvos.map(cenario => (
                  <button
                    key={cenario.id}
                    onClick={() => carregarCenario(cenario)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{cenario.nome}</p>
                        <p className="text-xs text-gray-500">{cenario.descricao}</p>
                      </div>
                      <span className={`text-sm font-bold ${
                        cenario.impacto.economiaTotal > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {cenario.impacto.economiaTotal > 0 ? '+' : ''}
                        R$ {cenario.impacto.economiaTotal.toFixed(2)}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Coluna Direita - Resultados */}
        <div className="col-span-8">
          {cenarioAtivo ? (
            <ResultadoSimulacao 
              cenario={cenarioAtivo}
              onSalvar={salvarCenario}
              onAplicar={aplicarCenario}
              onExportar={exportarRelatorio}
            />
          ) : (
            <div className="bg-white rounded-lg shadow h-full flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Configure uma simulação para ver o impacto
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}