export interface Embalagem {
  id: string
  nome: string // ex: "Copo 400ml", "Tampa", "Colher"
  precoUnitario: number
  ativa: boolean
  tipoPrecificacao: 'unitario' | 'lote'
  quantidadeLote?: number // quando tipoPrecificacao for 'lote'
  precoLote?: number // quando tipoPrecificacao for 'lote'
  precoUnitarioCalculado: number // calculado automaticamente
  fornecedorId?: string
  categoriaId?: string
  imagemUrl?: string // base64 ou URL da imagem
  observacoes?: string
}

export interface CategoriaEmbalagem {
  id: string
  nome: string
  cor: string // gerada automaticamente
  dataCriacao: Date
}

export interface CategoriaInsumo {
  id: string
  nome: string
  cor: string // gerada automaticamente
  descricao?: string
  dataCriacao: Date
}

export interface PrecoInsumoFornecedor {
  id: string
  insumoId: string
  fornecedorId: string
  precoBruto: number // preço original sem desconto
  precoComDesconto: number // preço final com desconto aplicado
  unidade: string // g, ml, kg, l, unidade
  quantidadeMinima?: number
  tempoEntregaDias?: number
  ativo: boolean
  padrao: boolean // indica qual usar nos cálculos
  dataAtualizacao: Date
}

export interface Insumo {
  id: string
  nome: string
  categoriaId?: string
  imagemUrl?: string
  observacoes?: string
  unidadeMedida: string // g, ml, kg, l, unidade
  ativo: boolean
  
  // Campos mantidos para compatibilidade durante migração - serão removidos após migração completa
  tipo?: 'acai' | 'chocolate' | 'mousse' | 'sorvete' | 'cobertura' | 'creme_premium' | 'fruta' | 'complemento' | 'materia_prima' | 'receita'
  receitaId?: string
  quantidadeComprada?: number
  precoComDesconto?: number
  precoReal?: number
  precoPorGrama?: number
}


export interface ComposicaoItem {
  insumoId?: string
  receitaId?: string
  quantidade: number // gramas ou unidades
  tipo: 'insumo' | 'receita'
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
  
