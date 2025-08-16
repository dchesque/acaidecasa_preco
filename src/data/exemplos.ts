import { Embalagem, Insumo, ItemCardapio, Receita, Fornecedor, ProdutoFornecedor, CopoPadrao } from '@/types'

export const embalagenisExemplo: Embalagem[] = [
  {
    id: 'emb1',
    nome: 'Copo 300ml',
    precoUnitario: 0.25,
    ativa: true,
    tipoPrecificacao: 'unitario',
    precoUnitarioCalculado: 0.25
  },
  {
    id: 'emb2',
    nome: 'Copo 400ml',
    precoUnitario: 0.35,
    ativa: true,
    tipoPrecificacao: 'unitario',
    precoUnitarioCalculado: 0.35
  },
  {
    id: 'emb3',
    nome: 'Copo 500ml',
    precoUnitario: 0.45,
    ativa: true,
    tipoPrecificacao: 'unitario',
    precoUnitarioCalculado: 0.45
  },
  {
    id: 'emb4',
    nome: 'Tampa',
    precoUnitario: 0.10,
    ativa: true,
    tipoPrecificacao: 'unitario',
    precoUnitarioCalculado: 0.10
  },
  {
    id: 'emb5',
    nome: 'Colher',
    precoUnitario: 0.05,
    ativa: true,
    tipoPrecificacao: 'unitario',
    precoUnitarioCalculado: 0.05
  }
]

