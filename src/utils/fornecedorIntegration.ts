// Utilitários para integração aprimorada do sistema de fornecedores
import { ProdutoFornecedor, Insumo, Embalagem, FornecedorInfo } from '@/types'

// Função para calcular economia entre fornecedores
export function calcularEconomiaFornecedores(
  produtos: ProdutoFornecedor[],
  produtoId: string
): {
  melhorPreco: number
  economias: Array<{
    fornecedorId: string
    fornecedorNome: string
    preco: number
    economia: number
    economiaPercentual: number
  }>
} {
  const produtosFiltrados = produtos.filter(p => 
    p.produtoId === produtoId && p.ativo && p.disponivel
  )
  
  if (produtosFiltrados.length === 0) {
    return { melhorPreco: 0, economias: [] }
  }
  
  const melhorPreco = Math.min(...produtosFiltrados.map(p => p.precoComDesconto))
  
  const economias = produtosFiltrados.map(produto => ({
    fornecedorId: produto.fornecedorId,
    fornecedorNome: produto.produtoNome,
    preco: produto.precoComDesconto,
    economia: produto.precoComDesconto - melhorPreco,
    economiaPercentual: melhorPreco > 0 
      ? ((produto.precoComDesconto - melhorPreco) / melhorPreco) * 100 
      : 0
  }))
  
  return { melhorPreco, economias }
}

// Função para atualizar informações de fornecedores em produtos
export function atualizarFornecedoresInfo(
  produto: Insumo | Embalagem,
  produtosFornecedores: ProdutoFornecedor[]
): FornecedorInfo[] {
  const fornecedoresInfo = produtosFornecedores
    .filter(pf => pf.produtoId === produto.id && pf.ativo)
    .map(pf => ({
      fornecedorId: pf.fornecedorId,
      fornecedorNome: pf.produtoNome,
      preco: pf.precoUnitario,
      precoComDesconto: pf.precoComDesconto,
      disponivel: pf.disponivel,
      preferencial: pf.preferencial,
      prazoEntrega: pf.prazoEntrega,
      ultimaAtualizacao: pf.ultimaAtualizacao
    }))
  
  return fornecedoresInfo
}

// Função para encontrar o melhor fornecedor
export function encontrarMelhorFornecedor(
  fornecedores: FornecedorInfo[]
): FornecedorInfo | null {
  const disponíveis = fornecedores.filter(f => f.disponivel)
  
  if (disponíveis.length === 0) return null
  
  // Priorizar fornecedor preferencial se disponível
  const preferencial = disponíveis.find(f => f.preferencial)
  if (preferencial) return preferencial
  
  // Caso contrário, escolher o de menor preço
  return disponíveis.reduce((melhor, atual) => 
    atual.precoComDesconto < melhor.precoComDesconto ? atual : melhor
  )
}

// Função para validar dados de produto-fornecedor
export function validarProdutoFornecedor(
  produto: Partial<ProdutoFornecedor>
): { valido: boolean; erros: string[] } {
  const erros: string[] = []
  
  if (!produto.fornecedorId) erros.push('Fornecedor é obrigatório')
  if (!produto.produtoId) erros.push('Produto é obrigatório')
  if (!produto.produtoNome) erros.push('Nome do produto é obrigatório')
  if (!produto.produtoTipo) erros.push('Tipo do produto é obrigatório')
  if (!produto.precoUnitario || produto.precoUnitario <= 0) erros.push('Preço unitário deve ser maior que zero')
  if (!produto.unidadeMedida) erros.push('Unidade de medida é obrigatória')
  
  return {
    valido: erros.length === 0,
    erros
  }
}

// Função para calcular impacto de troca de fornecedor
export function calcularImpactoTrocaFornecedor(
  produtoId: string,
  fornecedorAtualId: string,
  novoFornecedorId: string,
  produtos: ProdutoFornecedor[]
): {
  economia: number
  economiaPercentual: number
  impactoMensal: number
  valido: boolean
} {
  const produtoAtual = produtos.find(p => 
    p.produtoId === produtoId && p.fornecedorId === fornecedorAtualId
  )
  
  const novoFornecedor = produtos.find(p => 
    p.produtoId === produtoId && p.fornecedorId === novoFornecedorId
  )
  
  if (!produtoAtual || !novoFornecedor) {
    return { economia: 0, economiaPercentual: 0, impactoMensal: 0, valido: false }
  }
  
  const economia = produtoAtual.precoComDesconto - novoFornecedor.precoComDesconto
  const economiaPercentual = produtoAtual.precoComDesconto > 0 
    ? (economia / produtoAtual.precoComDesconto) * 100 
    : 0
  
  // Estimativa de impacto mensal (baseado em consumo médio)
  const consumoMedioMensal = 100 // kg/mês estimado
  const impactoMensal = economia * consumoMedioMensal
  
  return {
    economia,
    economiaPercentual,
    impactoMensal,
    valido: true
  }
}

// Função para gerar relatório de fornecedores
export function gerarRelatorioFornecedores(
  produtos: ProdutoFornecedor[]
): {
  totalProdutos: number
  fornecedoresAtivos: number
  economiaTotal: number
  produtos: Array<{
    produtoId: string
    produtoNome: string
    fornecedores: number
    melhorPreco: number
    precoMedio: number
    economiaMaxima: number
  }>
} {
  const produtosPorId = new Map<string, ProdutoFornecedor[]>()
  
  // Agrupar produtos por ID
  produtos.forEach(produto => {
    if (!produtosPorId.has(produto.produtoId)) {
      produtosPorId.set(produto.produtoId, [])
    }
    produtosPorId.get(produto.produtoId)!.push(produto)
  })
  
  const produtosResumo = Array.from(produtosPorId.entries()).map(([produtoId, produtosList]) => {
    const ativos = produtosList.filter(p => p.ativo && p.disponivel)
    const precos = ativos.map(p => p.precoComDesconto)
    
    const melhorPreco = Math.min(...precos)
    const precoMedio = precos.reduce((sum, preco) => sum + preco, 0) / precos.length
    const economiaMaxima = Math.max(...precos) - melhorPreco
    
    return {
      produtoId,
      produtoNome: produtosList[0]?.produtoNome || 'Produto sem nome',
      fornecedores: ativos.length,
      melhorPreco,
      precoMedio,
      economiaMaxima
    }
  })
  
  const economiaTotal = produtosResumo.reduce((total, produto) => 
    total + produto.economiaMaxima, 0
  )
  
  const fornecedoresUnicos = new Set(produtos.map(p => p.fornecedorId))
  
  return {
    totalProdutos: produtosPorId.size,
    fornecedoresAtivos: fornecedoresUnicos.size,
    economiaTotal,
    produtos: produtosResumo
  }
}

// Hook para facilitar uso em componentes
export function useFornecedorIntegration() {
  return {
    calcularEconomia: calcularEconomiaFornecedores,
    atualizarInfo: atualizarFornecedoresInfo,
    encontrarMelhor: encontrarMelhorFornecedor,
    validarProduto: validarProdutoFornecedor,
    calcularImpacto: calcularImpactoTrocaFornecedor,
    gerarRelatorio: gerarRelatorioFornecedores
  }
}

export default {
  calcularEconomiaFornecedores,
  atualizarFornecedoresInfo,
  encontrarMelhorFornecedor,
  validarProdutoFornecedor,
  calcularImpactoTrocaFornecedor,
  gerarRelatorioFornecedores,
  useFornecedorIntegration
}