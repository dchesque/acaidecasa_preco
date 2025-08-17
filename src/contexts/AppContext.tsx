'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { 
  AppState, 
  AppContextType, 
  Embalagem, 
  CategoriaEmbalagem,
  CategoriaInsumo,
  CategoriaReceita,
  Insumo,
  PrecoInsumoFornecedor,
  ItemCardapio,
  Receita,
  ItemReceita,
  CustoDetalhadoReceita,
  ReceitaIngredienteDetalhado,
  Fornecedor,
  ProdutoFornecedor,
  ComparacaoFornecedor,
  CopoPadrao,
  TemplateCopo,
  CategoriaCopo,
  Copo,
  CustoDetalhoCopo
} from '@/types'
import { generateCategoryColor } from '@/utils/colorGenerator'

// Estado inicial
const initialState: AppState = {
  embalagens: [],
  categoriasEmbalagem: [],
  categoriasInsumo: [],
  categoriasCopo: [],
  categoriasReceita: [],
  insumos: [],
  precosInsumoFornecedor: [],
  copos: [],
  cardapio: [],
  receitas: [],
  fornecedores: [],
  produtosFornecedores: [],
  coposPadrao: [] // mantido para compatibilidade
}

// Actions
type Action = 
  | { type: 'LOAD_DATA'; payload: AppState }
  | { type: 'ADD_EMBALAGEM'; payload: Embalagem }
  | { type: 'UPDATE_EMBALAGEM'; payload: { id: string; data: Partial<Embalagem> } }
  | { type: 'DELETE_EMBALAGEM'; payload: string }
  | { type: 'ADD_CATEGORIA_EMBALAGEM'; payload: CategoriaEmbalagem }
  | { type: 'UPDATE_CATEGORIA_EMBALAGEM'; payload: { id: string; data: Partial<CategoriaEmbalagem> } }
  | { type: 'DELETE_CATEGORIA_EMBALAGEM'; payload: string }
  | { type: 'ADD_CATEGORIA_INSUMO'; payload: CategoriaInsumo }
  | { type: 'UPDATE_CATEGORIA_INSUMO'; payload: { id: string; data: Partial<CategoriaInsumo> } }
  | { type: 'DELETE_CATEGORIA_INSUMO'; payload: string }
  | { type: 'ADD_INSUMO'; payload: Insumo }
  | { type: 'UPDATE_INSUMO'; payload: { id: string; data: Partial<Insumo> } }
  | { type: 'DELETE_INSUMO'; payload: string }
  | { type: 'ADD_PRECO_INSUMO_FORNECEDOR'; payload: PrecoInsumoFornecedor }
  | { type: 'UPDATE_PRECO_INSUMO_FORNECEDOR'; payload: { id: string; data: Partial<PrecoInsumoFornecedor> } }
  | { type: 'DELETE_PRECO_INSUMO_FORNECEDOR'; payload: string }
  | { type: 'ADD_ITEM_CARDAPIO'; payload: ItemCardapio }
  | { type: 'UPDATE_ITEM_CARDAPIO'; payload: { id: string; data: Partial<ItemCardapio> } }
  | { type: 'DELETE_ITEM_CARDAPIO'; payload: string }
  | { type: 'ADD_RECEITA'; payload: Receita }
  | { type: 'UPDATE_RECEITA'; payload: { id: string; data: Partial<Receita> } }
  | { type: 'DELETE_RECEITA'; payload: string }
  | { type: 'ADD_FORNECEDOR'; payload: Fornecedor }
  | { type: 'UPDATE_FORNECEDOR'; payload: { id: string; data: Partial<Fornecedor> } }
  | { type: 'DELETE_FORNECEDOR'; payload: string }
  | { type: 'ADD_PRODUTO_FORNECEDOR'; payload: ProdutoFornecedor }
  | { type: 'UPDATE_PRODUTO_FORNECEDOR'; payload: { id: string; data: Partial<ProdutoFornecedor> } }
  | { type: 'DELETE_PRODUTO_FORNECEDOR'; payload: string }
  | { type: 'ADD_CATEGORIA_COPO'; payload: CategoriaCopo }
  | { type: 'UPDATE_CATEGORIA_COPO'; payload: { id: string; data: Partial<CategoriaCopo> } }
  | { type: 'DELETE_CATEGORIA_COPO'; payload: string }
  | { type: 'ADD_CATEGORIA_RECEITA'; payload: CategoriaReceita }
  | { type: 'UPDATE_CATEGORIA_RECEITA'; payload: { id: string; data: Partial<CategoriaReceita> } }
  | { type: 'DELETE_CATEGORIA_RECEITA'; payload: string }
  | { type: 'ADD_COPO'; payload: Copo }
  | { type: 'UPDATE_COPO'; payload: { id: string; data: Partial<Copo> } }
  | { type: 'DELETE_COPO'; payload: string }
  | { type: 'ADD_COPO_PADRAO'; payload: CopoPadrao }
  | { type: 'UPDATE_COPO_PADRAO'; payload: { id: string; data: Partial<CopoPadrao> } }
  | { type: 'DELETE_COPO_PADRAO'; payload: string }

