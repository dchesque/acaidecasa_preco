// Design System do Açaí Delivery
// Paleta de cores baseada na temática tropical/açaí

export const designSystem = {
  // CORES PRINCIPAIS
  colors: {
    // Paleta Principal - Roxo do Açaí
    primary: {
      50: '#F3E8FF',
      100: '#E9D5FF', 
      200: '#D8B4FE',
      300: '#C084FC',
      400: '#A855F7',
      500: '#9333EA', // Cor principal
      600: '#7C3AED',
      700: '#6D28D9',
      800: '#5B21B6',
      900: '#4C1D95',
      950: '#2E1065'
    },

    // Cores Tropicais Complementares
    tropical: {
      // Verde Menta
      mint: {
        50: '#ECFDF5',
        100: '#D1FAE5',
        200: '#A7F3D0',
        300: '#6EE7B7',
        400: '#34D399',
        500: '#10B981',
        600: '#059669',
        700: '#047857',
        800: '#065F46',
        900: '#064E3B'
      },
      // Laranja Tropical
      orange: {
        50: '#FFF7ED',
        100: '#FFEDD5',
        200: '#FED7AA',
        300: '#FDBA74',
        400: '#FB923C',
        500: '#F97316',
        600: '#EA580C',
        700: '#C2410C',
        800: '#9A3412',
        900: '#7C2D12'
      },
      // Rosa Pitaya
      pink: {
        50: '#FDF2F8',
        100: '#FCE7F3',
        200: '#FBCFE8',
        300: '#F9A8D4',
        400: '#F472B6',
        500: '#EC4899',
        600: '#DB2777',
        700: '#BE185D',
        800: '#9D174D',
        900: '#831843'
      }
    },

    // Cores de Status
    status: {
      success: {
        50: '#ECFDF5',
        100: '#D1FAE5',
        500: '#10B981',
        600: '#059669',
        700: '#047857'
      },
      warning: {
        50: '#FFFBEB',
        100: '#FEF3C7',
        500: '#F59E0B',
        600: '#D97706',
        700: '#B45309'
      },
      danger: {
        50: '#FEF2F2',
        100: '#FEE2E2',
        500: '#EF4444',
        600: '#DC2626',
        700: '#B91C1C'
      },
      info: {
        50: '#EFF6FF',
        100: '#DBEAFE',
        500: '#3B82F6',
        600: '#2563EB',
        700: '#1D4ED8'
      }
    },

    // Escala de Cinzas
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
      950: '#030712'
    }
  },

  // TIPOGRAFIA
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace']
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
      sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
      base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
      lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
      xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
      '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
      '5xl': ['3rem', { lineHeight: '1' }]          // 48px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800'
    }
  },

  // ESPAÇAMENTO
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
    '4xl': '6rem'   // 96px
  },

  // BORDER RADIUS
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
    '3xl': '3rem',    // 48px
    full: '9999px'
  },

  // SOMBRAS
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    // Sombras coloridas
    'primary': '0 4px 14px 0 rgb(147 51 234 / 0.25)',
    'success': '0 4px 14px 0 rgb(16 185 129 / 0.25)',
    'danger': '0 4px 14px 0 rgb(239 68 68 / 0.25)'
  },

  // GRADIENTES
  gradients: {
    primary: 'linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)',
    tropical: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    sunset: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
    danger: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
    // Gradientes sutis para backgrounds
    primarySubtle: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)',
    graySubtle: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)'
  },

  // TRANSIÇÕES
  transition: {
    fast: '150ms ease-in-out',
    normal: '200ms ease-in-out',
    slow: '300ms ease-in-out'
  },

  // BREAKPOINTS
  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
} as const

// Utilitários para uso em componentes
export const getColorValue = (colorPath: string) => {
  const keys = colorPath.split('.')
  let value: any = designSystem.colors
  
  for (const key of keys) {
    value = value[key]
    if (!value) return undefined
  }
  
  return value
}

// Função para gerar classes Tailwind dinamicamente
export const tw = {
  primary: (shade: number = 500) => `#${designSystem.colors.primary[shade as keyof typeof designSystem.colors.primary]}`,
  gray: (shade: number = 500) => `#${designSystem.colors.gray[shade as keyof typeof designSystem.colors.gray]}`,
  success: (shade: number = 500) => `#${designSystem.colors.status.success[shade as keyof typeof designSystem.colors.status.success]}`,
  warning: (shade: number = 500) => `#${designSystem.colors.status.warning[shade as keyof typeof designSystem.colors.status.warning]}`,
  danger: (shade: number = 500) => `#${designSystem.colors.status.danger[shade as keyof typeof designSystem.colors.status.danger]}`,
  info: (shade: number = 500) => `#${designSystem.colors.status.info[shade as keyof typeof designSystem.colors.status.info]}`
}

export default designSystem