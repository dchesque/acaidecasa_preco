# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an açaí delivery pricing system built with Next.js 15, React 19, and TypeScript. The application helps açaí shop owners calculate costs, set prices, and manage their product catalog by tracking ingredients (insumos), packaging (embalagens), and final products.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### State Management
The application uses React Context with useReducer for global state management:
- **AppContext** (`src/contexts/AppContext.tsx`) - Central state provider managing embalagens, insumos, and produtos
- Data persistence via localStorage with automatic save/load
- Type-safe actions and reducers for CRUD operations

### Core Data Models
Located in `src/types/index.ts`:
- **Embalagem** - Packaging items (cups, lids, spoons) with unit prices
- **Insumo** - Ingredients with cost calculation based on purchase price and quantity
- **Produto** - Final products combining multiple embalagens and insumos with automated cost calculation
- **CustoDetalhado** - Detailed cost breakdown for pricing analysis

### Application Structure
- **Dashboard** (`src/app/page.tsx`) - Main overview with business metrics and product analysis
- **Management Pages** - CRUD interfaces for embalagens, insumos, and produtos
- **Calculator** - Real-time cost calculation tools
- **Reports** - Business analytics and export functionality using jsPDF

### Key Business Logic
- **Cost Calculation** - Automatic calculation of product costs based on ingredient quantities and packaging
- **Price per Gram** - Dynamic calculation for ingredients based on purchase data
- **Profit Margins** - Real-time profit and margin analysis
- **Sample Data** - Example data loading for new users (`src/data/exemplos.ts`)

### Navigation
Responsive sidebar navigation with active state management for different sections of the application.

## File Organization

```
src/
├── app/                 # Next.js 15 app router pages
│   ├── calculadora/     # Cost calculator
│   ├── embalagens/      # Packaging management
│   ├── insumos/         # Ingredients management
│   ├── produtos/        # Products management
│   └── relatorios/      # Reports and analytics
├── components/          # Reusable UI components
├── contexts/            # React Context providers
├── types/               # TypeScript type definitions
└── data/                # Sample data and utilities
```

## Styling

Uses Tailwind CSS v4 with Inter font. Responsive design with mobile-first approach and consistent color scheme for business applications.

## Key Dependencies

- **jspdf** + **jspdf-autotable** - PDF generation for reports
- **lucide-react** - Icon library
- **next** - React framework with app router
- **react** 19 + **react-dom** - UI library

## Development Notes

- All monetary values stored and calculated in Brazilian Real (R$)
- Portuguese language interface (pt-BR)
- Local storage used for data persistence
- TypeScript strict mode enabled with path aliases (@/*)