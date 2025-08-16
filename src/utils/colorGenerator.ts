// Gerador de cores para categorias de embalagem
// Gera cores em sequência usando HSL para distribuição uniforme

const COLOR_PALETTE = [
  '#3B82F6', // Azul
  '#10B981', // Verde esmeralda
  '#F59E0B', // Amarelo
  '#EF4444', // Vermelho
  '#8B5CF6', // Roxo
  '#EC4899', // Rosa
  '#06B6D4', // Ciano
  '#84CC16', // Verde lima
  '#F97316', // Laranja
  '#6366F1', // Índigo
  '#14B8A6', // Teal
  '#F472B6', // Rosa claro
  '#A855F7', // Violeta
  '#22C55E', // Verde
  '#EAB308', // Amarelo escuro
  '#DC2626', // Vermelho escuro
]

// Cache de cores já utilizadas para evitar repetições próximas
let usedColors: string[] = []
let colorIndex = 0

export function generateCategoryColor(): string {
  // Se ainda há cores disponíveis na paleta, use a próxima
  if (colorIndex < COLOR_PALETTE.length) {
    const color = COLOR_PALETTE[colorIndex]
    colorIndex++
    usedColors.push(color)
    return color
  }
  
  // Se todas as cores da paleta foram usadas, gere uma cor HSL aleatória
  const hue = Math.floor(Math.random() * 360)
  const saturation = 70 + Math.floor(Math.random() * 20) // 70-90%
  const lightness = 45 + Math.floor(Math.random() * 20) // 45-65%
  
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`
  usedColors.push(color)
  return color
}

export function resetColorGenerator(): void {
  usedColors = []
  colorIndex = 0
}

export function getUsedColors(): string[] {
  return [...usedColors]
}

// Função para verificar contraste entre cor e texto
export function getTextColor(backgroundColor: string): string {
  // Converte hex para RGB
  let r: number, g: number, b: number
  
  if (backgroundColor.startsWith('#')) {
    const hex = backgroundColor.replace('#', '')
    r = parseInt(hex.substr(0, 2), 16)
    g = parseInt(hex.substr(2, 2), 16)
    b = parseInt(hex.substr(4, 2), 16)
  } else if (backgroundColor.startsWith('hsl')) {
    // Para cores HSL, use uma heurística simples baseada na luminosidade
    const match = backgroundColor.match(/hsl\(\s*\d+\s*,\s*\d+%\s*,\s*(\d+)%\s*\)/)
    const lightness = match ? parseInt(match[1]) : 50
    return lightness > 50 ? '#000000' : '#FFFFFF'
  } else {
    // Default para cores não reconhecidas
    return '#000000'
  }
  
  // Calcula a luminância relativa
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  // Retorna cor do texto baseada no contraste
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

// Função para gerar uma versão mais clara da cor (para backgrounds)
export function getLighterColor(color: string, opacity: number = 0.1): string {
  if (color.startsWith('#')) {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }
  
  // Para cores HSL ou outras, retorna uma versão genérica
  return `${color}${Math.floor(opacity * 100).toString(16).padStart(2, '0')}`
}