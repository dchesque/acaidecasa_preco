'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { 
  AppState, 
  AppContextType, 
  Embalagem, 
  Insumo, 
  Produto, 
  ItemCardapio,
  Receita,
  ItemReceita,
  CustoDetalhado 
} from '@/types'

// Estado inicial
const initialState: AppState = {
  embalagens: [],
  insumos: [],
  produtos: [],
  cardapio: [],
  receitas: []
}

// Actions
type Action = 
  | { type: 'LOAD_DATA'; payload: AppState }
  | { type: 'ADD_EMBALAGEM'; payload: Embalagem }
  | { type: 'UPDATE_EMBALAGEM'; payload: { id: string; data: Partial<Embalagem> } }
  | { type: 'DELETE_EMBALAGEM'; payload: string }
  | { type: 'ADD_INSUMO'; payload: Insumo }
  | { type: 'UPDATE_INSUMO'; payload: { id: string; data: Partial<Insumo> } }
  | { type: 'DELETE_INSUMO'; payload: string }
  | { type: 'ADD_PRODUTO'; payload: Produto }
  | { type: 'UPDATE_PRODUTO'; payload: { id: string; data: Partial<Produto> } }
  | { type: 'DELETE_PRODUTO'; payload: string }
  | { type: 'ADD_ITEM_CARDAPIO'; payload: ItemCardapio }
  | { type: 'UPDATE_ITEM_CARDAPIO'; payload: { id: string; data: Partial<ItemCardapio> } }
  | { type: 'DELETE_ITEM_CARDAPIO'; payload: string }
  | { type: 'ADD_RECEITA'; payload: Receita }
  | { type: 'UPDATE_RECEITA'; payload: { id: string; data: Partial<Receita> } }
  | { type: 'DELETE_RECEITA'; payload: string }

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
        insumos: state.insumos.filter(item => item.id !== action.payload)
      }
    
    case 'ADD_PRODUTO':
      return { ...state, produtos: [...state.produtos, action.payload] }
    
    case 'UPDATE_PRODUTO':
      return {
        ...state,
        produtos: state.produtos.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      }
    
    case 'DELETE_PRODUTO':
      return {
        ...state,
        produtos: state.produtos.filter(item => item.id !== action.payload)
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
      dispatch({ type: 'LOAD_DATA', payload: JSON.parse(savedData) })
    }
  }, [])

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem('acai-delivery-data', JSON.stringify(state))
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

  const calcularCustoProduto = (produto: Produto): CustoDetalhado => {
    // Calcular custo das embalagens
    const custoEmbalagens = produto.embalagens.reduce((total, embalagemId) => {
      const embalagem = state.embalagens.find(e => e.id === embalagemId)
      return total + (embalagem?.precoUnitario || 0)
    }, 0)

    // Calcular custo dos insumos
    const custoInsumos = produto.insumos.reduce((total, produtoInsumo) => {
      const insumo = state.insumos.find(i => i.id === produtoInsumo.insumoId)
      if (insumo) {
        return total + (produtoInsumo.quantidade * insumo.precoPorGrama)
      }
      return total
    }, 0)

    const custoTotal = custoEmbalagens + custoInsumos
    const precoVenda = produto.precoVenda
    const margem = produto.margem
    const lucro = precoVenda - custoTotal

    return {
      custoEmbalagens,
      custoInsumos,
      custoTotal,
      precoVenda,
      margem,
      lucro
    }
  }

  const calcularMarkupMargem = (custo: number, precoVenda: number) => {
    const markup = precoVenda - custo
    const percentualMargem = custo > 0 ? ((precoVenda - custo) / custo) * 100 : 0
    return { markup, percentualMargem }
  }

  const calcularCustoReceita = (ingredientes: ItemReceita[], rendimento: number) => {
    const custoTotal = ingredientes.reduce((total, item) => {
      const insumo = state.insumos.find(i => i.id === item.insumoId)
      if (insumo) {
        return total + (item.quantidade * insumo.precoPorGrama)
      }
      return total
    }, 0)

    const custoPorGrama = rendimento > 0 ? custoTotal / rendimento : 0
    
    return { custoTotal, custoPorGrama }
  }

  const calcularCustoItemCardapio = (item: Partial<ItemCardapio>): number => {
    switch (item.tipo) {
      case 'complemento':
        if (item.insumoId) {
          const insumo = state.insumos.find(i => i.id === item.insumoId)
          return insumo ? insumo.precoPorGrama * 50 : 0 // 50g padrão para complementos
        }
        return 0

      case 'receita':
        if (item.receitaId) {
          const receita = state.receitas.find(r => r.id === item.receitaId)
          return receita ? receita.custoPorGrama * 50 : 0 // 50g padrão para receitas
        }
        return 0

      case 'copo':
        if (item.produtoId) {
          const produto = state.produtos.find(p => p.id === item.produtoId)
          return produto ? produto.custoTotal : 0
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
              
              case 'produto':
                const produto = state.produtos.find(p => p.id === comp.produtoId)
                return total + (produto ? produto.custoTotal * comp.quantidade : 0)
              
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
      const newEmbalagem: Embalagem = {
        id: Date.now().toString(),
        ...embalagem
      }
      dispatch({ type: 'ADD_EMBALAGEM', payload: newEmbalagem })
    },

    updateEmbalagem: (id, data) => {
      dispatch({ type: 'UPDATE_EMBALAGEM', payload: { id, data } })
    },

    deleteEmbalagem: (id) => {
      dispatch({ type: 'DELETE_EMBALAGEM', payload: id })
    },

    // Insumos
    addInsumo: (insumo) => {
      const precoPorGrama = calcularPrecoPorGrama(insumo)
      const newInsumo: Insumo = {
        id: Date.now().toString(),
        ...insumo,
        precoPorGrama
      }
      dispatch({ type: 'ADD_INSUMO', payload: newInsumo })
    },

    updateInsumo: (id, data) => {
      let updatedData = { ...data }
      if (data.precoReal !== undefined || data.quantidadeComprada !== undefined) {
        const insumo = state.insumos.find(i => i.id === id)
        if (insumo) {
          const precoReal = data.precoReal ?? insumo.precoReal
          const quantidadeComprada = data.quantidadeComprada ?? insumo.quantidadeComprada
          updatedData.precoPorGrama = calcularPrecoPorGrama({ precoReal, quantidadeComprada })
        }
      }
      dispatch({ type: 'UPDATE_INSUMO', payload: { id, data: updatedData } })
    },

    deleteInsumo: (id) => {
      dispatch({ type: 'DELETE_INSUMO', payload: id })
    },

    // Produtos
    addProduto: (produto) => {
      const custoDetalhado = calcularCustoProduto({ ...produto, id: '', custoTotal: 0 } as Produto)
      const newProduto: Produto = {
        id: Date.now().toString(),
        ...produto,
        custoTotal: custoDetalhado.custoTotal
      }
      dispatch({ type: 'ADD_PRODUTO', payload: newProduto })
    },

    updateProduto: (id, data) => {
      dispatch({ type: 'UPDATE_PRODUTO', payload: { id, data } })
    },

    deleteProduto: (id) => {
      dispatch({ type: 'DELETE_PRODUTO', payload: id })
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
      let updatedData = { ...data, dataAtualizacao: new Date() }
      
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
      let updatedData = { ...data, dataAtualizacao: new Date() }
      
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
    calcularCustoProduto,
    calcularPrecoPorGrama,
    calcularMarkupMargem,
    calcularCustoReceita,
    calcularCustoItemCardapio
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