export const insumosExemplo: Insumo[] = [
  // Açaí
  {
    id: 'ins1',
    nome: 'Açaí Normal',
    tipo: 'acai',
    quantidadeComprada: 1000,
    precoComDesconto: 18.00,
    precoReal: 22.00,
    precoPorGrama: 0.022,
    unidadeMedida: 'g',
    unidadeMedida: 'g',
    ativo: true
  },
  {
    id: 'ins2',
    nome: 'Açaí Premium',
    tipo: 'acai',
    quantidadeComprada: 1000,
    precoComDesconto: 25.00,
    precoReal: 30.00,
    precoPorGrama: 0.030,
    unidadeMedida: 'g',
    ativo: true
  },
  
  // Complementos
  // Chocolates
  {
    id: 'ins3',
    nome: 'Nutella',
    tipo: 'chocolate',
    quantidadeComprada: 400,
    precoComDesconto: 15.00,
    precoReal: 18.00,
    precoPorGrama: 0.045,
    unidadeMedida: 'g',
    ativo: true
  },
  {
    id: 'ins4',
    nome: 'Chocolate ao Leite',
    tipo: 'chocolate',
    quantidadeComprada: 500,
    precoComDesconto: 12.00,
    precoReal: 15.00,
    precoPorGrama: 0.030,
    unidadeMedida: 'g',
    ativo: true
  },

  // Mousses
  {
    id: 'ins5',
    nome: 'Mousse de Maracujá',
    tipo: 'mousse',
    quantidadeComprada: 300,
    precoComDesconto: 8.00,
    precoReal: 10.00,
    precoPorGrama: 0.033,
    unidadeMedida: 'g',
    ativo: true
  },

  // Sorvetes
  {
    id: 'ins6',
    nome: 'Sorvete de Morango',
    tipo: 'sorvete',
    quantidadeComprada: 2000,
    precoComDesconto: 25.00,
    precoReal: 30.00,
    precoPorGrama: 0.015,
    unidadeMedida: 'g',
    ativo: true
  },

  // Coberturas
  {
    id: 'ins7',
    nome: 'Leite Condensado',
    tipo: 'cobertura',
    quantidadeComprada: 395,
    precoComDesconto: 3.50,
    precoReal: 4.20,
    precoPorGrama: 0.0106,
    unidadeMedida: 'g',
    ativo: true
  },

  // Cremes Premium
  {
    id: 'ins8',
    nome: 'Creme de Avelã',
    tipo: 'creme_premium',
    quantidadeComprada: 350,
    precoComDesconto: 20.00,
    precoReal: 25.00,
    precoPorGrama: 0.071,
    unidadeMedida: 'g',
    ativo: true
  },

  // Frutas
  {
    id: 'ins9',
    nome: 'Morango',
    tipo: 'fruta',
    quantidadeComprada: 500,
    precoComDesconto: 8.00,
    precoReal: 12.00,
    precoPorGrama: 0.024,
    unidadeMedida: 'g',
    ativo: true
  },
  {
    id: 'ins10',
    nome: 'Banana',
    tipo: 'fruta',
    quantidadeComprada: 1000,
    precoComDesconto: 3.00,
    precoReal: 4.00,
    precoPorGrama: 0.004,
    unidadeMedida: 'g',
    ativo: true
  },

  // Complementos
  {
    id: 'ins11',
    nome: 'Granola',
    tipo: 'complemento',
    quantidadeComprada: 500,
    precoComDesconto: 8.00,
    precoReal: 10.00,
    precoPorGrama: 0.020,
    unidadeMedida: 'g',
    ativo: true
  },
  {
    id: 'ins12',
    nome: 'Paçoca',
    tipo: 'complemento',
    quantidadeComprada: 400,
    precoComDesconto: 10.00,
    precoReal: 12.00,
    precoPorGrama: 0.030,
    unidadeMedida: 'g',
    ativo: true
  },

  // Matérias-primas para receitas caseiras
  {
    id: 'ins13',
    nome: 'Leite Ninho em Pó',
    tipo: 'materia_prima',
    quantidadeComprada: 800,
    precoComDesconto: 25.00,
    precoReal: 30.00,
    precoPorGrama: 0.0375,
    unidadeMedida: 'g',
    ativo: true
  },
  {
    id: 'ins14',
    nome: 'Creme de Leite',
    tipo: 'materia_prima',
    quantidadeComprada: 200,
    precoComDesconto: 4.50,
    precoReal: 5.50,
    precoPorGrama: 0.0275,
    unidadeMedida: 'g',
    ativo: true
  },
  {
    id: 'ins15',
    nome: 'Açúcar Cristal',
    tipo: 'materia_prima',
    quantidadeComprada: 1000,
    precoComDesconto: 3.50,
    precoReal: 4.20,
    precoPorGrama: 0.0042,
    unidadeMedida: 'g',
    ativo: true
  },
  {
    id: 'ins16',
    nome: 'Gelatina Incolor',
    tipo: 'materia_prima',
    quantidadeComprada: 24,
    precoComDesconto: 2.80,
    precoReal: 3.50,
    precoPorGrama: 0.146,
    unidadeMedida: 'g',
    ativo: true
  },
  {
    id: 'ins17',
    nome: 'Polpa de Morango',
    tipo: 'materia_prima',
    quantidadeComprada: 500,
    precoComDesconto: 8.00,
    precoReal: 10.00,
    precoPorGrama: 0.020,
    unidadeMedida: 'g',
    ativo: true
  },
  {
    id: 'ins18',
    nome: 'Chocolate em Pó',
    tipo: 'materia_prima',
    quantidadeComprada: 200,
    precoComDesconto: 8.50,
    precoReal: 10.00,
    precoPorGrama: 0.050,
    ativo: true
  }
]


