import { Embalagem, Insumo, Produto, ItemCardapio, Receita } from '@/types'

export const embalagenisExemplo: Embalagem[] = [
  {
    id: 'emb1',
    nome: 'Copo 300ml',
    precoUnitario: 0.25,
    ativa: true
  },
  {
    id: 'emb2',
    nome: 'Copo 400ml',
    precoUnitario: 0.35,
    ativa: true
  },
  {
    id: 'emb3',
    nome: 'Copo 500ml',
    precoUnitario: 0.45,
    ativa: true
  },
  {
    id: 'emb4',
    nome: 'Tampa',
    precoUnitario: 0.10,
    ativa: true
  },
  {
    id: 'emb5',
    nome: 'Colher',
    precoUnitario: 0.05,
    ativa: true
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

export const produtosExemplo: Produto[] = [
  {
    id: 'prod1',
    nome: '300ml - 100% Tradicional',
    tamanho: '300ml',
    tipoAcai: 'tradicional',
    categoria: '100%_puro',
    embalagens: ['emb1', 'emb4', 'emb5'], // Copo 300ml + Tampa + Colher
    insumos: [
      { insumoId: 'ins1', quantidade: 250 }  // 250g açaí normal
    ],
    custoTotal: 5.40, // será recalculado
    precoVenda: 12.00,
    margem: 80,
    ativo: true
  },
  {
    id: 'prod2',
    nome: '400ml - Tradicional c/ Granola',
    tamanho: '400ml',
    tipoAcai: 'tradicional',
    categoria: 'com_adicional',
    embalagens: ['emb2', 'emb4', 'emb5'], // Copo 400ml + Tampa + Colher
    insumos: [
      { insumoId: 'ins1', quantidade: 300 }, // 300g açaí normal
      { insumoId: 'ins11', quantidade: 40 }  // 40g granola
    ],
    custoTotal: 8.80, // será recalculado
    precoVenda: 18.00,
    margem: 90,
    ativo: true
  },
  {
    id: 'prod3',
    nome: '500ml - Premium com Frutas',
    tamanho: '500ml',
    tipoAcai: 'tradicional',
    categoria: 'com_adicional',
    embalagens: ['emb3', 'emb4', 'emb5'], // Copo 500ml + Tampa + Colher
    insumos: [
      { insumoId: 'ins2', quantidade: 350 }, // 350g açaí premium
      { insumoId: 'ins9', quantidade: 50 },  // 50g morango
      { insumoId: 'ins10', quantidade: 60 }  // 60g banana
    ],
    custoTotal: 11.50, // será recalculado
    precoVenda: 25.00,
    margem: 85,
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

  // COPOS - Produtos completos de açaí
  {
    id: 'card6',
    nome: 'Açaí Tradicional 300ml',
    categoria: 'copos',
    tipo: 'copo',
    produtoId: 'prod1', // 300ml - 100% Tradicional
    custo: 5.40, // será recalculado automaticamente
    precoVenda: 12.00,
    markup: 6.60,
    percentualMargem: 122.2,
    ativo: true,
    observacoes: 'Açaí puro tradicional',
    dataCriacao: new Date('2024-01-10'),
    dataAtualizacao: new Date('2024-01-10')
  },
  {
    id: 'card7',
    nome: 'Açaí com Granola 400ml',
    categoria: 'copos',
    tipo: 'copo',
    produtoId: 'prod2', // 400ml - Tradicional c/ Granola
    custo: 8.80,
    precoVenda: 18.00,
    markup: 9.20,
    percentualMargem: 104.5,
    ativo: true,
    observacoes: 'Açaí tradicional com granola crocante',
    dataCriacao: new Date('2024-01-10'),
    dataAtualizacao: new Date('2024-01-10')
  },
  {
    id: 'card8',
    nome: 'Açaí Premium 500ml',
    categoria: 'copos',
    tipo: 'copo',
    produtoId: 'prod3', // 500ml - Premium com Frutas
    custo: 11.50,
    precoVenda: 25.00,
    markup: 13.50,
    percentualMargem: 117.4,
    ativo: true,
    observacoes: 'Açaí premium com frutas frescas',
    dataCriacao: new Date('2024-01-10'),
    dataAtualizacao: new Date('2024-01-10')
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
      { tipo: 'produto', produtoId: 'prod2', quantidade: 1 }, // Açaí 400ml c/ Granola
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
    categoria: 'creme',
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
    categoria: 'mousse',
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
    categoria: 'cobertura',
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
    categoria: 'creme',
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
    categoria: 'mousse',
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

// Função para carregar dados de exemplo
export function carregarDadosExemplo() {
  const dadosExemplo = {
    embalagens: embalagenisExemplo,
    insumos: insumosExemplo,
    produtos: produtosExemplo,
    cardapio: cardapioExemplo,
    receitas: receitasExemplo
  }
  
  localStorage.setItem('acai-delivery-data', JSON.stringify(dadosExemplo))
  
  // Recarregar a página para aplicar os dados
  window.location.reload()
}