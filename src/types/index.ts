export interface Embalagem {
  id: string
  nome: string // ex: "Copo 400ml", "Tampa", "Colher"
  precoUnitario: number
  ativa: boolean
}

export interface Insumo {
  id: string
  nome: string
  tipo: 'acai' | 'chocolate' | 'mousse' | 'sorvete' | 'cobertura' | 'creme_premium' | 'fruta' | 'complemento' | 'materia_prima' | 'receita'
  quantidadeComprada: number // em gramas
  precoComDesconto: number // valor realmente pago
  precoReal: number // preço sem desconto (usado na precificação)
  precoPorGrama: number // calculado: precoReal / quantidadeComprada
  ativo: boolean
  receitaId?: string // ID da receita associada quando tipo === 'receita'
}

export interface ProdutoInsumo {
  insumoId: string
  quantidade: number // em gramas
}

export interface Produto {
  id: string
  nome: string // ex: "400ml - 100% Tradicional"
  tamanho: '180ml' | '300ml' | '400ml' | '500ml'
  tipoAcai: 'tradicional' | 'zero'
  categoria: '100%_puro' | 'com_adicional'
  embalagens: string[] // IDs das embalagens
  insumos: ProdutoInsumo[]
  custoTotal: number // calculado automaticamente
  precoVenda: number
  margem: number // em percentual
  ativo: boolean
}

export interface CustoDetalhado {
  custoEmbalagens: number
  custoInsumos: number
  custoTotal: number
  precoVenda: number
  margem: number
  lucro: number
}

export interface ComposicaoItem {
  insumoId?: string
  receitaId?: string
  produtoId?: string
  quantidade: number // gramas ou unidades
  tipo: 'insumo' | 'receita' | 'produto'
}

export interface ItemCardapio {
  id: string
  nome: string
  categoria: 'chocolates' | 'mousses' | 'sorvetes' | 'coberturas' | 'cremes_premium' | 'frutas' | 'complementos' | 'receitas' | 'copos' | 'combinados'
  tipo: 'complemento' | 'copo' | 'receita' | 'combinado'
  
  // Para complementos individuais
  insumoId?: string
  
  // Para receitas
  receitaId?: string
  
  // Para copos (referência aos produtos criados)
  produtoId?: string
  
  // Para combinados
  composicao?: ComposicaoItem[]
  
  custo: number // calculado automaticamente baseado no tipo
  precoVenda: number
  markup: number
  percentualMargem: number
  ativo: boolean
  observacoes?: string
  dataCriacao: Date
  dataAtualizacao: Date
}

export interface ItemReceita {
  insumoId: string
  quantidade: number // em gramas
  observacao?: string
}

export interface Receita {
  id: string
  nome: string // ex: "Creme Ninho", "Mousse Chocolate Caseiro"
  descricao?: string
  categoria: 'creme' | 'mousse' | 'cobertura' | 'outro'
  ingredientes: ItemReceita[] // lista de insumos e quantidades
  rendimento: number // quantos gramas a receita produz
  modoPreparo?: string
  tempoPreparoMinutos?: number
  custoTotal: number // calculado automaticamente
  custoPorGrama: number // custoTotal / rendimento
  ativa: boolean
  dataCriacao: Date
  dataAtualizacao: Date
}

export interface RelatorioItem {
  produtoId: string
  nome: string
  custoTotal: number
  precoVenda: number
  margem: number
  lucro: number
}

// Tipos para contexto/estado
export interface AppState {
  embalagens: Embalagem[]
  insumos: Insumo[]
  produtos: Produto[]
  cardapio: ItemCardapio[]
  receitas: Receita[]
}

export interface AppContextType extends AppState {
  // Embalagens
  addEmbalagem: (embalagem: Omit<Embalagem, 'id'>) => void
  updateEmbalagem: (id: string, embalagem: Partial<Embalagem>) => void
  deleteEmbalagem: (id: string) => void
  
  // Insumos
  addInsumo: (insumo: Omit<Insumo, 'id' | 'precoPorGrama'>) => void
  updateInsumo: (id: string, insumo: Partial<Insumo>) => void
  deleteInsumo: (id: string) => void
  
  // Produtos
  addProduto: (produto: Omit<Produto, 'id' | 'custoTotal'>) => void
  updateProduto: (id: string, produto: Partial<Produto>) => void
  deleteProduto: (id: string) => void
  
  // Cardápio
  addItemCardapio: (item: Omit<ItemCardapio, 'id' | 'markup' | 'percentualMargem'>) => void
  updateItemCardapio: (id: string, item: Partial<ItemCardapio>) => void
  deleteItemCardapio: (id: string) => void
  
  // Receitas
  addReceita: (receita: Omit<Receita, 'id' | 'custoTotal' | 'custoPorGrama' | 'dataCriacao' | 'dataAtualizacao'>) => void
  updateReceita: (id: string, receita: Partial<Receita>) => void
  deleteReceita: (id: string) => void
  
  // Calculadoras
  calcularCustoProduto: (produto: Produto) => CustoDetalhado
  calcularPrecoPorGrama: (insumo: Pick<Insumo, 'precoReal' | 'quantidadeComprada'>) => number
  calcularMarkupMargem: (custo: number, precoVenda: number) => { markup: number; percentualMargem: number }
  calcularCustoReceita: (ingredientes: ItemReceita[], rendimento: number) => { custoTotal: number; custoPorGrama: number }
}