export const cardapioExemplo: ItemCardapio[] = [
  // COMPLEMENTOS - Insumos vendidos individualmente
  {
    id: 'card1',
    nome: 'Nutella 50g',
    categoria: 'chocolates',
    tipo: 'complemento',
    insumoId: 'ins3', // Nutella
    custo: 2.25, // será recalculado automaticamente
    precoVenda: 5.50,
    markup: 3.25,
    percentualMargem: 144.4,
    ativo: true,
    observacoes: 'Chocolate premium importado',
    dataCriacao: new Date('2024-01-10'),
    dataAtualizacao: new Date('2024-01-10')
  },
  {
    id: 'card2',
    nome: 'Granola Crocante 50g',
    categoria: 'complementos',
    tipo: 'complemento',
    insumoId: 'ins11', // Granola
    custo: 1.00,
    precoVenda: 4.00,
    markup: 3.00,
    percentualMargem: 300.0,
    ativo: true,
    dataCriacao: new Date('2024-01-10'),
    dataAtualizacao: new Date('2024-01-10')
  },
  {
    id: 'card3',
    nome: 'Morango Fresco 50g',
    categoria: 'frutas',
    tipo: 'complemento',
    insumoId: 'ins9', // Morango
    custo: 1.20,
    precoVenda: 3.50,
    markup: 2.30,
    percentualMargem: 191.7,
    ativo: true,
    dataCriacao: new Date('2024-01-10'),
    dataAtualizacao: new Date('2024-01-10')
  },

  // RECEITAS - Receitas caseiras vendidas prontas
  {
    id: 'card4',
    nome: 'Creme Ninho Caseiro 50g',
    categoria: 'receitas',
    tipo: 'receita',
    receitaId: 'rec1', // Creme Ninho Caseiro
    custo: 1.60, // será recalculado automaticamente
    precoVenda: 6.00,
    markup: 4.40,
    percentualMargem: 275.0,
    ativo: true,
    observacoes: 'Receita caseira exclusiva',
    dataCriacao: new Date('2024-01-15'),
    dataAtualizacao: new Date('2024-01-15')
  },
  {
    id: 'card5',
    nome: 'Mousse de Morango 50g',
    categoria: 'receitas',
    tipo: 'receita',
    receitaId: 'rec2', // Mousse de Morango
    custo: 0.95,
    precoVenda: 4.50,
    markup: 3.55,
    percentualMargem: 373.7,
    ativo: true,
    dataCriacao: new Date('2024-01-20'),
    dataAtualizacao: new Date('2024-01-20')
  },


  // COMBINADOS - Agrupamentos de múltiplos itens
  {
    id: 'card9',
    nome: 'Combo Doce',
    categoria: 'combinados',
    tipo: 'combinado',
    composicao: [
      { tipo: 'insumo', insumoId: 'ins3', quantidade: 30 }, // Nutella 30g
      { tipo: 'insumo', insumoId: 'ins7', quantidade: 20 }, // Leite Condensado 20g
      { tipo: 'receita', receitaId: 'rec1', quantidade: 40 } // Creme Ninho 40g
    ],
    custo: 2.85, // será recalculado automaticamente
    precoVenda: 8.50,
    markup: 5.65,
    percentualMargem: 198.2,
    ativo: true,
    observacoes: 'Combinação perfeita para os doces',
    dataCriacao: new Date('2024-01-25'),
    dataAtualizacao: new Date('2024-01-25')
  },
  {
    id: 'card10',
    nome: 'Combo Frutas Premium',
    categoria: 'combinados',
    tipo: 'combinado',
    composicao: [
      { tipo: 'insumo', insumoId: 'ins9', quantidade: 60 }, // Morango 60g
      { tipo: 'insumo', insumoId: 'ins10', quantidade: 80 }, // Banana 80g
      { tipo: 'receita', receitaId: 'rec4', quantidade: 30 } // Creme de Morango Premium 30g
    ],
    custo: 2.69,
    precoVenda: 9.00,
    markup: 6.31,
    percentualMargem: 234.6,
    ativo: true,
    observacoes: 'Frutas frescas com creme especial',
    dataCriacao: new Date('2024-02-01'),
    dataAtualizacao: new Date('2024-02-01')
  },
  {
    id: 'card11',
    nome: 'Combo Açaí Completo',
    categoria: 'combinados',
    tipo: 'combinado',
    composicao: [
      { tipo: 'insumo', insumoId: 'ins3', quantidade: 20 }, // Nutella 20g
      { tipo: 'insumo', insumoId: 'ins9', quantidade: 40 } // Morango 40g
    ],
    custo: 10.76,
    precoVenda: 24.00,
    markup: 13.24,
    percentualMargem: 123.0,
    ativo: true,
    observacoes: 'Açaí completo com complementos premium',
    dataCriacao: new Date('2024-02-05'),
    dataAtualizacao: new Date('2024-02-05')
  }
]

