/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Cores do Design System
      colors: {
        primary: {
          50: '#F3E8FF',
          100: '#E9D5FF', 
          200: '#D8B4FE',
          300: '#C084FC',
          400: '#A855F7',
          500: '#9333EA',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065'
        },
        'tropical-mint': {
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
        'tropical-orange': {
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
        'tropical-pink': {
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
        },
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
        },
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
      
      // Tipografia
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace']
      },
      
      // Animações customizadas
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-in-out',
        'scale-in': 'scaleIn 0.15s ease-in-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'gradient-y': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center bottom'
          },
        },
      },
      
      // Backgrounds com gradientes
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'primary-gradient': 'linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)',
        'tropical-gradient': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        'sunset-gradient': 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
        'danger-gradient': 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
        'primary-subtle': 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)',
        'gray-subtle': 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
      },
      
      // Backdrop blur
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
      },
      
      // Transition timing
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
      },
      
      // Z-index scale
      zIndex: {
        '1': '1',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      
      // Aspect ratios
      aspectRatio: {
        'card': '4 / 3',
        'wide': '16 / 9',
        'ultra-wide': '21 / 9',
      },
    },
  },
  plugins: [
    // Plugin para variáveis CSS customizadas
    function({ addUtilities }) {
      const newUtilities = {
        '.glassmorphism': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glassmorphism-dark': {
          'background': 'rgba(0, 0, 0, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.text-gradient': {
          'background': 'linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)',
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        '.text-gradient-tropical': {
          'background': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        '.hover-lift': {
          'transition': 'all 0.2s ease-in-out',
          '&:hover': {
            'transform': 'translateY(-2px)',
            'box-shadow': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
        },
        '.focus-ring': {
          '&:focus': {
            'outline': 'none',
            'ring': '2px',
            'ring-color': '#9333EA',
            'ring-offset': '2px',
          },
        },
      }
      addUtilities(newUtilities)
    },
  ],
}