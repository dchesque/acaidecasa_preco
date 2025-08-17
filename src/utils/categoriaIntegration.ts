// Utilitários para integração com o sistema de categorias centralizado
import { 
  CATEGORIAS_GLOBAIS,
  TipoModulo,
  CategoriaModulo,
  getCategoriaStyle,
  validarCategoria 
} from '@/config/categorias'

// Mapeamento de categorias antigas para novas
export const CATEGORIA_MIGRATION_MAP = {
  // Mapeamento de Embalagens
  embalagens: {
    'Copo': 'Copos',
    'Tampa': 'Tampas', 
    'Colher': 'Colheres',
    'Canudo': 'Canudos',
    'Sacola': 'Sacolas',
    'Outros': 'Outros'
  },
  
  // Mapeamento de Insumos
  insumos: {
    'acai': 'Açaí',
    'chocolate': 'Chocolates',
    'fruta': 'Frutas',
    'complemento': 'Complementos',
    'materia_prima': 'Outros'
  },
  
  // Mapeamento de Cardápio
  cardapio: {
    'chocolates': 'Com Complementos',
    'mousses': 'Com Complementos', 
    'sorvetes': 'Com Complementos',
    'coberturas': 'Com Complementos',
    'cremes_premium': 'Especiais',
    'frutas': 'Com Complementos',
    'complementos': 'Com Complementos',
    'receitas': 'Especiais',
    'copos': '100% Puro',
    'combinados': 'Combos'
  }
} as const

// Função para migrar categoria antiga para nova
export function migrarCategoria<T extends TipoModulo>(
  modulo: T, 
  categoriaAntiga: string
): CategoriaModulo<T> | null {
  const mapeamento = CATEGORIA_MIGRATION_MAP[modulo as keyof typeof CATEGORIA_MIGRATION_MAP]
  
  if (mapeamento && categoriaAntiga in mapeamento) {
    const categoriaNova = mapeamento[categoriaAntiga as keyof typeof mapeamento]
    
    // Verificar se a categoria migrada existe no módulo
    if (validarCategoria(modulo, categoriaNova)) {
      return categoriaNova as CategoriaModulo<T>
    }
  }
  
  // Se não há mapeamento, tentar usar a categoria diretamente se válida
  if (validarCategoria(modulo, categoriaAntiga)) {
    return categoriaAntiga as CategoriaModulo<T>
  }
  
  return null
}

// Função para obter categoria padrão por módulo
export function getCategoriaDefault<T extends TipoModulo>(modulo: T): CategoriaModulo<T> {
  const defaults = {
    EMBALAGENS: 'Outros',
    INSUMOS: 'Outros', 
    RECEITAS: 'Tradicional',
    CARDAPIO: '100% Puro',
    COPOS: 'Médio'
  } as const
  
  return defaults[modulo] as CategoriaModulo<T>
}

// Função para validar e corrigir categoria
export function validarECorrigirCategoria<T extends TipoModulo>(
  modulo: T,
  categoria: string | undefined
): CategoriaModulo<T> {
  if (!categoria) {
    return getCategoriaDefault(modulo)
  }
  
  // Tentar migração primeiro
  const categoriaMigrada = migrarCategoria(modulo, categoria)
  if (categoriaMigrada) {
    return categoriaMigrada
  }
  
  // Se nada funcionar, usar padrão
  return getCategoriaDefault(modulo)
}

// Função para obter estatísticas de categorias
export function getEstatisticasCategorias<T extends TipoModulo>(
  modulo: T,
  items: Array<{ categoria?: string }>
) {
  const contadores = new Map<string, number>()
  const categorias = CATEGORIAS_GLOBAIS[modulo]
  
  // Inicializar contadores
  categorias.forEach(cat => contadores.set(cat, 0))
  
  // Contar itens por categoria
  items.forEach(item => {
    const categoria = validarECorrigirCategoria(modulo, item.categoria)
    contadores.set(categoria, (contadores.get(categoria) || 0) + 1)
  })
  
  return Array.from(contadores.entries()).map(([categoria, count]) => ({
    categoria: categoria as CategoriaModulo<T>,
    count,
    percentage: items.length > 0 ? (count / items.length) * 100 : 0,
    style: getCategoriaStyle(modulo, categoria as CategoriaModulo<T>)
  }))
}

// Hook para facilitar uso em componentes
export function useCategoriaIntegration<T extends TipoModulo>(modulo: T) {
  return {
    categorias: CATEGORIAS_GLOBAIS[modulo],
    migrarCategoria: (categoria: string) => migrarCategoria(modulo, categoria),
    validarCategoria: (categoria: string) => validarCategoria(modulo, categoria),
    getCategoriaDefault: () => getCategoriaDefault(modulo),
    validarECorrigir: (categoria: string | undefined) => validarECorrigirCategoria(modulo, categoria),
    getStyle: (categoria: CategoriaModulo<T>) => getCategoriaStyle(modulo, categoria),
    getEstatisticas: (items: Array<{ categoria?: string }>) => getEstatisticasCategorias(modulo, items)
  }
}

export default {
  migrarCategoria,
  getCategoriaDefault,
  validarECorrigirCategoria,
  getEstatisticasCategorias,
  useCategoriaIntegration
}