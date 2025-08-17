// Sistema centralizado de categorias para todos os módulos
export const CATEGORIAS_GLOBAIS = {
  EMBALAGENS: ['Copos', 'Tampas', 'Colheres', 'Canudos', 'Sacolas', 'Outros'],
  INSUMOS: ['Açaí', 'Frutas', 'Complementos', 'Chocolates', 'Leites', 'Cremes', 'Granolas', 'Castanhas', 'Outros'],
  RECEITAS: ['Tradicional', 'Premium', 'Especial', 'Combos', 'Sazonal'],
  CARDAPIO: ['100% Puro', 'Com Complementos', 'Especiais', 'Promoções', 'Combos', 'Sazonal'],
  COPOS: ['Pequeno', 'Médio', 'Grande', 'Extra Grande', 'Promocional']
} as const

// Tipos para garantir type safety
export type CategoriaEmbalagem = typeof CATEGORIAS_GLOBAIS.EMBALAGENS[number]
export type CategoriaInsumo = typeof CATEGORIAS_GLOBAIS.INSUMOS[number]
export type CategoriaReceita = typeof CATEGORIAS_GLOBAIS.RECEITAS[number]
export type CategoriaCardapio = typeof CATEGORIAS_GLOBAIS.CARDAPIO[number]
export type CategoriaCopo = typeof CATEGORIAS_GLOBAIS.COPOS[number]

// Tipo genérico para categorias
export type TipoModulo = keyof typeof CATEGORIAS_GLOBAIS
export type CategoriaModulo<T extends TipoModulo> = typeof CATEGORIAS_GLOBAIS[T][number]

// Cores e ícones para categorias
export const CATEGORIA_STYLES = {
  EMBALAGENS: {
    'Copos': { color: 'bg-blue-100 text-blue-800', icon: '🥤' },
    'Tampas': { color: 'bg-gray-100 text-gray-800', icon: '🔒' },
    'Colheres': { color: 'bg-yellow-100 text-yellow-800', icon: '🥄' },
    'Canudos': { color: 'bg-green-100 text-green-800', icon: '🥤' },
    'Sacolas': { color: 'bg-brown-100 text-brown-800', icon: '🛍️' },
    'Outros': { color: 'bg-gray-100 text-gray-800', icon: '📦' }
  },
  INSUMOS: {
    'Açaí': { color: 'bg-purple-100 text-purple-800', icon: '🫐' },
    'Frutas': { color: 'bg-red-100 text-red-800', icon: '🍓' },
    'Complementos': { color: 'bg-orange-100 text-orange-800', icon: '🥜' },
    'Chocolates': { color: 'bg-amber-100 text-amber-800', icon: '🍫' },
    'Leites': { color: 'bg-blue-100 text-blue-800', icon: '🥛' },
    'Cremes': { color: 'bg-pink-100 text-pink-800', icon: '🍦' },
    'Granolas': { color: 'bg-yellow-100 text-yellow-800', icon: '🌾' },
    'Castanhas': { color: 'bg-green-100 text-green-800', icon: '🌰' },
    'Outros': { color: 'bg-gray-100 text-gray-800', icon: '🥪' }
  },
  RECEITAS: {
    'Tradicional': { color: 'bg-blue-100 text-blue-800', icon: '🏠' },
    'Premium': { color: 'bg-purple-100 text-purple-800', icon: '⭐' },
    'Especial': { color: 'bg-gold-100 text-gold-800', icon: '✨' },
    'Combos': { color: 'bg-green-100 text-green-800', icon: '🎯' },
    'Sazonal': { color: 'bg-orange-100 text-orange-800', icon: '🌸' }
  },
  CARDAPIO: {
    '100% Puro': { color: 'bg-purple-100 text-purple-800', icon: '💜' },
    'Com Complementos': { color: 'bg-blue-100 text-blue-800', icon: '🥜' },
    'Especiais': { color: 'bg-gold-100 text-gold-800', icon: '⭐' },
    'Promoções': { color: 'bg-red-100 text-red-800', icon: '🔥' },
    'Combos': { color: 'bg-green-100 text-green-800', icon: '🎯' },
    'Sazonal': { color: 'bg-orange-100 text-orange-800', icon: '🌸' }
  },
  COPOS: {
    'Pequeno': { color: 'bg-yellow-100 text-yellow-800', icon: '🥤' },
    'Médio': { color: 'bg-blue-100 text-blue-800', icon: '🥤' },
    'Grande': { color: 'bg-green-100 text-green-800', icon: '🥤' },
    'Extra Grande': { color: 'bg-purple-100 text-purple-800', icon: '🥤' },
    'Promocional': { color: 'bg-red-100 text-red-800', icon: '🔥' }
  }
} as const

// Utilitários para trabalhar com categorias
export const getCategoriaStyle = <T extends TipoModulo>(
  modulo: T,
  categoria: CategoriaModulo<T>
) => {
  const styles = CATEGORIA_STYLES[modulo] as Record<string, { color: string; icon: string }>
  return styles[categoria] || { color: 'bg-gray-100 text-gray-800', icon: '📦' }
}

export const validarCategoria = <T extends TipoModulo>(
  modulo: T,
  categoria: string
): categoria is CategoriaModulo<T> => {
  return CATEGORIAS_GLOBAIS[modulo].includes(categoria as any)
}

export const getCategoriasModulo = <T extends TipoModulo>(modulo: T) => {
  return CATEGORIAS_GLOBAIS[modulo]
}

// Funções auxiliares para compatibilidade com código existente
export const getEmbalagem = () => CATEGORIAS_GLOBAIS.EMBALAGENS
export const getInsumos = () => CATEGORIAS_GLOBAIS.INSUMOS
export const getReceitas = () => CATEGORIAS_GLOBAIS.RECEITAS
export const getCardapio = () => CATEGORIAS_GLOBAIS.CARDAPIO
export const getCopos = () => CATEGORIAS_GLOBAIS.COPOS