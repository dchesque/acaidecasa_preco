'use client'

import { useApp } from '@/contexts/AppContext'
import Navigation from '@/components/Navigation'
import { carregarDadosExemplo } from '@/data/exemplos'
import { 
  Package, 
  Cherry, 
  ShoppingBag, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Database,
  BookOpen,
  BarChart3
} from 'lucide-react'

export default function Dashboard() {
  const { embalagens, insumos, produtos, cardapio, calcularCustoProduto } = useApp()

  // Calcular estatísticas
  const totalEmbalagens = embalagens.filter(e => e.ativa).length
  const totalInsumos = insumos.filter(i => i.ativo).length
  const totalProdutos = produtos.filter(p => p.ativo).length
  const totalItensCardapio = cardapio.filter(c => c.ativo).length

  // Calcular margens e lucros
  const produtosComCusto = produtos
    .filter(p => p.ativo)
    .map(produto => {
      const custo = calcularCustoProduto(produto)
      return { ...produto, ...custo }
    })

  const margemMedia = produtosComCusto.length > 0
    ? produtosComCusto.reduce((acc, p) => acc + p.margem, 0) / produtosComCusto.length
    : 0

  const lucroTotal = produtosComCusto.reduce((acc, p) => acc + p.lucro, 0)

  // Estatísticas do cardápio
  const itensCardapioAtivos = cardapio.filter(c => c.ativo)
  const margemMediaCardapio = itensCardapioAtivos.length > 0
    ? itensCardapioAtivos.reduce((acc, c) => acc + c.percentualMargem, 0) / itensCardapioAtivos.length
    : 0
    
  const itemMaisLucrativoCardapio = itensCardapioAtivos.reduce((prev, current) => 
    (current.markup > prev.markup) ? current : prev
  , itensCardapioAtivos[0])

  const itemMenosLucrativoCardapio = itensCardapioAtivos.reduce((prev, current) => 
    (current.markup < prev.markup) ? current : prev
  , itensCardapioAtivos[0])

  // Contadores por categoria
  const categoriasCounts = itensCardapioAtivos.reduce((acc, item) => {
    acc[item.categoria] = (acc[item.categoria] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Produto mais e menos lucrativo
  const produtoMaisLucrativo = produtosComCusto.reduce((prev, current) => 
    (current.lucro > prev.lucro) ? current : prev
  , produtosComCusto[0])

  const produtoMenosLucrativo = produtosComCusto.reduce((prev, current) => 
    (current.lucro < prev.lucro) ? current : prev
  , produtosComCusto[0])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="md:pl-64">
        <main className="p-6">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Visão geral do seu negócio de açaí</p>
            </div>
            {(totalEmbalagens === 0 && totalInsumos === 0 && totalProdutos === 0 && totalItensCardapio === 0) && (
              <button
                onClick={carregarDadosExemplo}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Database className="h-5 w-5" />
                Carregar Dados de Exemplo
              </button>
            )}
          </div>

          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Embalagens Ativas</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalEmbalagens}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <Cherry className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Insumos Ativos</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalInsumos}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <ShoppingBag className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Produtos Ativos</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalProdutos}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100">
                  <BookOpen className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Itens no Cardápio</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalItensCardapio}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Percent className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Margem Média Cardápio</p>
                  <p className="text-2xl font-semibold text-gray-900">{margemMediaCardapio.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Análise de cardápio */}
          {itensCardapioAtivos.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  Item Mais Lucrativo (Cardápio)
                </h3>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{itemMaisLucrativoCardapio?.nome}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Custo:</span>
                    <span className="font-medium">R$ {itemMaisLucrativoCardapio?.custo.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Preço:</span>
                    <span className="font-medium">R$ {itemMaisLucrativoCardapio?.precoVenda.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Markup:</span>
                    <span className="font-bold text-green-600">R$ {itemMaisLucrativoCardapio?.markup.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Margem:</span>
                    <span className="font-bold text-green-600">{itemMaisLucrativoCardapio?.percentualMargem.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                  Item Menos Lucrativo (Cardápio)
                </h3>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{itemMenosLucrativoCardapio?.nome}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Custo:</span>
                    <span className="font-medium">R$ {itemMenosLucrativoCardapio?.custo.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Preço:</span>
                    <span className="font-medium">R$ {itemMenosLucrativoCardapio?.precoVenda.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Markup:</span>
                    <span className={`font-bold ${itemMenosLucrativoCardapio?.markup >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {itemMenosLucrativoCardapio?.markup.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Margem:</span>
                    <span className={`font-bold ${itemMenosLucrativoCardapio?.markup >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {itemMenosLucrativoCardapio?.percentualMargem.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Produtos mais/menos lucrativos */}
          {produtosComCusto.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  Produto Mais Lucrativo (Copos)
                </h3>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{produtoMaisLucrativo?.nome}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Custo:</span>
                    <span className="font-medium">R$ {produtoMaisLucrativo?.custoTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Preço:</span>
                    <span className="font-medium">R$ {produtoMaisLucrativo?.precoVenda.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lucro:</span>
                    <span className="font-bold text-green-600">R$ {produtoMaisLucrativo?.lucro.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Margem:</span>
                    <span className="font-bold text-green-600">{produtoMaisLucrativo?.margem}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                  Produto Menos Lucrativo (Copos)
                </h3>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{produtoMenosLucrativo?.nome}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Custo:</span>
                    <span className="font-medium">R$ {produtoMenosLucrativo?.custoTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Preço:</span>
                    <span className="font-medium">R$ {produtoMenosLucrativo?.precoVenda.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lucro:</span>
                    <span className={`font-bold ${produtoMenosLucrativo?.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {produtoMenosLucrativo?.lucro.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Margem:</span>
                    <span className={`font-bold ${produtoMenosLucrativo?.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {produtoMenosLucrativo?.margem}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Distribuição por categorias do cardápio */}
          {itensCardapioAtivos.length > 0 && (
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Distribuição por Categoria (Cardápio)
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Object.entries(categoriasCounts).map(([categoria, count]) => (
                    <div key={categoria} className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-gray-600 capitalize">{categoria.replace('_', ' ')}</p>
                      <p className="text-2xl font-bold text-blue-600">{count}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Lista de produtos recentes */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Produtos Cadastrados (Copos)</h3>
            </div>
            <div className="p-6">
              {produtosComCusto.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  Nenhum produto cadastrado ainda.
                </p>
              ) : (
                <div className="space-y-4">
                  {produtosComCusto.slice(0, 5).map((produto) => (
                    <div key={produto.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{produto.nome}</h4>
                        <p className="text-sm text-gray-600">{produto.descricao}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Preço: R$ {produto.precoVenda.toFixed(2)}</p>
                        <p className="text-sm font-medium text-green-600">
                          Lucro: R$ {produto.lucro.toFixed(2)} ({produto.margem}%)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