  // Para copos (referência aos copos criados)
  copoId?: string
  
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

export interface CategoriaReceita {
  id: string
  nome: string
  cor: string // gerada automaticamente
  descricao?: string
  dataCriacao: Date
}

export interface ItemReceita {
  insumoId: string
  quantidade: number // em gramas
  observacao?: string
}

export interface ReceitaIngredienteDetalhado {
  insumoId: string
  nome: string
  quantidade: number
  precoPorGrama: number
  subtotal: number
  fornecedor?: string
  categoria?: string
}

export interface CustoDetalhadoReceita {
  custoTotal: number
  custoPorGrama: number
  ingredientes: ReceitaIngredienteDetalhado[]
  fornecedoresEnvolvidos: {
    fornecedorId: string
    nome: string
    itens: string[]
  }[]
}

export interface Receita {
  id: string
  nome: string // ex: "Creme Ninho", "Mousse Chocolate Caseiro"
  descricao?: string
  categoriaId?: string // ID da categoria dinâmica
  ingredientes: ItemReceita[] // lista de insumos e quantidades
  rendimento: number // quantos gramas a receita produz
  modoPreparo?: string
  tempoPreparoMinutos?: number
  observacoes?: string
  custoTotal: number // calculado automaticamente
  custoPorGrama: number // custoTotal / rendimento
  ativa: boolean
  dataCriacao: Date
  dataAtualizacao: Date
}


// Interfaces para Sistema de Fornecedores
export interface Fornecedor {
  id: string
  nome: string
  contato: {
    telefone?: string
    email?: string
    endereco?: string
  }
  observacoes?: string
  ativo: boolean
  dataCriacao: Date
  dataAtualizacao: Date
}

export interface ProdutoFornecedor {
  id: string
  fornecedorId: string
  insumoId: string
  precoUnitario: number
  unidade: string
  quantidadeMinima?: number
  tempoEntregaDias?: number
  percentualDesconto: number
  precoComDesconto: number // calculado automaticamente
  ativo: boolean
  dataAtualizacao: Date
}

export interface ComparacaoFornecedor {
  insumoId: string
  insumoNome: string
  fornecedores: {
    fornecedorId: string
    fornecedorNome: string
    preco: number
    precoComDesconto: number
    desconto: number
    tempoEntrega?: number
    ativo: boolean
  }[]
  melhorPreco: {
    fornecedorId: string
    preco: number
    economia: number
    economiaPercentual: number
  }
}

// Interface para Sistema de Categorias de Copo
export interface CategoriaCopo {
  id: string
  nome: string
  cor: string // gerada automaticamente
  descricao?: string
  dataCriacao: Date
}

// Interface para composição de insumos no copo
export interface CopoInsumo {
  insumoId: string
  quantidade: number // em gramas
}

// Interface para composição de embalagens no copo
export interface CopoEmbalagem {
  embalagemId: string
  quantidade: number // normalmente 1
}

// Interface para Sistema de Copos Redesenhado
export interface Copo {
  id: string
  nome: string
  descricao?: string
  categoriaId?: string
  insumos: CopoInsumo[]
  embalagens: CopoEmbalagem[]
  custoTotal: number // calculado automaticamente
  custoInsumos: number // calculado
  custoEmbalagens: number // calculado
  observacoes?: string
  ativo: boolean
  dataCriacao: Date
  dataAtualizacao: Date
}

// Interface para breakdown detalhado de custos do copo
export interface CustoDetalhoCopo {
  custoInsumos: number
  custoEmbalagens: number
  custoTotal: number
  insumos: {
    insumoId: string
    nome: string
    quantidade: number
    precoPorGrama: number
    subtotal: number
    fornecedor?: string
  }[]
  embalagens: {
    embalagemId: string
    nome: string
    quantidade: number
    precoUnitario: number
    subtotal: number
    fornecedor?: string
  }[]
  fornecedoresEnvolvidos: {
    fornecedorId: string
    nome: string
    itens: string[]
  }[]
}

// Interface para templates de copos
export interface TemplateCopo {
  tamanho: string
  porcaoGramas: number
  embalagensPadrao: string[]
  margemSugerida: number
}

// Interface legacy para compatibilidade (a ser removida gradualmente)
export interface CopoPadrao {
  id: string
  tamanho: '180ml' | '300ml' | '400ml' | '500ml'
  porcaoGramas: number
  precoBase: number
  tipoAcai: 'tradicional' | 'zero' | 'cupuacu'
  categoria: '100%_puro' | 'com_adicional'
  embalagens: string[]
  custoEmbalagem: number
  custoAcai: number
  custoTotal: number
  precoVenda: number
  margem: number
  ativo: boolean
  dataCriacao: Date
  dataAtualizacao: Date
}

// Tipos para contexto/estado
export interface AppState {
  embalagens: Embalagem[]
  categoriasEmbalagem: CategoriaEmbalagem[]
  categoriasInsumo: CategoriaInsumo[]
  categoriasCopo: CategoriaCopo[]
  categoriasReceita: CategoriaReceita[]
  insumos: Insumo[]
  precosInsumoFornecedor: PrecoInsumoFornecedor[]
  copos: Copo[]
  cardapio: ItemCardapio[]
  receitas: Receita[]
  fornecedores: Fornecedor[]
  produtosFornecedores: ProdutoFornecedor[]
  coposPadrao: CopoPadrao[] // legacy - manter por compatibilidade
}

export interface AppContextType extends AppState {
  // Embalagens
  addEmbalagem: (embalagem: Omit<Embalagem, 'id' | 'precoUnitarioCalculado'>) => void
  updateEmbalagem: (id: string, embalagem: Partial<Embalagem>) => void
  deleteEmbalagem: (id: string) => void
  calcularPrecoUnitario: (embalagem: Pick<Embalagem, 'tipoPrecificacao' | 'precoUnitario' | 'precoLote' | 'quantidadeLote'>) => number
  
  // Categorias de Embalagem
  addCategoriaEmbalagem: (categoria: Omit<CategoriaEmbalagem, 'id' | 'cor' | 'dataCriacao'>) => void
  updateCategoriaEmbalagem: (id: string, categoria: Partial<CategoriaEmbalagem>) => void
  deleteCategoriaEmbalagem: (id: string) => void
  
  // Insumos
  addInsumo: (insumo: Omit<Insumo, 'id'>) => void
  updateInsumo: (id: string, insumo: Partial<Insumo>) => void
  deleteInsumo: (id: string) => void
  getInsumoPrecoAtivo: (insumoId: string) => PrecoInsumoFornecedor | null
  calcularCustoPorGrama: (insumoId: string) => number
  
  // Categorias de Insumo
  addCategoriaInsumo: (categoria: Omit<CategoriaInsumo, 'id' | 'cor' | 'dataCriacao'>) => void
  updateCategoriaInsumo: (id: string, categoria: Partial<CategoriaInsumo>) => void
  deleteCategoriaInsumo: (id: string) => void
  