export const receitasExemplo: Receita[] = [
  {
    id: 'rec1',
    nome: 'Creme Ninho Caseiro',
    descricao: 'Creme caseiro cremoso e saboroso feito com leite Ninho',
    categoriaId: undefined,
    ingredientes: [
      { insumoId: 'ins13', quantidade: 200, observacao: 'Leite Ninho' }, // 200g
      { insumoId: 'ins14', quantidade: 150, observacao: 'Creme de leite' }, // 150g
      { insumoId: 'ins15', quantidade: 50, observacao: 'Açúcar' } // 50g
    ],
    rendimento: 350,
    custoTotal: 11.24, // será recalculado automaticamente
    custoPorGrama: 0.032,
    modoPreparo: '1. Bata o leite Ninho com o açúcar até dissolver completamente\n2. Adicione o creme de leite gelado\n3. Bata até formar um creme homogêneo\n4. Leve à geladeira por 30 minutos antes de usar',
    tempoPreparoMinutos: 15,
    ativa: true,
    dataCriacao: new Date('2024-01-15'),
    dataAtualizacao: new Date('2024-01-15')
  },
  {
    id: 'rec2',
    nome: 'Mousse de Morango',
    descricao: 'Mousse leve e aerado com sabor intenso de morango',
    categoriaId: undefined,
    ingredientes: [
      { insumoId: 'ins17', quantidade: 250, observacao: 'Polpa de morango' },
      { insumoId: 'ins14', quantidade: 200, observacao: 'Creme de leite' },
      { insumoId: 'ins15', quantidade: 80, observacao: 'Açúcar' },
      { insumoId: 'ins16', quantidade: 12, observacao: 'Gelatina incolor' }
    ],
    rendimento: 450,
    custoTotal: 8.584,
    custoPorGrama: 0.019,
    modoPreparo: '1. Hidrate a gelatina em água fria\n2. Dissolva a gelatina em banho-maria\n3. Bata a polpa de morango com açúcar\n4. Adicione o creme de leite e a gelatina\n5. Bata até formar picos\n6. Leve à geladeira por 2 horas',
    tempoPreparoMinutos: 25,
    ativa: true,
    dataCriacao: new Date('2024-01-20'),
    dataAtualizacao: new Date('2024-01-20')
  },
  {
    id: 'rec3',
    nome: 'Cobertura de Chocolate',
    descricao: 'Cobertura cremosa de chocolate para finalizar os açaís',
    categoriaId: undefined,
    ingredientes: [
      { insumoId: 'ins18', quantidade: 150, observacao: 'Chocolate em pó' },
      { insumoId: 'ins14', quantidade: 100, observacao: 'Creme de leite' },
      { insumoId: 'ins15', quantidade: 60, observacao: 'Açúcar' }
    ],
    rendimento: 280,
    custoTotal: 10.527,
    custoPorGrama: 0.038,
    modoPreparo: '1. Misture o chocolate em pó com o açúcar\n2. Aqueça o creme de leite sem ferver\n3. Adicione aos poucos o creme quente na mistura de chocolate\n4. Mexa até ficar homogêneo\n5. Deixe esfriar antes de usar',
    tempoPreparoMinutos: 12,
    ativa: true,
    dataCriacao: new Date('2024-01-25'),
    dataAtualizacao: new Date('2024-01-25')
  },
  {
    id: 'rec4',
    nome: 'Creme de Morango Premium',
    descricao: 'Creme especial com morango natural e textura aveludada',
    categoriaId: undefined,
    ingredientes: [
      { insumoId: 'ins17', quantidade: 200, observacao: 'Polpa de morango' },
      { insumoId: 'ins13', quantidade: 100, observacao: 'Leite Ninho' },
      { insumoId: 'ins14', quantidade: 120, observacao: 'Creme de leite' },
      { insumoId: 'ins15', quantidade: 40, observacao: 'Açúcar' }
    ],
    rendimento: 400,
    custoTotal: 12.418,
    custoPorGrama: 0.031,
    modoPreparo: '1. Bata a polpa de morango com açúcar\n2. Adicione o leite Ninho e misture bem\n3. Incorpore o creme de leite gelado\n4. Bata até formar um creme liso\n5. Refrigere por 1 hora antes de servir',
    tempoPreparoMinutos: 18,
    ativa: true,
    dataCriacao: new Date('2024-02-01'),
    dataAtualizacao: new Date('2024-02-01')
  },
  {
    id: 'rec5',
    nome: 'Mousse de Chocolate',
    descricao: 'Mousse tradicional de chocolate, perfeito para os amantes do cacau',
    categoriaId: undefined,
    ingredientes: [
      { insumoId: 'ins18', quantidade: 120, observacao: 'Chocolate em pó' },
      { insumoId: 'ins14', quantidade: 180, observacao: 'Creme de leite' },
      { insumoId: 'ins15', quantidade: 70, observacao: 'Açúcar' },
      { insumoId: 'ins16', quantidade: 10, observacao: 'Gelatina' }
    ],
    rendimento: 320,
    custoTotal: 11.798,
    custoPorGrama: 0.037,
    modoPreparo: '1. Hidrate a gelatina\n2. Misture chocolate em pó com açúcar\n3. Aqueça metade do creme de leite\n4. Dissolva a mistura de chocolate no creme quente\n5. Adicione a gelatina dissolvida\n6. Bata o creme restante em picos\n7. Incorpore delicadamente\n8. Refrigere por 3 horas',
    tempoPreparoMinutos: 30,
    ativa: false, // Receita inativa para demonstrar filtros
    dataCriacao: new Date('2024-02-05'),
    dataAtualizacao: new Date('2024-02-05')
  }
]

