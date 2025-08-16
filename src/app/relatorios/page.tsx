'use client'

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import Navigation from '@/components/Navigation'
import { FileText, Download, TrendingUp, TrendingDown, DollarSign, Package, BookOpen, BarChart3, Truck, Building2 } from 'lucide-react'

export default function RelatoriosPage() {
  const { 
 
    cardapio, 
    fornecedores,
    produtosFornecedores,
    obterComparacaoPrecos,
    calcularEconomiaTotal
  } = useApp()
  const [filtroAtivo, setFiltroAtivo] = useState<'todos' | 'ativos' | 'inativos'>('ativos')
  const [tipoRelatorio, setTipoRelatorio] = useState<'cardapio' | 'fornecedores'>('cardapio')


  const cardapioFiltrado = cardapio.filter(item => {
    if (filtroAtivo === 'ativos') return item.ativo
    if (filtroAtivo === 'inativos') return !item.ativo
    return true
  })

  const fornecedoresFiltrados = fornecedores.filter(fornecedor => {
    if (filtroAtivo === 'ativos') return fornecedor.ativo
    if (filtroAtivo === 'inativos') return !fornecedor.ativo
    return true
  })


  // Estatísticas para cardápio
  const estatisticasCardapio = {
    totalItens: cardapioFiltrado.length,
    margemMedia: cardapioFiltrado.length > 0 
      ? cardapioFiltrado.reduce((acc, c) => acc + c.percentualMargem, 0) / cardapioFiltrado.length 
      : 0,
    markupMedio: cardapioFiltrado.length > 0 
      ? cardapioFiltrado.reduce((acc, c) => acc + c.markup, 0) / cardapioFiltrado.length 
      : 0,
    precoMedio: cardapioFiltrado.length > 0 
      ? cardapioFiltrado.reduce((acc, c) => acc + c.precoVenda, 0) / cardapioFiltrado.length 
      : 0
  }


  // Ordenações para cardápio
  const cardapioPorMarkup = [...cardapioFiltrado].sort((a, b) => b.markup - a.markup)

  // Análise por categoria do cardápio
  const categoriaAnalise = cardapioFiltrado.reduce((acc, item) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = {
        count: 0,
        totalMarkup: 0,
        totalMargem: 0,
        itens: []
      }
    }
    acc[item.categoria].count++
    acc[item.categoria].totalMarkup += item.markup
    acc[item.categoria].totalMargem += item.percentualMargem
    acc[item.categoria].itens.push(item)
    return acc
  }, {} as Record<string, { count: number; totalMarkup: number; totalMargem: number; itens: any[] }>)

  const categoriaStats = Object.entries(categoriaAnalise).map(([categoria, data]) => ({
    categoria,
    count: data.count,
    markupMedio: data.totalMarkup / data.count,
    margemMedia: data.totalMargem / data.count,
    itens: data.itens
  }))


  // Análise de fornecedores
  const fornecedoresComDados = fornecedoresFiltrados.map(fornecedor => {
    const produtosFornecedor = produtosFornecedores.filter(p => 
      p.fornecedorId === fornecedor.id && p.ativo
    )
    
    const economiaPorInsumo = produtosFornecedor.map(produto => {
      const comparacao = obterComparacaoPrecos(produto.insumoId)
      return {
        insumoId: produto.insumoId,
        economia: comparacao?.melhorPreco.economia || 0,
        isMelhor: comparacao?.melhorPreco.fornecedorId === fornecedor.id
      }
    })

    const economiaTotal = economiaPorInsumo.reduce((acc, e) => acc + e.economia, 0)
    const produtosMelhoresPrecos = economiaPorInsumo.filter(e => e.isMelhor).length

    return {
      ...fornecedor,
      totalProdutos: produtosFornecedor.length,
      economiaTotal,
      produtosMelhoresPrecos,
      mediaDesconto: produtosFornecedor.length > 0 
        ? produtosFornecedor.reduce((acc, p) => acc + p.percentualDesconto, 0) / produtosFornecedor.length 
        : 0
    }
  })

  const estatisticasFornecedores = {
    totalFornecedores: fornecedoresComDados.length,
    economiaTotalPossivel: calcularEconomiaTotal(),
    fornecedorMaisProdutos: fornecedoresComDados.reduce((prev, current) => 
      current.totalProdutos > prev.totalProdutos ? current : prev, fornecedoresComDados[0]
    ),
    fornecedorMelhorEconomia: fornecedoresComDados.reduce((prev, current) => 
      current.economiaTotal > prev.economiaTotal ? current : prev, fornecedoresComDados[0]
    )
  }

  // Função para exportar relatório (simulação)
  const exportarRelatorio = (tipo: 'pdf' | 'excel') => {
    alert(`Funcionalidade de exportação ${tipo.toUpperCase()} seria implementada aqui com jsPDF ou xlsx`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="md:pl-64">
        <main className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
              <p className="text-gray-600 mt-2">Análise completa de custos e rentabilidade</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => exportarRelatorio('pdf')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Download className="h-5 w-5" />
                PDF
              </button>
              <button
                onClick={() => exportarRelatorio('excel')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Download className="h-5 w-5" />
                Excel
              </button>
            </div>
          </div>

          {/* Tabs de tipo de relatório */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setTipoRelatorio('cardapio')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    tipoRelatorio === 'cardapio'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <BookOpen className="h-4 w-4 inline mr-2" />
                  Relatório do Cardápio
                </button>
                <button
                  onClick={() => setTipoRelatorio('fornecedores')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    tipoRelatorio === 'fornecedores'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Truck className="h-4 w-4 inline mr-2" />
                  Análise de Fornecedores
                </button>
              </nav>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => setFiltroAtivo('todos')}
                className={`px-4 py-2 rounded-md ${
                  filtroAtivo === 'todos' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos os Itens
              </button>
              <button
                onClick={() => setFiltroAtivo('ativos')}
                className={`px-4 py-2 rounded-md ${
                  filtroAtivo === 'ativos' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Apenas Ativos
              </button>
              <button
                onClick={() => setFiltroAtivo('inativos')}
                className={`px-4 py-2 rounded-md ${
                  filtroAtivo === 'inativos' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Apenas Inativos
              </button>
            </div>
          </div>

          {/* Cards de estatísticas */}
          {tipoRelatorio === 'cardapio' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total de Itens</p>
                    <p className="text-2xl font-semibold text-gray-900">{estatisticasCardapio.totalItens}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Margem Média</p>
                    <p className="text-2xl font-semibold text-gray-900">{estatisticasCardapio.margemMedia.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Markup Médio</p>
                    <p className="text-2xl font-semibold text-gray-900">R$ {estatisticasCardapio.markupMedio.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Preço Médio</p>
                    <p className="text-2xl font-semibold text-gray-900">R$ {estatisticasCardapio.precoMedio.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Análise por categoria do cardápio */}
          {tipoRelatorio === 'cardapio' && categoriaStats.length > 0 && (
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Análise por Categoria
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoriaStats.map((cat) => (
                    <div key={cat.categoria} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 capitalize mb-2">
                        {cat.categoria.replace('_', ' ')}
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Itens:</span>
                          <span className="font-medium">{cat.count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Markup médio:</span>
                          <span className="font-medium text-green-600">R$ {cat.markupMedio.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Margem média:</span>
                          <span className="font-medium text-blue-600">{cat.margemMedia.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {/* Top 5 itens mais lucrativos do cardápio */}
            {tipoRelatorio === 'cardapio' && cardapioPorMarkup.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  Top 5 - Maior Markup (Cardápio)
                </h3>
                <div className="space-y-3">
                  {cardapioPorMarkup.slice(0, 5).map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-orange-500' : 'bg-gray-300'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{item.nome}</p>
                          <p className="text-sm text-gray-600 capitalize">{item.categoria.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">R$ {item.markup.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{item.percentualMargem.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <DollarSign className="h-5 w-5 text-purple-500 mr-2" />
                Distribuição por Preço
              </h3>
              <div className="space-y-3">
                {[
                  { faixa: 'Até R$ 10', min: 0, max: 10, cor: 'bg-green-100 text-green-800' },
                  { faixa: 'R$ 10 - R$ 20', min: 10, max: 20, cor: 'bg-yellow-100 text-yellow-800' },
                  { faixa: 'R$ 20 - R$ 30', min: 20, max: 30, cor: 'bg-orange-100 text-orange-800' },
                  { faixa: 'Acima de R$ 30', min: 30, max: Infinity, cor: 'bg-red-100 text-red-800' }
                ].map((faixa) => {
                  const dadosFiltrados = cardapioFiltrado
                  const itensFaixa = dadosFiltrados.filter(item => 
                    item.precoVenda >= faixa.min && item.precoVenda < faixa.max
                  )
                  const percentual = dadosFiltrados.length > 0 
                    ? (itensFaixa.length / dadosFiltrados.length) * 100 
                    : 0

                  return (
                    <div key={faixa.faixa} className="flex items-center justify-between">
                      <span className="font-medium">{faixa.faixa}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${faixa.cor}`}>
                          {itensFaixa.length} itens
                        </span>
                        <span className="text-sm text-gray-700 font-medium">
                          {percentual.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>


          {/* Tabela completa do cardápio */}
          {tipoRelatorio === 'cardapio' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Relatório Completo do Cardápio</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4">Item</th>
                      <th className="text-right py-3 px-4">Categoria</th>
                      <th className="text-right py-3 px-4">Custo</th>
                      <th className="text-right py-3 px-4">Preço</th>
                      <th className="text-right py-3 px-4">Markup</th>
                      <th className="text-right py-3 px-4">Margem %</th>
                      <th className="text-center py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cardapioFiltrado.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{item.nome}</p>
                            {item.observacoes && (
                              <p className="text-sm text-gray-600">{item.observacoes}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                            {item.categoria.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">R$ {item.custo.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-medium">R$ {item.precoVenda.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-green-600 font-medium">
                            R$ {item.markup.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-medium ${
                            item.percentualMargem >= 50 ? 'text-green-600' : 
                            item.percentualMargem >= 20 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {item.percentualMargem.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.ativo 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* Relatório de Fornecedores */}
          {tipoRelatorio === 'fornecedores' && (
            <>
              {/* Estatísticas gerais de fornecedores */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Fornecedores</p>
                      <p className="text-2xl font-semibold text-gray-900">{estatisticasFornecedores.totalFornecedores}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Economia Possível</p>
                      <p className="text-2xl font-semibold text-gray-900">R$ {estatisticasFornecedores.economiaTotalPossivel.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100">
                      <Package className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Mais Produtos</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {estatisticasFornecedores.fornecedorMaisProdutos?.nome || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {estatisticasFornecedores.fornecedorMaisProdutos?.totalProdutos || 0} produtos
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100">
                      <TrendingDown className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Melhor Economia</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {estatisticasFornecedores.fornecedorMelhorEconomia?.nome || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        R$ {estatisticasFornecedores.fornecedorMelhorEconomia?.economiaTotal.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabela de análise de fornecedores */}
              {fornecedoresComDados.length > 0 && (
                <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
                      Análise Detalhada de Fornecedores
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fornecedor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Produtos
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Melhores Preços
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Desconto Médio
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Economia Total
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {fornecedoresComDados
                          .sort((a, b) => b.economiaTotal - a.economiaTotal)
                          .map((fornecedor) => (
                          <tr key={fornecedor.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Building2 className="h-5 w-5 text-blue-600" />
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{fornecedor.nome}</div>
                                  <div className="text-sm text-gray-500">
                                    {fornecedor.contato.telefone || fornecedor.contato.email || 'Sem contato'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {fornecedor.totalProdutos}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-sm font-medium text-green-600">
                                  {fornecedor.produtosMelhoresPrecos}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {fornecedor.mediaDesconto.toFixed(1)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                              R$ {fornecedor.economiaTotal.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                fornecedor.ativo 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {fornecedor.ativo ? 'Ativo' : 'Inativo'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Ranking de fornecedores */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                    Top 5 - Maior Economia
                  </h3>
                  <div className="space-y-3">
                    {fornecedoresComDados
                      .filter(f => f.economiaTotal > 0)
                      .sort((a, b) => b.economiaTotal - a.economiaTotal)
                      .slice(0, 5)
                      .map((fornecedor, index) => (
                      <div key={fornecedor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-500' : 
                            index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="font-medium text-gray-900">{fornecedor.nome}</span>
                        </div>
                        <span className="text-green-600 font-semibold">R$ {fornecedor.economiaTotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Package className="h-5 w-5 text-purple-500 mr-2" />
                    Top 5 - Mais Produtos
                  </h3>
                  <div className="space-y-3">
                    {fornecedoresComDados
                      .sort((a, b) => b.totalProdutos - a.totalProdutos)
                      .slice(0, 5)
                      .map((fornecedor, index) => (
                      <div key={fornecedor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-500' : 
                            index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="font-medium text-gray-900">{fornecedor.nome}</span>
                        </div>
                        <span className="text-purple-600 font-semibold">{fornecedor.totalProdutos} produtos</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Mensagens de estado vazio */}
          {tipoRelatorio === 'cardapio' && cardapioFiltrado.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum item no cardápio encontrado</h3>
              <p className="mt-1 text-sm text-gray-600">
                Cadastre itens no cardápio para visualizar os relatórios.
              </p>
            </div>
          )}


          {tipoRelatorio === 'fornecedores' && fornecedoresComDados.length === 0 && (
            <div className="text-center py-12">
              <Truck className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum fornecedor encontrado</h3>
              <p className="mt-1 text-sm text-gray-600">
                Cadastre fornecedores e seus produtos para visualizar relatórios de economia.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}