  // Categorias de Copo
  addCategoriaCopo: (categoria: Omit<CategoriaCopo, 'id' | 'cor' | 'dataCriacao'>) => void
  updateCategoriaCopo: (id: string, categoria: Partial<CategoriaCopo>) => void
  deleteCategoriaCopo: (id: string) => void
  
  // Categorias de Receita
  addCategoriaReceita: (categoria: Omit<CategoriaReceita, 'id' | 'cor' | 'dataCriacao'>) => void
  updateCategoriaReceita: (id: string, categoria: Partial<CategoriaReceita>) => void
  deleteCategoriaReceita: (id: string) => void
  
  // Preços de Insumo por Fornecedor
  addPrecoInsumoFornecedor: (preco: Omit<PrecoInsumoFornecedor, 'id' | 'dataAtualizacao'>) => void
  updatePrecoInsumoFornecedor: (id: string, preco: Partial<PrecoInsumoFornecedor>) => void
  deletePrecoInsumoFornecedor: (id: string) => void
  setFornecedorPadrao: (insumoId: string, fornecedorId: string) => void
  
  
  // Copos
  addCopo: (copo: Omit<Copo, 'id' | 'custoTotal' | 'custoInsumos' | 'custoEmbalagens' | 'dataCriacao' | 'dataAtualizacao'>) => void
  updateCopo: (id: string, copo: Partial<Copo>) => void
  deleteCopo: (id: string) => void
  calcularCustoDetalheCopo: (copo: Partial<Copo>) => CustoDetalhoCopo
  duplicarCopo: (id: string) => string | null
  
  // Cardápio
  addItemCardapio: (item: Omit<ItemCardapio, 'id' | 'markup' | 'percentualMargem'>) => void
  updateItemCardapio: (id: string, item: Partial<ItemCardapio>) => void
  deleteItemCardapio: (id: string) => void
  
  // Receitas
  addReceita: (receita: Omit<Receita, 'id' | 'custoTotal' | 'custoPorGrama' | 'dataCriacao' | 'dataAtualizacao'>) => void
  updateReceita: (id: string, receita: Partial<Receita>) => void
  deleteReceita: (id: string) => void
  calcularCustoReceitaDetalhado: (ingredientes: ItemReceita[], rendimento: number) => CustoDetalhadoReceita
  duplicarReceita: (id: string) => string | null
  escalarReceita: (id: string, fator: number) => string | null
  
  // Fornecedores
  addFornecedor: (fornecedor: Omit<Fornecedor, 'id' | 'dataCriacao' | 'dataAtualizacao'>) => void
  updateFornecedor: (id: string, fornecedor: Partial<Fornecedor>) => void
  deleteFornecedor: (id: string) => void
  
  // Produtos de Fornecedores
  addProdutoFornecedor: (produto: Omit<ProdutoFornecedor, 'id' | 'precoComDesconto' | 'dataAtualizacao'>) => void
  updateProdutoFornecedor: (id: string, produto: Partial<ProdutoFornecedor>) => void
  deleteProdutoFornecedor: (id: string) => void
  
  // Calculadoras
  calcularPrecoPorGrama: (insumo: Pick<Insumo, 'precoReal' | 'quantidadeComprada'>) => number
  calcularMarkupMargem: (custo: number, precoVenda: number) => { markup: number; percentualMargem: number }
  calcularCustoReceita: (ingredientes: ItemReceita[], rendimento: number) => { custoTotal: number; custoPorGrama: number }
  
  // Comparações de Fornecedores
  obterComparacaoPrecos: (insumoId: string) => ComparacaoFornecedor | null
  aplicarMelhorPreco: (insumoId: string, fornecedorId: string) => void
  calcularEconomiaTotal: () => number
  
  // Copos Padronizados
  addCopoPadrao: (copo: Omit<CopoPadrao, 'id' | 'custoEmbalagem' | 'custoAcai' | 'custoTotal' | 'dataCriacao' | 'dataAtualizacao'>) => void
  updateCopoPadrao: (id: string, copo: Partial<CopoPadrao>) => void
  deleteCopoPadrao: (id: string) => void
  calcularCustoCopo: (copo: Partial<CopoPadrao>) => { custoEmbalagem: number; custoAcai: number; custoTotal: number }
  criarCoposPadrao: () => void
  obterTemplatesCopos: () => TemplateCopo[]
}