export const fornecedoresExemplo: Fornecedor[] = [
  {
    id: 'forn1',
    nome: 'GEPACK Embalagens',
    contato: {
      telefone: '(11) 98765-4321',
      email: 'vendas@gepack.com.br',
      endereco: 'Rua das Embalagens, 123 - São Paulo/SP'
    },
    observacoes: 'Fornecedor especializado em embalagens descartáveis. Entrega rápida.',
    ativo: true,
    dataCriacao: new Date('2024-01-10'),
    dataAtualizacao: new Date('2024-01-10')
  },
  {
    id: 'forn2', 
    nome: 'Açaí Premium Ltda',
    contato: {
      telefone: '(91) 97654-3210',
      email: 'comercial@acaipremium.com.br',
      endereco: 'Av. das Palmeiras, 456 - Belém/PA'
    },
    observacoes: 'Fornecedor de polpas de açaí. Produto de alta qualidade direto do Pará.',
    ativo: true,
    dataCriacao: new Date('2024-01-15'),
    dataAtualizacao: new Date('2024-01-15')
  },
  {
    id: 'forn3',
    nome: 'Doce Sabor',
    contato: {
      telefone: '(11) 96543-2109', 
      email: 'pedidos@docesabor.com.br',
      endereco: 'Rua dos Chocolates, 789 - Ribeirão Preto/SP'
    },
    observacoes: 'Fornecedor de chocolates, leite ninho e complementos doces.',
    ativo: true,
    dataCriacao: new Date('2024-01-20'),
    dataAtualizacao: new Date('2024-01-20')
  },
  {
    id: 'forn4',
    nome: 'Frutas do Vale',
    contato: {
      telefone: '(19) 95432-1098',
      email: 'contato@frutasdovale.com.br',
      endereco: 'Estrada Rural km 15 - Campinas/SP'
    },
    observacoes: 'Fornecedor de frutas frescas e polpas naturais. Preços sazonais.',
    ativo: false, // Fornecedor inativo para demonstrar filtros
    dataCriacao: new Date('2024-02-01'),
    dataAtualizacao: new Date('2024-02-01')
  }
]