// Reducer
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_DATA':
      return action.payload
    
    case 'ADD_EMBALAGEM':
      return { ...state, embalagens: [...state.embalagens, action.payload] }
    
    case 'UPDATE_EMBALAGEM':
      return {
        ...state,
        embalagens: state.embalagens.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      }
    
    case 'DELETE_EMBALAGEM':
      return {
        ...state,
        embalagens: state.embalagens.filter(item => item.id !== action.payload)
      }
    
    case 'ADD_CATEGORIA_EMBALAGEM':
      return { ...state, categoriasEmbalagem: [...state.categoriasEmbalagem, action.payload] }
    
    case 'UPDATE_CATEGORIA_EMBALAGEM':
      return {
        ...state,
        categoriasEmbalagem: state.categoriasEmbalagem.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      }
    
    case 'DELETE_CATEGORIA_EMBALAGEM':
      return {
        ...state,
        categoriasEmbalagem: state.categoriasEmbalagem.filter(item => item.id !== action.payload),
        // Remover categoriaId das embalagens que usavam esta categoria
        embalagens: state.embalagens.map(embalagem => 
          embalagem.categoriaId === action.payload 
            ? { ...embalagem, categoriaId: undefined } 
            : embalagem
        )
      }
    
    case 'ADD_CATEGORIA_INSUMO':
      return { ...state, categoriasInsumo: [...state.categoriasInsumo, action.payload] }
    
    case 'UPDATE_CATEGORIA_INSUMO':
      return {
        ...state,
        categoriasInsumo: state.categoriasInsumo.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      }
    
    case 'DELETE_CATEGORIA_INSUMO':
      return {
        ...state,
        categoriasInsumo: state.categoriasInsumo.filter(item => item.id !== action.payload),
        // Remover categoriaId dos insumos que usavam esta categoria
        insumos: state.insumos.map(insumo => 
          insumo.categoriaId === action.payload 
            ? { ...insumo, categoriaId: undefined } 
            : insumo
        )
      }
    
    case 'ADD_CATEGORIA_COPO':
      return { ...state, categoriasCopo: [...state.categoriasCopo, action.payload] }
    
    case 'UPDATE_CATEGORIA_COPO':
      return {
        ...state,
        categoriasCopo: state.categoriasCopo.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      }
    
    case 'DELETE_CATEGORIA_COPO':
      return {
        ...state,
        categoriasCopo: state.categoriasCopo.filter(item => item.id !== action.payload),
        // Remover categoriaId dos copos que usavam esta categoria
        copos: state.copos.map(copo => 
          copo.categoriaId === action.payload 
            ? { ...copo, categoriaId: undefined } 
            : copo
        )
      }
    
    case 'ADD_CATEGORIA_RECEITA':
      return { ...state, categoriasReceita: [...state.categoriasReceita, action.payload] }
    
    case 'UPDATE_CATEGORIA_RECEITA':
      return {
        ...state,
        categoriasReceita: state.categoriasReceita.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      }
    
    case 'DELETE_CATEGORIA_RECEITA':
      return {
        ...state,
        categoriasReceita: state.categoriasReceita.filter(item => item.id !== action.payload),
        // Remover categoriaId das receitas que usavam esta categoria
        receitas: state.receitas.map(receita => 
          receita.categoriaId === action.payload 
            ? { ...receita, categoriaId: undefined } 
            : receita
        )
      }
    
    case 'ADD_COPO':
      return { ...state, copos: [...state.copos, action.payload] }
    
    case 'UPDATE_COPO':
      return {
        ...state,
        copos: state.copos.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      }
    
    case 'DELETE_COPO':
      return {
        ...state,
        copos: state.copos.filter(item => item.id !== action.payload)
      }
    
    case 'ADD_INSUMO':
      return { ...state, insumos: [...state.insumos, action.payload] }
    
    case 'UPDATE_INSUMO':
      return {
        ...state,
        insumos: state.insumos.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      }
    
    case 'DELETE_INSUMO':
      return {
        ...state,
        insumos: state.insumos.filter(item => item.id !== action.payload),
        // Remover preços associados ao insumo excluído
        precosInsumoFornecedor: state.precosInsumoFornecedor.filter(preco => preco.insumoId !== action.payload)
      }
    
    case 'ADD_PRECO_INSUMO_FORNECEDOR':
      return { ...state, precosInsumoFornecedor: [...state.precosInsumoFornecedor, action.payload] }
    
    case 'UPDATE_PRECO_INSUMO_FORNECEDOR':
      return {
        ...state,
        precosInsumoFornecedor: state.precosInsumoFornecedor.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      }
    
    case 'DELETE_PRECO_INSUMO_FORNECEDOR':
      return {
        ...state,
        precosInsumoFornecedor: state.precosInsumoFornecedor.filter(item => item.id !== action.payload)
      }
    
    case 'ADD_ITEM_CARDAPIO':
      return { ...state, cardapio: [...state.cardapio, action.payload] }
    
    case 'UPDATE_ITEM_CARDAPIO':
      return {
        ...state,
        cardapio: state.cardapio.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      }
    
    case 'DELETE_ITEM_CARDAPIO':
      return {
        ...state,
        cardapio: state.cardapio.filter(item => item.id !== action.payload)
      }
    
    case 'ADD_RECEITA':
      return { ...state, receitas: [...state.receitas, action.payload] }
    
    case 'UPDATE_RECEITA':
      return {
        ...state,
        receitas: state.receitas.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      }
    
    case 'DELETE_RECEITA':
      return {
        ...state,
        receitas: state.receitas.filter(item => item.id !== action.payload)
      }
    
    case 'ADD_FORNECEDOR':
      return { ...state, fornecedores: [...state.fornecedores, action.payload] }
    
    case 'UPDATE_FORNECEDOR':
      return {
        ...state,
        fornecedores: state.fornecedores.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      }
    
    case 'DELETE_FORNECEDOR':
      return {
        ...state,
        fornecedores: state.fornecedores.filter(item => item.id !== action.payload),
        produtosFornecedores: state.produtosFornecedores.filter(item => item.fornecedorId !== action.payload)
      }
    
    case 'ADD_PRODUTO_FORNECEDOR':
      return { ...state, produtosFornecedores: [...state.produtosFornecedores, action.payload] }
    
    case 'UPDATE_PRODUTO_FORNECEDOR':
      return {
        ...state,
        produtosFornecedores: state.produtosFornecedores.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      }
    
    case 'DELETE_PRODUTO_FORNECEDOR':
      return {
        ...state,
        produtosFornecedores: state.produtosFornecedores.filter(item => item.id !== action.payload)
      }
    
    case 'ADD_COPO_PADRAO':
      return { ...state, coposPadrao: [...state.coposPadrao, action.payload] }
    
    case 'UPDATE_COPO_PADRAO':
      return {
        ...state,
        coposPadrao: state.coposPadrao.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      }
    
    case 'DELETE_COPO_PADRAO':
      return {
        ...state,
        coposPadrao: state.coposPadrao.filter(item => item.id !== action.payload)
      }
    
    default:
      return state
  }
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Carregar dados do localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('acai-delivery-data')
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      // Garantir compatibilidade com versões anteriores
      dispatch({ 
        type: 'LOAD_DATA', 
        payload: {
          ...parsedData,
          categoriasEmbalagem: parsedData.categoriasEmbalagem || [],
          categoriasInsumo: parsedData.categoriasInsumo || [],
          categoriasCopo: parsedData.categoriasCopo || [],
          categoriasReceita: parsedData.categoriasReceita || [],
          precosInsumoFornecedor: parsedData.precosInsumoFornecedor || [],
          fornecedores: parsedData.fornecedores || [],
          produtosFornecedores: parsedData.produtosFornecedores || [],
          copos: parsedData.copos || [],
          coposPadrao: parsedData.coposPadrao || [],
          // Migração automática de embalagens existentes
          embalagens: (parsedData.embalagens || []).map((embalagem: Embalagem) => ({
            ...embalagem,
            tipoPrecificacao: embalagem.tipoPrecificacao || 'unitario',
            precoUnitarioCalculado: embalagem.precoUnitarioCalculado || embalagem.precoUnitario || 0
          })),
          // Migração automática de insumos existentes
          insumos: (parsedData.insumos || []).map((insumo: Insumo) => ({
            ...insumo,
            unidadeMedida: insumo.unidadeMedida || 'g'
          }))
        }
      })
    }
  }, [])

  // Salvar no localStorage
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('acai-delivery-data', JSON.stringify(state))
    }
  }, [state])

  // Sincronizar receitas como insumos automaticamente
  useEffect(() => {
    if (state.receitas.length > 0) {
      const receitasAtivas = state.receitas.filter(r => r.ativa)
      const insumosSemReceitas = state.insumos.filter(ins => 
        ins.tipo !== 'receita' || (ins.receitaId && receitasAtivas.find(r => r.id === ins.receitaId))
      )
      
      const novosInsumos = receitasAtivas.map(receita => {
        const insumoExistente = state.insumos.find(ins => ins.receitaId === receita.id)
        
        return {
          id: insumoExistente?.id || `receita-${receita.id}`,
          nome: receita.nome,
          tipo: 'receita' as const,
          quantidadeComprada: receita.rendimento,
          precoComDesconto: receita.custoTotal,
          precoReal: receita.custoTotal,
          precoPorGrama: receita.custoPorGrama,
          ativo: receita.ativa,
          receitaId: receita.id
        }
      })
      
      const todosInsumos = [...insumosSemReceitas, ...novosInsumos]
      
      // Só atualiza se houver mudanças reais
      const insumosReceitas = state.insumos.filter(ins => ins.tipo === 'receita')
      const precisaAtualizar = insumosReceitas.length !== novosInsumos.length ||
        novosInsumos.some(novoIns => {
          const existente = insumosReceitas.find(ins => ins.receitaId === novoIns.receitaId)
          return !existente || 
            existente.nome !== novoIns.nome ||
            existente.precoPorGrama !== novoIns.precoPorGrama ||
            existente.ativo !== novoIns.ativo
        })
      
      if (precisaAtualizar) {
        dispatch({ type: 'LOAD_DATA', payload: { ...state, insumos: todosInsumos } })
      }
    }
  }, [state.receitas])

  // Funções utilitárias
  const calcularPrecoPorGrama = (insumo: Pick<Insumo, 'precoReal' | 'quantidadeComprada'>): number => {
    return insumo.quantidadeComprada > 0 ? insumo.precoReal / insumo.quantidadeComprada : 0
  }

  const calcularPrecoUnitario = (embalagem: Pick<Embalagem, 'tipoPrecificacao' | 'precoUnitario' | 'precoLote' | 'quantidadeLote'>): number => {
    if (embalagem.tipoPrecificacao === 'lote') {
      if (embalagem.precoLote && embalagem.quantidadeLote && embalagem.quantidadeLote > 0) {
        return embalagem.precoLote / embalagem.quantidadeLote
      }
      return 0
    }
    return embalagem.precoUnitario || 0
  }

  // Novas funções para insumos
  const getInsumoPrecoAtivo = (insumoId: string): PrecoInsumoFornecedor | null => {
    return state.precosInsumoFornecedor.find(preco => 
      preco.insumoId === insumoId && preco.ativo && preco.padrao
    ) || null
  }

  const calcularCustoPorGrama = (insumoId: string): number => {
    const precoAtivo = getInsumoPrecoAtivo(insumoId)
    if (!precoAtivo) return 0
    
    // Converte o preço para gramas baseado na unidade
    const precoFinal = precoAtivo.precoComDesconto
    const unidade = precoAtivo.unidade.toLowerCase()
    
    if (unidade === 'kg') {
      return precoFinal / 1000 // 1kg = 1000g
    } else if (unidade === 'l') {
      return precoFinal / 1000 // 1l = 1000ml (assumindo densidade da água)
    } else if (unidade === 'ml') {
      return precoFinal // 1ml = 1g (assumindo densidade da água)
    } else if (unidade === 'g') {
      return precoFinal
    } else if (unidade === 'unidade') {
      return precoFinal // Por unidade
    }
    
    return precoFinal // Default
  }


  const calcularMarkupMargem = (custo: number, precoVenda: number) => {
    const markup = precoVenda - custo
    const percentualMargem = custo > 0 ? ((precoVenda - custo) / custo) * 100 : 0
    return { markup, percentualMargem }
  }

  const calcularCustoReceita = (ingredientes: ItemReceita[], rendimento: number) => {
    const custoTotal = ingredientes.reduce((total, item) => {
      const custoPorGrama = calcularCustoPorGrama(item.insumoId)
      return total + (item.quantidade * custoPorGrama)
    }, 0)

    const custoPorGrama = rendimento > 0 ? custoTotal / rendimento : 0
    
    return { custoTotal, custoPorGrama }
  }

  const calcularCustoReceitaDetalhado = (ingredientes: ItemReceita[], rendimento: number): CustoDetalhadoReceita => {
    const ingredientesDetalhados: ReceitaIngredienteDetalhado[] = ingredientes.map(item => {
      const insumo = state.insumos.find(i => i.id === item.insumoId)
      const precoAtivo = getInsumoPrecoAtivo(item.insumoId)
      const custoPorGrama = calcularCustoPorGrama(item.insumoId)
      const subtotal = item.quantidade * custoPorGrama
      
      // Encontrar fornecedor ativo
      let fornecedor = undefined
      if (precoAtivo) {
        const fornecedorData = state.fornecedores.find(f => f.id === precoAtivo.fornecedorId)
        fornecedor = fornecedorData?.nome
      }

      // Encontrar categoria do insumo
      let categoria = undefined
      if (insumo?.categoriaId) {
        const categoriaData = state.categoriasInsumo.find(c => c.id === insumo.categoriaId)
        categoria = categoriaData?.nome
      }

      return {
        insumoId: item.insumoId,
        nome: insumo?.nome || 'Insumo não encontrado',
        quantidade: item.quantidade,
        precoPorGrama: custoPorGrama,
        subtotal,
        fornecedor,
        categoria
      }
    })

    const custoTotal = ingredientesDetalhados.reduce((total, item) => total + item.subtotal, 0)
    const custoPorGrama = rendimento > 0 ? custoTotal / rendimento : 0

    // Criar lista única de fornecedores envolvidos
    const fornecedoresMap = new Map<string, { nome: string; itens: string[] }>()
    
    ingredientesDetalhados.forEach(item => {
      if (item.fornecedor) {
        const key = item.fornecedor
        if (!fornecedoresMap.has(key)) {
          fornecedoresMap.set(key, { nome: item.fornecedor, itens: [] })
        }
        fornecedoresMap.get(key)!.itens.push(item.nome)
      }
    })

    const fornecedoresEnvolvidos = Array.from(fornecedoresMap.entries()).map(([id, data]) => ({
      fornecedorId: id,
      nome: data.nome,
      itens: [...new Set(data.itens)] // remover duplicatas
    }))

    return {
      custoTotal,
      custoPorGrama,
      ingredientes: ingredientesDetalhados,
      fornecedoresEnvolvidos
    }
  }

  // Função para calcular custo detalhado do copo
  const calcularCustoDetalheCopo = (copo: Partial<Copo>): CustoDetalhoCopo => {
    const detalhesInsumos = (copo.insumos || []).map(copoInsumo => {
      const insumo = state.insumos.find(i => i.id === copoInsumo.insumoId)
      const precoAtivo = getInsumoPrecoAtivo(copoInsumo.insumoId)
      const custoPorGrama = calcularCustoPorGrama(copoInsumo.insumoId)
      const subtotal = copoInsumo.quantidade * custoPorGrama
      
      // Encontrar fornecedor ativo
      let fornecedor = undefined
      if (precoAtivo) {
        const fornecedorData = state.fornecedores.find(f => f.id === precoAtivo.fornecedorId)
        fornecedor = fornecedorData?.nome
      }

      return {
        insumoId: copoInsumo.insumoId,
        nome: insumo?.nome || 'Insumo não encontrado',
        quantidade: copoInsumo.quantidade,
        precoPorGrama: custoPorGrama,
        subtotal,
        fornecedor
      }
    })

    const detalhesEmbalagens = (copo.embalagens || []).map(copoEmbalagem => {
      const embalagem = state.embalagens.find(e => e.id === copoEmbalagem.embalagemId)
      const subtotal = copoEmbalagem.quantidade * (embalagem?.precoUnitarioCalculado || 0)
      
      // Encontrar fornecedor se vinculado
      let fornecedor = undefined
      if (embalagem?.fornecedorId) {
        const fornecedorData = state.fornecedores.find(f => f.id === embalagem.fornecedorId)
        fornecedor = fornecedorData?.nome
      }

      return {
        embalagemId: copoEmbalagem.embalagemId,
        nome: embalagem?.nome || 'Embalagem não encontrada',
        quantidade: copoEmbalagem.quantidade,
        precoUnitario: embalagem?.precoUnitarioCalculado || 0,
        subtotal,
        fornecedor
      }
    })

    const custoInsumos = detalhesInsumos.reduce((total, item) => total + item.subtotal, 0)
    const custoEmbalagens = detalhesEmbalagens.reduce((total, item) => total + item.subtotal, 0)
    const custoTotal = custoInsumos + custoEmbalagens

    // Criar lista única de fornecedores envolvidos
    const fornecedoresMap = new Map<string, { nome: string; itens: string[] }>()
    
    detalhesInsumos.forEach(item => {
      if (item.fornecedor) {
        const key = item.fornecedor
        if (!fornecedoresMap.has(key)) {
          fornecedoresMap.set(key, { nome: item.fornecedor, itens: [] })
        }
        fornecedoresMap.get(key)!.itens.push(item.nome)
      }
    })

    detalhesEmbalagens.forEach(item => {
      if (item.fornecedor) {
        const key = item.fornecedor
        if (!fornecedoresMap.has(key)) {
          fornecedoresMap.set(key, { nome: item.fornecedor, itens: [] })
        }
        fornecedoresMap.get(key)!.itens.push(item.nome)
      }
    })

    const fornecedoresEnvolvidos = Array.from(fornecedoresMap.entries()).map(([id, data]) => ({
      fornecedorId: id,
      nome: data.nome,
      itens: [...new Set(data.itens)] // remover duplicatas
    }))

    return {
      custoInsumos,
      custoEmbalagens,
      custoTotal,
      insumos: detalhesInsumos,
      embalagens: detalhesEmbalagens,
      fornecedoresEnvolvidos
    }
  }

  const calcularCustoItemCardapio = (item: Partial<ItemCardapio>): number => {
    switch (item.tipo) {
      case 'complemento':
        if (item.insumoId) {
          const custoPorGrama = calcularCustoPorGrama(item.insumoId)
          return custoPorGrama * 50 // 50g padrão para complementos
        }
        return 0

      case 'receita':
        if (item.receitaId) {
          const receita = state.receitas.find(r => r.id === item.receitaId)
          return receita ? receita.custoPorGrama * 50 : 0 // 50g padrão para receitas
        }
        return 0

      case 'copo':
        if (item.copoId) {
          const copo = state.copos.find(c => c.id === item.copoId)
          return copo ? copo.custoTotal : 0
        }
        return 0

      case 'combinado':
        if (item.composicao) {
          return item.composicao.reduce((total, comp) => {
            switch (comp.tipo) {
              case 'insumo':
                const insumo = state.insumos.find(i => i.id === comp.insumoId)
                return total + (insumo ? insumo.precoPorGrama * comp.quantidade : 0)
              
              case 'receita':
                const receita = state.receitas.find(r => r.id === comp.receitaId)
                return total + (receita ? receita.custoPorGrama * comp.quantidade : 0)
              
              
              default:
                return total
            }
          }, 0)
        }
        return 0

      default:
        return 0
    }
  }

  const contextValue = {
    ...state,

    // Embalagens
    addEmbalagem: (embalagem) => {
      const precoUnitarioCalculado = calcularPrecoUnitario(embalagem)
      const newEmbalagem: Embalagem = {
        id: Date.now().toString(),
        ...embalagem,
        precoUnitarioCalculado
      }
      dispatch({ type: 'ADD_EMBALAGEM', payload: newEmbalagem })
    },

    updateEmbalagem: (id, data) => {
      let updatedData = { ...data }
      // Recalcular preço unitário se dados relevantes mudaram
      if (data.tipoPrecificacao !== undefined || data.precoUnitario !== undefined || 
          data.precoLote !== undefined || data.quantidadeLote !== undefined) {
        const embalagem = state.embalagens.find(e => e.id === id)
        if (embalagem) {
          const mergedEmbalagem = { ...embalagem, ...data }
          const novoPrecoCalculado = calcularPrecoUnitario(mergedEmbalagem)
          updatedData = { ...updatedData, precoUnitarioCalculado: novoPrecoCalculado }
        }
      }
      dispatch({ type: 'UPDATE_EMBALAGEM', payload: { id, data: updatedData } })
    },

    deleteEmbalagem: (id) => {
      dispatch({ type: 'DELETE_EMBALAGEM', payload: id })
    },

    calcularPrecoUnitario,

    // Categorias de Embalagem
    addCategoriaEmbalagem: (categoria) => {
      const cor = generateCategoryColor()
      const newCategoria: CategoriaEmbalagem = {
        id: Date.now().toString(),
        ...categoria,
        cor,
        dataCriacao: new Date()
      }
      dispatch({ type: 'ADD_CATEGORIA_EMBALAGEM', payload: newCategoria })
    },

    updateCategoriaEmbalagem: (id, data) => {
      dispatch({ type: 'UPDATE_CATEGORIA_EMBALAGEM', payload: { id, data } })
    },

    deleteCategoriaEmbalagem: (id) => {
      // Verificar se há embalagens usando esta categoria
      const embalagensDaCategoria = state.embalagens.filter(e => e.categoriaId === id)
      if (embalagensDaCategoria.length > 0) {
        throw new Error(`Não é possível excluir a categoria. ${embalagensDaCategoria.length} embalagem(ns) ainda está(ão) usando esta categoria.`)
      }
      dispatch({ type: 'DELETE_CATEGORIA_EMBALAGEM', payload: id })
    },

    // Insumos
    addInsumo: (insumo) => {
      const newInsumo: Insumo = {
        id: Date.now().toString(),
        ...insumo
      }
      dispatch({ type: 'ADD_INSUMO', payload: newInsumo })
    },

    updateInsumo: (id, data) => {
      dispatch({ type: 'UPDATE_INSUMO', payload: { id, data } })
    },

    deleteInsumo: (id) => {
      dispatch({ type: 'DELETE_INSUMO', payload: id })
    },

    getInsumoPrecoAtivo,
    calcularCustoPorGrama,

    // Categorias de Insumo
    addCategoriaInsumo: (categoria) => {
      const cor = generateCategoryColor()
      const newCategoria: CategoriaInsumo = {
        id: Date.now().toString(),
        ...categoria,
        cor,
        dataCriacao: new Date()
      }
      dispatch({ type: 'ADD_CATEGORIA_INSUMO', payload: newCategoria })
    },

    updateCategoriaInsumo: (id, data) => {
      dispatch({ type: 'UPDATE_CATEGORIA_INSUMO', payload: { id, data } })
    },

    deleteCategoriaInsumo: (id) => {
      // Verificar se há insumos usando esta categoria
      const insumosDaCategoria = state.insumos.filter(i => i.categoriaId === id)
      if (insumosDaCategoria.length > 0) {
        throw new Error(`Não é possível excluir a categoria. ${insumosDaCategoria.length} insumo(s) ainda está(ão) usando esta categoria.`)
      }
      dispatch({ type: 'DELETE_CATEGORIA_INSUMO', payload: id })
    },

    // Categorias de Copo
    addCategoriaCopo: (categoria) => {
      const cor = generateCategoryColor()
      const newCategoria: CategoriaCopo = {
        id: Date.now().toString(),
        ...categoria,
        cor,
        dataCriacao: new Date()
      }
      dispatch({ type: 'ADD_CATEGORIA_COPO', payload: newCategoria })
    },

    updateCategoriaCopo: (id, data) => {
      dispatch({ type: 'UPDATE_CATEGORIA_COPO', payload: { id, data } })
    },

    deleteCategoriaCopo: (id) => {
      // Verificar se há copos usando esta categoria
      const coposDaCategoria = state.copos.filter(c => c.categoriaId === id)
      if (coposDaCategoria.length > 0) {
        throw new Error(`Não é possível excluir a categoria. ${coposDaCategoria.length} copo(s) ainda está(ão) usando esta categoria.`)
      }
      dispatch({ type: 'DELETE_CATEGORIA_COPO', payload: id })
    },

    // Categorias de Receita
    addCategoriaReceita: (categoria) => {
      const cor = generateCategoryColor()
      const newCategoria: CategoriaReceita = {
        id: Date.now().toString(),
        ...categoria,
        cor,
        dataCriacao: new Date()
      }
      dispatch({ type: 'ADD_CATEGORIA_RECEITA', payload: newCategoria })
    },

    updateCategoriaReceita: (id, data) => {
      dispatch({ type: 'UPDATE_CATEGORIA_RECEITA', payload: { id, data } })
    },

    deleteCategoriaReceita: (id) => {
      // Verificar se há receitas usando esta categoria
      const receitasDaCategoria = state.receitas.filter(r => r.categoriaId === id)
      if (receitasDaCategoria.length > 0) {
        throw new Error(`Não é possível excluir a categoria. ${receitasDaCategoria.length} receita(s) ainda está(ão) usando esta categoria.`)
      }
      dispatch({ type: 'DELETE_CATEGORIA_RECEITA', payload: id })
    },

    // Copos
    addCopo: (copo) => {
      const custoDetalhado = calcularCustoDetalheCopo(copo)
      const newCopo: Copo = {
        id: Date.now().toString(),
        ...copo,
        custoTotal: custoDetalhado.custoTotal,
        custoInsumos: custoDetalhado.custoInsumos,
        custoEmbalagens: custoDetalhado.custoEmbalagens,
        dataCriacao: new Date(),
        dataAtualizacao: new Date()
      }
      dispatch({ type: 'ADD_COPO', payload: newCopo })
    },

    updateCopo: (id, data) => {
      let updatedData = { ...data, dataAtualizacao: new Date() }
      
      // Recalcular custos se dados relevantes mudaram
      if (data.insumos !== undefined || data.embalagens !== undefined) {
        const copo = state.copos.find(c => c.id === id)
        if (copo) {
          const mergedCopo = { ...copo, ...data }
          const custoDetalhado = calcularCustoDetalheCopo(mergedCopo)
          updatedData = {
            ...updatedData,
            custoTotal: custoDetalhado.custoTotal,
            custoInsumos: custoDetalhado.custoInsumos,
            custoEmbalagens: custoDetalhado.custoEmbalagens
          }
        }
      }
      
      dispatch({ type: 'UPDATE_COPO', payload: { id, data: updatedData } })
    },

    deleteCopo: (id) => {
      dispatch({ type: 'DELETE_COPO', payload: id })
    },

    calcularCustoDetalheCopo: (copo: Partial<Copo>): CustoDetalhoCopo => {
      return calcularCustoDetalheCopo(copo)
    },

    duplicarCopo: (id: string) => {
      const copoOriginal = state.copos.find(c => c.id === id)
      if (copoOriginal) {
        const copoNome = `${copoOriginal.nome} - Cópia`
        const custoDetalhado = calcularCustoDetalheCopo(copoOriginal)
        const now = new Date()
        const newCopo: Copo = {
          ...copoOriginal,
          id: Date.now().toString(),
          nome: copoNome,
          custoTotal: custoDetalhado.custoTotal,
          custoInsumos: custoDetalhado.custoInsumos,
          custoEmbalagens: custoDetalhado.custoEmbalagens,
          dataCriacao: now,
          dataAtualizacao: now
        }
        dispatch({ type: 'ADD_COPO', payload: newCopo })
        return newCopo.id
      }
      return null
    },

    // Preços de Insumo por Fornecedor
    addPrecoInsumoFornecedor: (preco) => {
      // Se este preço está sendo marcado como padrão, desmarcar outros do mesmo insumo
      if (preco.padrao) {
        state.precosInsumoFornecedor
          .filter(p => p.insumoId === preco.insumoId && p.padrao)
          .forEach(p => {
            dispatch({ 
              type: 'UPDATE_PRECO_INSUMO_FORNECEDOR', 
              payload: { id: p.id, data: { padrao: false } } 
            })
          })
      }

      const novoPreco: PrecoInsumoFornecedor = {
        id: Date.now().toString(),
        ...preco,
        dataAtualizacao: new Date()
      }
      dispatch({ type: 'ADD_PRECO_INSUMO_FORNECEDOR', payload: novoPreco })
    },

    updatePrecoInsumoFornecedor: (id, data) => {
      // Se está marcando como padrão, desmarcar outros do mesmo insumo
      if (data.padrao) {
        const precoAtual = state.precosInsumoFornecedor.find(p => p.id === id)
        if (precoAtual) {
          state.precosInsumoFornecedor
            .filter(p => p.insumoId === precoAtual.insumoId && p.id !== id && p.padrao)
            .forEach(p => {
              dispatch({ 
                type: 'UPDATE_PRECO_INSUMO_FORNECEDOR', 
                payload: { id: p.id, data: { padrao: false } } 
              })
            })
        }
      }

      const updatedData = { ...data, dataAtualizacao: new Date() }
      dispatch({ type: 'UPDATE_PRECO_INSUMO_FORNECEDOR', payload: { id, data: updatedData } })
    },

    deletePrecoInsumoFornecedor: (id) => {
      dispatch({ type: 'DELETE_PRECO_INSUMO_FORNECEDOR', payload: id })
    },

    setFornecedorPadrao: (insumoId, fornecedorId) => {
      // Desmarcar todos os fornecedores como padrão para este insumo
      state.precosInsumoFornecedor
        .filter(p => p.insumoId === insumoId && p.padrao)
        .forEach(p => {
          dispatch({ 
            type: 'UPDATE_PRECO_INSUMO_FORNECEDOR', 
            payload: { id: p.id, data: { padrao: false } } 
          })
        })

      // Marcar o fornecedor selecionado como padrão
      const precoFornecedor = state.precosInsumoFornecedor.find(
        p => p.insumoId === insumoId && p.fornecedorId === fornecedorId && p.ativo
      )
      if (precoFornecedor) {
        dispatch({ 
          type: 'UPDATE_PRECO_INSUMO_FORNECEDOR', 
          payload: { id: precoFornecedor.id, data: { padrao: true } } 
        })
      }
    },

// Cardápio
    addItemCardapio: (item) => {
      const custo = calcularCustoItemCardapio(item)
      const { markup, percentualMargem } = calcularMarkupMargem(custo, item.precoVenda)
      const now = new Date()
      const newItem: ItemCardapio = {
        id: Date.now().toString(),
        ...item,
        custo,
        markup,
        percentualMargem,
        dataCriacao: now,
        dataAtualizacao: now
      }
      dispatch({ type: 'ADD_ITEM_CARDAPIO', payload: newItem })
    },

    updateItemCardapio: (id, data) => {
      const updatedData = { ...data, dataAtualizacao: new Date() }
      
      const item = state.cardapio.find(i => i.id === id)
      if (item) {
        // Recalcular custo se os dados de composição mudaram
        const mergedItem = { ...item, ...data }
        const custo = calcularCustoItemCardapio(mergedItem)
        const precoVenda = data.precoVenda ?? item.precoVenda
        const { markup, percentualMargem } = calcularMarkupMargem(custo, precoVenda)
        
        updatedData.custo = custo
        updatedData.markup = markup
        updatedData.percentualMargem = percentualMargem
      }
      
      dispatch({ type: 'UPDATE_ITEM_CARDAPIO', payload: { id, data: updatedData } })
    },

    deleteItemCardapio: (id) => {
      dispatch({ type: 'DELETE_ITEM_CARDAPIO', payload: id })
    },

    // Receitas
    addReceita: (receita) => {
      const { custoTotal, custoPorGrama } = calcularCustoReceita(receita.ingredientes, receita.rendimento)
      const now = new Date()
      const newReceita: Receita = {
        id: Date.now().toString(),
        ...receita,
        custoTotal,
        custoPorGrama,
        dataCriacao: now,
        dataAtualizacao: now
      }
      dispatch({ type: 'ADD_RECEITA', payload: newReceita })
    },

    updateReceita: (id, data) => {
      const updatedData = { ...data, dataAtualizacao: new Date() }
      
      // Recalcular custos se ingredientes ou rendimento mudaram
      if (data.ingredientes !== undefined || data.rendimento !== undefined) {
        const receita = state.receitas.find(r => r.id === id)
        if (receita) {
          const ingredientes = data.ingredientes ?? receita.ingredientes
          const rendimento = data.rendimento ?? receita.rendimento
          const { custoTotal, custoPorGrama } = calcularCustoReceita(ingredientes, rendimento)
          updatedData.custoTotal = custoTotal
          updatedData.custoPorGrama = custoPorGrama
        }
      }
      
      dispatch({ type: 'UPDATE_RECEITA', payload: { id, data: updatedData } })
    },

    deleteReceita: (id) => {
      dispatch({ type: 'DELETE_RECEITA', payload: id })
    },

    calcularCustoReceitaDetalhado: (ingredientes: ItemReceita[], rendimento: number): CustoDetalhadoReceita => {
      return calcularCustoReceitaDetalhado(ingredientes, rendimento)
    },

    duplicarReceita: (id: string) => {
      const receitaOriginal = state.receitas.find(r => r.id === id)
      if (receitaOriginal) {
        const receitaNome = `${receitaOriginal.nome} - Cópia`
        const { custoTotal, custoPorGrama } = calcularCustoReceita(receitaOriginal.ingredientes, receitaOriginal.rendimento)
        const now = new Date()
        const newReceita: Receita = {
          ...receitaOriginal,
          id: Date.now().toString(),
          nome: receitaNome,
          custoTotal,
          custoPorGrama,
          dataCriacao: now,
          dataAtualizacao: now
        }
        dispatch({ type: 'ADD_RECEITA', payload: newReceita })
        return newReceita.id
      }
      return null
    },

    escalarReceita: (id: string, fator: number) => {
      const receitaOriginal = state.receitas.find(r => r.id === id)
      if (receitaOriginal && fator > 0) {
        const ingredientesEscalados = receitaOriginal.ingredientes.map(ingrediente => ({
          ...ingrediente,
          quantidade: ingrediente.quantidade * fator
        }))
        const rendimentoEscalado = receitaOriginal.rendimento * fator
        const { custoTotal, custoPorGrama } = calcularCustoReceita(ingredientesEscalados, rendimentoEscalado)
        
        const receitaNome = `${receitaOriginal.nome} (${fator}x)`
        const now = new Date()
        const newReceita: Receita = {
          ...receitaOriginal,
          id: Date.now().toString(),
          nome: receitaNome,
          ingredientes: ingredientesEscalados,
          rendimento: rendimentoEscalado,
          custoTotal,
          custoPorGrama,
          dataCriacao: now,
          dataAtualizacao: now
        }
        dispatch({ type: 'ADD_RECEITA', payload: newReceita })
        return newReceita.id
      }
      return null
    },

    // Fornecedores
    addFornecedor: (fornecedor) => {
      const now = new Date()
      const newFornecedor: Fornecedor = {
        id: Date.now().toString(),
        ...fornecedor,
        dataCriacao: now,
        dataAtualizacao: now
      }
      dispatch({ type: 'ADD_FORNECEDOR', payload: newFornecedor })
    },

    updateFornecedor: (id, data) => {
      const updatedData = { ...data, dataAtualizacao: new Date() }
      dispatch({ type: 'UPDATE_FORNECEDOR', payload: { id, data: updatedData } })
    },

    deleteFornecedor: (id) => {
      dispatch({ type: 'DELETE_FORNECEDOR', payload: id })
    },

    // Produtos de Fornecedores
    addProdutoFornecedor: (produto) => {
      const precoComDesconto = produto.precoUnitario * (1 - produto.percentualDesconto / 100)
      const newProduto: ProdutoFornecedor = {
        id: Date.now().toString(),
        ...produto,
        precoComDesconto,
        dataAtualizacao: new Date()
      }
      dispatch({ type: 'ADD_PRODUTO_FORNECEDOR', payload: newProduto })
    },

    updateProdutoFornecedor: (id, data) => {
      const updatedData = { ...data, dataAtualizacao: new Date() }
      
      // Recalcular preço com desconto se necessário
      if (data.precoUnitario !== undefined || data.percentualDesconto !== undefined) {
        const produto = state.produtosFornecedores.find(p => p.id === id)
        if (produto) {
          const precoUnitario = data.precoUnitario ?? produto.precoUnitario
          const percentualDesconto = data.percentualDesconto ?? produto.percentualDesconto
          updatedData.precoComDesconto = precoUnitario * (1 - percentualDesconto / 100)
        }
      }
      
      dispatch({ type: 'UPDATE_PRODUTO_FORNECEDOR', payload: { id, data: updatedData } })
    },

    deleteProdutoFornecedor: (id) => {
      dispatch({ type: 'DELETE_PRODUTO_FORNECEDOR', payload: id })
    },

    // Comparações de Fornecedores
    obterComparacaoPrecos: (insumoId: string): ComparacaoFornecedor | null => {
      const insumo = state.insumos.find(i => i.id === insumoId)
      if (!insumo) return null

      const produtosFornecedores = state.produtosFornecedores.filter(
        p => p.insumoId === insumoId && p.ativo
      )

      if (produtosFornecedores.length === 0) return null

      const fornecedoresInfo = produtosFornecedores.map(produto => {
        const fornecedor = state.fornecedores.find(f => f.id === produto.fornecedorId)
        return {
          fornecedorId: produto.fornecedorId,
          fornecedorNome: fornecedor?.nome || 'Desconhecido',
          preco: produto.precoUnitario,
          precoComDesconto: produto.precoComDesconto,
          desconto: produto.percentualDesconto,
          tempoEntrega: produto.tempoEntregaDias,
          ativo: produto.ativo && (fornecedor?.ativo ?? false)
        }
      }).filter(f => f.ativo)

      if (fornecedoresInfo.length === 0) return null

      const melhorFornecedor = fornecedoresInfo.reduce((prev, current) => 
        current.precoComDesconto < prev.precoComDesconto ? current : prev
      )

      const precoAtual = insumo.precoReal / insumo.quantidadeComprada // preço por grama atual
      const melhorPrecoGrama = melhorFornecedor.precoComDesconto // assumindo que já está em preço por grama
      const economia = Math.max(0, precoAtual - melhorPrecoGrama)
      const economiaPercentual = precoAtual > 0 ? (economia / precoAtual) * 100 : 0

      return {
        insumoId,
        insumoNome: insumo.nome,
        fornecedores: fornecedoresInfo,
        melhorPreco: {
          fornecedorId: melhorFornecedor.fornecedorId,
          preco: melhorFornecedor.precoComDesconto,
          economia,
          economiaPercentual
        }
      }
    },

    aplicarMelhorPreco: (insumoId: string, fornecedorId: string) => {
      const produto = state.produtosFornecedores.find(
        p => p.insumoId === insumoId && p.fornecedorId === fornecedorId && p.ativo
      )
      
      if (produto) {
        // Atualizar o preço do insumo com base no melhor fornecedor
        dispatch({ 
          type: 'UPDATE_INSUMO', 
          payload: { 
            id: insumoId, 
            data: { 
              precoReal: produto.precoComDesconto * state.insumos.find(i => i.id === insumoId)!.quantidadeComprada,
              precoComDesconto: produto.precoComDesconto * state.insumos.find(i => i.id === insumoId)!.quantidadeComprada
            } 
          } 
        })
      }
    },

    calcularEconomiaTotal: (): number => {
      return state.insumos.reduce((total, insumo) => {
        const produtosFornecedores = state.produtosFornecedores.filter(
          p => p.insumoId === insumo.id && p.ativo
        )
        
        if (produtosFornecedores.length === 0) return total

        const fornecedoresInfo = produtosFornecedores.map(produto => {
          const fornecedor = state.fornecedores.find(f => f.id === produto.fornecedorId)
          return {
            precoComDesconto: produto.precoComDesconto,
            ativo: produto.ativo && (fornecedor?.ativo ?? false)
          }
        }).filter(f => f.ativo)

        if (fornecedoresInfo.length === 0) return total

        const melhorPreco = Math.min(...fornecedoresInfo.map(f => f.precoComDesconto))
        const precoAtual = insumo.precoReal / insumo.quantidadeComprada
        const economia = Math.max(0, precoAtual - melhorPreco)
        
        return total + economia
      }, 0)
    },

    // Novas funções de análise para o Dashboard
    calcularMargemMedia: (): number => {
      const itensAtivos = state.cardapio.filter(item => item.ativo)
      if (itensAtivos.length === 0) return 0
      return itensAtivos.reduce((acc, item) => acc + item.percentualMargem, 0) / itensAtivos.length
    },

    getProdutosCriticos: (margemMinima: number = 30): typeof state.cardapio => {
      return state.cardapio.filter(item => item.ativo && item.percentualMargem < margemMinima)
    },

    getProdutosOportunidade: (margemMinima: number = 70): typeof state.cardapio => {
      return state.cardapio.filter(item => item.ativo && item.percentualMargem > margemMinima)
    },

    getTop5MaioresMargens: (): typeof state.cardapio => {
      return [...state.cardapio]
        .filter(item => item.ativo)
        .sort((a, b) => b.percentualMargem - a.percentualMargem)
        .slice(0, 5)
    },

    getTop5MenoresMargens: (): typeof state.cardapio => {
      return [...state.cardapio]
        .filter(item => item.ativo)
        .sort((a, b) => a.percentualMargem - b.percentualMargem)
        .slice(0, 5)
    },

    getMatrizLucratividade: () => {
      const itensAtivos = state.cardapio.filter(item => item.ativo)
      return {
        estrelas: itensAtivos.filter(item => item.percentualMargem >= 50 && item.precoVenda <= 30),
        premium: itensAtivos.filter(item => item.percentualMargem >= 50 && item.precoVenda > 30),
        revisar: itensAtivos.filter(item => item.percentualMargem < 30 && item.precoVenda <= 30),
        otimizar: itensAtivos.filter(item => item.percentualMargem < 30 && item.precoVenda > 30)
      }
    },

    getVariacaoCustos: (dias: number = 30) => {
      // Simulação de variação de custos baseada em dados atuais
      const agora = new Date()
      const dataLimite = new Date(agora.getTime() - dias * 24 * 60 * 60 * 1000)
      
      const insumosComVariacao = state.insumos.filter(insumo => insumo.ativo).map(insumo => {
        // Simular variação aleatória para demonstração
        const variacao = (Math.random() - 0.5) * 20 // Variação de -10% a +10%
        const precoAnterior = insumo.precoPorGrama * (1 - variacao / 100)
        
        return {
          insumoId: insumo.id,
          nome: insumo.nome,
          precoAtual: insumo.precoPorGrama,
          precoAnterior,
          variacao: ((insumo.precoPorGrama - precoAnterior) / precoAnterior) * 100,
          impacto: state.cardapio.filter(item => 
            item.composicao?.some(comp => comp.id === insumo.id)
          ).length
        }
      }).filter(item => Math.abs(item.variacao) > 5) // Apenas variações significativas
      
      return insumosComVariacao
    },

    getInsumosCaros: (limitePreco: number = 0.5): typeof state.insumos => {
      return state.insumos.filter(insumo => 
        insumo.ativo && insumo.precoPorGrama > limitePreco
      )
    },

    calcularImpactoMudancaInsumo: (insumoId: string, novoPreco: number) => {
      const insumo = state.insumos.find(i => i.id === insumoId)
      if (!insumo) return { produtosAfetados: [], impactoTotal: 0 }
      
      const diferencaPreco = novoPreco - insumo.precoPorGrama
      const produtosAfetados = state.cardapio.filter(item => 
        item.composicao?.some(comp => comp.id === insumoId)
      ).map(item => {
        const composicaoInsumo = item.composicao?.find(comp => comp.id === insumoId)
        const impactoCusto = composicaoInsumo ? composicaoInsumo.quantidade * diferencaPreco : 0
        const novoMarkup = item.markup - impactoCusto
        const novaMargem = item.custo > 0 ? ((item.precoVenda - (item.custo + impactoCusto)) / (item.custo + impactoCusto)) * 100 : 0
        
        return {
          itemId: item.id,
          nome: item.nome,
          custoAtual: item.custo,
          novoCusto: item.custo + impactoCusto,
          impactoCusto,
          margemAtual: item.percentualMargem,
          novaMargem,
          impactoMargem: novaMargem - item.percentualMargem
        }
      })
      
      const impactoTotal = produtosAfetados.reduce((total, produto) => total + produto.impactoCusto, 0)
      
      return { produtosAfetados, impactoTotal }
    },

    // Copos Padronizados
    addCopoPadrao: (copo) => {
      // Calcular custos inline para evitar referência circular
      const custoEmbalagem = (copo.embalagens || []).reduce((total, embalagemId) => {
        const embalagem = state.embalagens.find(e => e.id === embalagemId)
        return total + (embalagem?.precoUnitarioCalculado || embalagem?.precoUnitario || 0)
      }, 0)

      let custoAcai = 0
      if (copo.tipoAcai && copo.porcaoGramas) {
        const tipoAcaiMap: Record<string, string> = {
          'tradicional': 'acai',
          'zero': 'acai',
          'cupuacu': 'acai'
        }
        
        const insumoAcai = state.insumos.find(i => 
          i.tipo === tipoAcaiMap[copo.tipoAcai as string] && i.ativo
        )
        
        if (insumoAcai) {
          custoAcai = copo.porcaoGramas * insumoAcai.precoPorGrama
        }
      }

      const custoTotal = custoEmbalagem + custoAcai
      const custos = { custoEmbalagem, custoAcai, custoTotal }
      const now = new Date()
      const newCopo: CopoPadrao = {
        id: Date.now().toString(),
        ...copo,
        ...custos,
        dataCriacao: now,
        dataAtualizacao: now
      }
      dispatch({ type: 'ADD_COPO_PADRAO', payload: newCopo })
      
      // Sincronizar automaticamente com cardápio
      setTimeout(() => {
        contextValue.sincronizarCopoComCardapio(newCopo.id)
      }, 0)
    },

    updateCopoPadrao: (id, data) => {
      const updatedData = { ...data, dataAtualizacao: new Date() }
      
      // Recalcular custos se dados relevantes mudaram
      if (data.embalagens !== undefined || data.tipoAcai !== undefined || data.porcaoGramas !== undefined) {
        const copo = state.coposPadrao.find(c => c.id === id)
        if (copo) {
          const mergedCopo = { ...copo, ...data }
          
          // Recalcular custos inline
          const custoEmbalagem = (mergedCopo.embalagens || []).reduce((total, embalagemId) => {
            const embalagem = state.embalagens.find(e => e.id === embalagemId)
            return total + (embalagem?.precoUnitarioCalculado || embalagem?.precoUnitario || 0)
          }, 0)

          let custoAcai = 0
          if (mergedCopo.tipoAcai && mergedCopo.porcaoGramas) {
            const tipoAcaiMap: Record<string, string> = {
              'tradicional': 'acai',
              'zero': 'acai',
              'cupuacu': 'acai'
            }
            
            const insumoAcai = state.insumos.find(i => 
              i.tipo === tipoAcaiMap[mergedCopo.tipoAcai as string] && i.ativo
            )
            
            if (insumoAcai) {
              custoAcai = mergedCopo.porcaoGramas * insumoAcai.precoPorGrama
            }
          }

          const custoTotal = custoEmbalagem + custoAcai
          Object.assign(updatedData, { custoEmbalagem, custoAcai, custoTotal })
        }
      }
      
      dispatch({ type: 'UPDATE_COPO_PADRAO', payload: { id, data: updatedData } })
      
      // Sincronizar automaticamente com cardápio
      setTimeout(() => {
        contextValue.atualizarItemCardapioFromCopo(id, updatedData)
      }, 0)
    },

    deleteCopoPadrao: (id) => {
      // Remover item correspondente do cardápio antes de excluir o copo
      contextValue.removerItemCardapioFromCopo(id)
      dispatch({ type: 'DELETE_COPO_PADRAO', payload: id })
    },

    calcularCustoCopo: (copo: Partial<CopoPadrao>) => {
      // Calcular custo das embalagens
      const custoEmbalagem = (copo.embalagens || []).reduce((total, embalagemId) => {
        const embalagem = state.embalagens.find(e => e.id === embalagemId)
        return total + (embalagem?.precoUnitarioCalculado || embalagem?.precoUnitario || 0)
      }, 0)

      // Calcular custo do açaí baseado no tipo e porção
      let custoAcai = 0
      if (copo.tipoAcai && copo.porcaoGramas) {
        const tipoAcaiMap: Record<string, string> = {
          'tradicional': 'acai',
          'zero': 'acai',
          'cupuacu': 'acai' // assumindo que cupuaçu usa mesmo insumo base
        }
        
        const insumoAcai = state.insumos.find(i => 
          i.tipo === tipoAcaiMap[copo.tipoAcai as string] && i.ativo
        )
        
        if (insumoAcai) {
          custoAcai = copo.porcaoGramas * insumoAcai.precoPorGrama
        }
      }

      const custoTotal = custoEmbalagem + custoAcai

      return {
        custoEmbalagem,
        custoAcai,
        custoTotal
      }
    },

    criarCoposPadrao: () => {
      // Obter templates inline
      const copo300 = state.embalagens.find(e => e.nome.includes('300ml'))?.id
      const copo400 = state.embalagens.find(e => e.nome.includes('400ml'))?.id
      const copo500 = state.embalagens.find(e => e.nome.includes('500ml'))?.id
      const tampa = state.embalagens.find(e => e.nome.toLowerCase().includes('tampa'))?.id
      const colher = state.embalagens.find(e => e.nome.toLowerCase().includes('colher'))?.id
      
      const embalagensPadraoBase = [tampa, colher].filter(Boolean) as string[]
      
      const templates = [
        {
          tamanho: '180ml' as const,
          porcaoGramas: 180,
          embalagensPadrao: [...embalagensPadraoBase],
          margemSugerida: 120
        },
        {
          tamanho: '300ml' as const,
          porcaoGramas: 230,
          embalagensPadrao: copo300 ? [copo300, ...embalagensPadraoBase] : embalagensPadraoBase,
          margemSugerida: 100
        },
        {
          tamanho: '400ml' as const,
          porcaoGramas: 300,
          embalagensPadrao: copo400 ? [copo400, ...embalagensPadraoBase] : embalagensPadraoBase,
          margemSugerida: 80
        },
        {
          tamanho: '500ml' as const,
          porcaoGramas: 400,
          embalagensPadrao: copo500 ? [copo500, ...embalagensPadraoBase] : embalagensPadraoBase,
          margemSugerida: 70
        }
      ]
      
      templates.forEach(template => {
        // Verificar se já existe um copo deste tamanho
        const copoExistente = state.coposPadrao.find(c => c.tamanho === template.tamanho)
        if (!copoExistente) {
          // Calcular custos inline
          const custoEmbalagem = template.embalagensPadrao.reduce((total, embalagemId) => {
            const embalagem = state.embalagens.find(e => e.id === embalagemId)
            return total + (embalagem?.precoUnitarioCalculado || embalagem?.precoUnitario || 0)
          }, 0)

          let custoAcai = 0
          const insumoAcai = state.insumos.find(i => i.tipo === 'acai' && i.ativo)
          if (insumoAcai) {
            custoAcai = template.porcaoGramas * insumoAcai.precoPorGrama
          }

          const custoTotal = custoEmbalagem + custoAcai
          const precoVenda = custoTotal * (1 + template.margemSugerida / 100)
          
          // Dispatch direto em vez de chamar função
          const now = new Date()
          const newCopo: CopoPadrao = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            tamanho: template.tamanho,
            porcaoGramas: template.porcaoGramas,
            precoBase: precoVenda,
            tipoAcai: 'tradicional',
            categoria: '100%_puro',
            embalagens: template.embalagensPadrao,
            custoEmbalagem,
            custoAcai,
            custoTotal,
            precoVenda,
            margem: template.margemSugerida,
            ativo: true,
            dataCriacao: now,
            dataAtualizacao: now
          }
          
          dispatch({ type: 'ADD_COPO_PADRAO', payload: newCopo })
        }
      })
    },

    obterTemplatesCopos: (): TemplateCopo[] => {
      // Buscar embalagens padrão (copo, tampa, colher)
      const copo300 = state.embalagens.find(e => e.nome.includes('300ml'))?.id
      const copo400 = state.embalagens.find(e => e.nome.includes('400ml'))?.id
      const copo500 = state.embalagens.find(e => e.nome.includes('500ml'))?.id
      const tampa = state.embalagens.find(e => e.nome.toLowerCase().includes('tampa'))?.id
      const colher = state.embalagens.find(e => e.nome.toLowerCase().includes('colher'))?.id
      
      const embalagensPadraoBase = [tampa, colher].filter(Boolean) as string[]
      
      return [
        {
          tamanho: '180ml',
          porcaoGramas: 180,
          embalagensPadrao: [...embalagensPadraoBase], // Sem copo específico, usa o menor disponível
          margemSugerida: 120 // 120% para tamanho pequeno
        },
        {
          tamanho: '300ml',
          porcaoGramas: 230,
          embalagensPadrao: copo300 ? [copo300, ...embalagensPadraoBase] : embalagensPadraoBase,
          margemSugerida: 100 // 100% para tamanho médio
        },
        {
          tamanho: '400ml',
          porcaoGramas: 300,
          embalagensPadrao: copo400 ? [copo400, ...embalagensPadraoBase] : embalagensPadraoBase,
          margemSugerida: 80 // 80% para tamanho popular
        },
        {
          tamanho: '500ml',
          porcaoGramas: 400,
          embalagensPadrao: copo500 ? [copo500, ...embalagensPadraoBase] : embalagensPadraoBase,
          margemSugerida: 70 // 70% para tamanho família
        }
      ]
    },

    // Integração Receitas-Insumos
    syncReceitasAsInsumos: () => {
      // Remove insumos de receitas que não existem mais
      const receitasAtivas = state.receitas.filter(r => r.ativa)
      const insumosSemReceitas = state.insumos.filter(ins => 
        ins.tipo !== 'receita' || (ins.receitaId && receitasAtivas.find(r => r.id === ins.receitaId))
      )
      
      // Adiciona/atualiza insumos baseados em receitas ativas
      const novosInsumos = receitasAtivas.map(receita => {
        const insumoExistente = state.insumos.find(ins => ins.receitaId === receita.id)
        
        return {
          id: insumoExistente?.id || `receita-${receita.id}`,
          nome: receita.nome,
          tipo: 'receita' as const,
          quantidadeComprada: receita.rendimento,
          precoComDesconto: receita.custoTotal,
          precoReal: receita.custoTotal,
          precoPorGrama: receita.custoPorGrama,
          ativo: receita.ativa,
          receitaId: receita.id
        }
      })
      
      const todosInsumos = [...insumosSemReceitas, ...novosInsumos]
      dispatch({ type: 'LOAD_DATA', payload: { ...state, insumos: todosInsumos } })
    },

    // Calculadoras
    calcularPrecoPorGrama,
    calcularMarkupMargem,
    calcularCustoReceita,
    calcularCustoItemCardapio,

    // Novos métodos para integração aprimorada
    // Gestão de relacionamento Fornecedor-Produto
    buscarMelhorPreco: (produtoId, produtoTipo) => {
      const produtos = state.produtosFornecedores.filter(p => 
        p.produtoId === produtoId && 
        p.produtoTipo === produtoTipo && 
        p.ativo && 
        p.disponivel
      )
      
      if (produtos.length === 0) return null
      
      return produtos.reduce((melhor, atual) => 
        atual.precoComDesconto < melhor.precoComDesconto ? atual : melhor
      )
    },

    atualizarMelhorFornecedor: (produtoId, produtoTipo) => {
      const melhorProduto = contextValue.buscarMelhorPreco(produtoId, produtoTipo)
      
      if (melhorProduto) {
        if (produtoTipo === 'insumo') {
          const insumo = state.insumos.find(i => i.id === produtoId)
          if (insumo) {
            contextValue.updateInsumo(produtoId, {
              melhorFornecedor: melhorProduto.fornecedorId,
              precoAtual: melhorProduto.precoComDesconto
            })
          }
        } else if (produtoTipo === 'embalagem') {
          const embalagem = state.embalagens.find(e => e.id === produtoId)
          if (embalagem) {
            contextValue.updateEmbalagem(produtoId, {
              melhorFornecedor: melhorProduto.fornecedorId,
              precoAtual: melhorProduto.precoComDesconto
            })
          }
        }
      }
    },

    sincronizarPrecosProdutos: () => {
      // Sincronizar preços de todos os insumos
      state.insumos.forEach(insumo => {
        contextValue.atualizarMelhorFornecedor(insumo.id, 'insumo')
      })
      
      // Sincronizar preços de todas as embalagens
      state.embalagens.forEach(embalagem => {
        contextValue.atualizarMelhorFornecedor(embalagem.id, 'embalagem')
      })
    },

    // Sincronização Copos-Cardápio
    criarItemCardapioFromCopo: (copo) => {
      const itemCardapio: ItemCardapio = {
        id: `cardapio_${copo.id}`,
        nome: `${copo.tamanho} - ${copo.tipoAcai}`,
        tipo: 'copo',
        categoria: 'copos',
        copoId: copo.id,
        custo: copo.custoTotal,
        precoVenda: copo.precoVenda,
        markup: copo.precoVenda - copo.custoTotal,
        percentualMargem: copo.margem,
        ativo: copo.ativo,
        sincronizadoComCopo: true,
        autoSync: true,
        observacoes: `Sincronizado automaticamente com copo ${copo.tamanho}`,
        dataCriacao: new Date(),
        dataAtualizacao: new Date()
      }
      return itemCardapio
    },

    sincronizarCopoComCardapio: (copoId) => {
      const copo = state.coposPadrao.find(c => c.id === copoId)
      if (!copo) return

      const itemExistente = state.cardapio.find(item => 
        item.sincronizadoComCopo && item.copoId === copoId
      )

      if (itemExistente) {
        // Atualizar item existente
        contextValue.atualizarItemCardapioFromCopo(copoId, copo)
      } else {
        // Criar novo item
        const novoItem = contextValue.criarItemCardapioFromCopo(copo)
        dispatch({ type: 'ADD_ITEM_CARDAPIO', payload: novoItem })
      }
    },

    atualizarItemCardapioFromCopo: (copoId, dadosCopo) => {
      const copo = state.coposPadrao.find(c => c.id === copoId)
      if (!copo) return

      const itemCardapio = state.cardapio.find(item => 
        item.sincronizadoComCopo && item.copoId === copoId
      )

      if (itemCardapio && itemCardapio.autoSync) {
        const dadosAtualizados = {
          nome: `${copo.tamanho} - ${copo.tipoAcai}`,
          custo: copo.custoTotal,
          precoVenda: copo.precoVenda,
          markup: copo.precoVenda - copo.custoTotal,
          percentualMargem: copo.margem,
          ativo: copo.ativo,
          dataAtualizacao: new Date(),
          ...dadosCopo
        }
        
        dispatch({ 
          type: 'UPDATE_ITEM_CARDAPIO', 
          payload: { id: itemCardapio.id, data: dadosAtualizados }
        })
      }
    },

    removerItemCardapioFromCopo: (copoId) => {
      const itemCardapio = state.cardapio.find(item => 
        item.sincronizadoComCopo && item.copoId === copoId
      )

      if (itemCardapio) {
        dispatch({ type: 'DELETE_ITEM_CARDAPIO', payload: itemCardapio.id })
      }
    }
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}