export const produtosFornecedoresExemplo: ProdutoFornecedor[] = [
  // Produtos da GEPACK (embalagens)
  {
    id: 'pf1',
    fornecedorId: 'forn1',
    insumoId: 'ins1', // Açaí tradicional
    precoUnitario: 0.008,
    unidade: 'g',
    quantidadeMinima: 1000,
    tempoEntregaDias: 3,
    percentualDesconto: 5,
    precoComDesconto: 0.0076,
    ativo: true,
    dataAtualizacao: new Date('2024-01-10')
  },
  // Açaí Premium
  {
    id: 'pf2',
    fornecedorId: 'forn2',
    insumoId: 'ins1', // Açaí tradicional
    precoUnitario: 0.0075,
    unidade: 'g', 
    quantidadeMinima: 2000,
    tempoEntregaDias: 5,
    percentualDesconto: 8,
    precoComDesconto: 0.0069,
    ativo: true,
    dataAtualizacao: new Date('2024-01-15')
  },
  {
    id: 'pf3',
    fornecedorId: 'forn2',
    insumoId: 'ins2', // Açaí zero
    precoUnitario: 0.009,
    unidade: 'g',
    quantidadeMinima: 1500,
    tempoEntregaDias: 5,
    percentualDesconto: 10,
    precoComDesconto: 0.0081,
    ativo: true,
    dataAtualizacao: new Date('2024-01-15')
  },
  // Doce Sabor
  {
    id: 'pf4',
    fornecedorId: 'forn3',
    insumoId: 'ins4', // Granulado
    precoUnitario: 0.012,
    unidade: 'g',
    quantidadeMinima: 500,
    tempoEntregaDias: 2,
    percentualDesconto: 15,
    precoComDesconto: 0.0102,
    ativo: true,
    dataAtualizacao: new Date('2024-01-20')
  },
  {
    id: 'pf5',
    fornecedorId: 'forn3',
    insumoId: 'ins13', // Leite Ninho
    precoUnitario: 0.045,
    unidade: 'g',
    quantidadeMinima: 400,
    tempoEntregaDias: 2,
    percentualDesconto: 12,
    precoComDesconto: 0.0396,
    ativo: true,
    dataAtualizacao: new Date('2024-01-20')
  },
  {
    id: 'pf6',
    fornecedorId: 'forn3',
    insumoId: 'ins3', // Chocolate em pó
    precoUnitario: 0.028,
    unidade: 'g',
    quantidadeMinima: 1000,
    tempoEntregaDias: 3,
    percentualDesconto: 20,
    precoComDesconto: 0.0224,
    ativo: true,
    dataAtualizacao: new Date('2024-01-20')
  },
  // Frutas do Vale (fornecedor inativo)
  {
    id: 'pf7',
    fornecedorId: 'forn4',
    insumoId: 'ins8', // Morango
    precoUnitario: 0.015,
    unidade: 'g',
    quantidadeMinima: 200,
    tempoEntregaDias: 1,
    percentualDesconto: 0,
    precoComDesconto: 0.015,
    ativo: true,
    dataAtualizacao: new Date('2024-02-01')
  }
]

export const coposPadraoExemplo: CopoPadrao[] = [
  {
    id: 'copo1',
    tamanho: '180ml',
    porcaoGramas: 180,
    precoBase: 8.50,
    tipoAcai: 'tradicional',
    categoria: '100%_puro',
    embalagens: ['emb4', 'emb5'], // Tampa e Colher
    custoEmbalagem: 0.20, // 0.10 + 0.10
    custoAcai: 1.44, // 180g * 0.008/g
    custoTotal: 1.64,
    precoVenda: 8.50,
    margem: 418.3, // (8.50 - 1.64) / 1.64 * 100
    ativo: true,
    dataCriacao: new Date('2024-01-01'),
    dataAtualizacao: new Date('2024-01-01')
  },
  {
    id: 'copo2',
    tamanho: '300ml',
    porcaoGramas: 230,
    precoBase: 12.00,
    tipoAcai: 'tradicional',
    categoria: '100%_puro',
    embalagens: ['emb1', 'emb4', 'emb5'], // Copo 300ml, Tampa e Colher
    custoEmbalagem: 0.45, // 0.25 + 0.10 + 0.10
    custoAcai: 1.84, // 230g * 0.008/g
    custoTotal: 2.29,
    precoVenda: 12.00,
    margem: 424.0, // (12.00 - 2.29) / 2.29 * 100
    ativo: true,
    dataCriacao: new Date('2024-01-01'),
    dataAtualizacao: new Date('2024-01-01')
  },
  {
    id: 'copo3',
    tamanho: '400ml',
    porcaoGramas: 300,
    precoBase: 15.00,
    tipoAcai: 'tradicional',
    categoria: '100%_puro',
    embalagens: ['emb2', 'emb4', 'emb5'], // Copo 400ml, Tampa e Colher
    custoEmbalagem: 0.55, // 0.35 + 0.10 + 0.10
    custoAcai: 2.40, // 300g * 0.008/g
    custoTotal: 2.95,
    precoVenda: 15.00,
    margem: 408.5, // (15.00 - 2.95) / 2.95 * 100
    ativo: true,
    dataCriacao: new Date('2024-01-01'),
    dataAtualizacao: new Date('2024-01-01')
  },
  {
    id: 'copo4',
    tamanho: '500ml',
    porcaoGramas: 400,
    precoBase: 18.00,
    tipoAcai: 'tradicional',
    categoria: '100%_puro',
    embalagens: ['emb3', 'emb4', 'emb5'], // Copo 500ml, Tampa e Colher
    custoEmbalagem: 0.65, // 0.45 + 0.10 + 0.10
    custoAcai: 3.20, // 400g * 0.008/g
    custoTotal: 3.85,
    precoVenda: 18.00,
    margem: 367.5, // (18.00 - 3.85) / 3.85 * 100
    ativo: true,
    dataCriacao: new Date('2024-01-01'),
    dataAtualizacao: new Date('2024-01-01')
  },
  {
    id: 'copo5',
    tamanho: '400ml',
    porcaoGramas: 300,
    precoBase: 16.50,
    tipoAcai: 'zero',
    categoria: '100%_puro',
    embalagens: ['emb2', 'emb4', 'emb5'], // Copo 400ml, Tampa e Colher
    custoEmbalagem: 0.55, // 0.35 + 0.10 + 0.10
    custoAcai: 2.70, // 300g * 0.009/g (açaí zero é mais caro)
    custoTotal: 3.25,
    precoVenda: 16.50,
    margem: 407.7, // (16.50 - 3.25) / 3.25 * 100
    ativo: true,
    dataCriacao: new Date('2024-01-01'),
    dataAtualizacao: new Date('2024-01-01')
  },
  {
    id: 'copo6',
    tamanho: '300ml',
    porcaoGramas: 230,
    precoBase: 14.00,
    tipoAcai: 'cupuacu',
    categoria: '100%_puro',
    embalagens: ['emb1', 'emb4', 'emb5'], // Copo 300ml, Tampa e Colher
    custoEmbalagem: 0.45, // 0.25 + 0.10 + 0.10
    custoAcai: 1.84, // 230g * 0.008/g (usando preço base do açaí)
    custoTotal: 2.29,
    precoVenda: 14.00,
    margem: 511.4, // (14.00 - 2.29) / 2.29 * 100
    ativo: false, // Produto temporariamente inativo
    dataCriacao: new Date('2024-01-05'),
    dataAtualizacao: new Date('2024-01-05')
  }
]

// Função para carregar dados de exemplo
export function carregarDadosExemplo() {
  const dadosExemplo = {
    embalagens: embalagenisExemplo,
    insumos: insumosExemplo,
    cardapio: cardapioExemplo,
    receitas: receitasExemplo,
    fornecedores: fornecedoresExemplo,
    produtosFornecedores: produtosFornecedoresExemplo,
    coposPadrao: coposPadraoExemplo
  }
  
  localStorage.setItem('acai-delivery-data', JSON.stringify(dadosExemplo))
  
  // Recarregar a página para aplicar os dados
  window.location.reload()
}