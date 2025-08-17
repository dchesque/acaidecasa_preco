'use client'

import { useState, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import { formatCurrency } from '@/utils/formatters'
import { 
  FileText, 
  Table, 
  BarChart3, 
  BookOpen,
  Download,
  ZoomIn,
  ZoomOut,
  Save,
  Settings,
  Palette,
  Image,
  QrCode,
  Eye,
  Printer,
  Mail,
  Share
} from 'lucide-react'

export interface TemplateExportacao {
  id: string
  nome: string
  tipo: 'cardapio_cliente' | 'tabela_interna' | 'analise_custos' | 'relatorio_completo'
  formato: 'pdf' | 'excel' | 'json' | 'qrcode'
  configuracoes: ConfigExportacao
  dataCriacao: Date
}

export interface ConfigExportacao {
  incluirLogo: boolean
  incluirCustos: boolean
  incluirMargens: boolean
  incluirFotos: boolean
  incluirDescricoes: boolean
  incluirCategorias: boolean
  incluirQRCode: boolean
  estiloVisual: 'moderno' | 'classico' | 'minimalista' | 'colorido'
  ordenacao: 'categoria' | 'preco' | 'margem' | 'alfabetica'
  cores: {
    primaria: string
    secundaria: string
    texto: string
  }
}

interface DocumentPreviewProps {
  html: string
  zoom: number
}

function DocumentPreview({ html, zoom }: DocumentPreviewProps) {
  return (
    <div 
      className="bg-white border rounded-lg shadow-sm overflow-auto"
      style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function gerarHTMLCardapio(config: ConfigExportacao, cardapio: any[]) {
  const categorias = [...new Set(cardapio.map(item => item.categoria))]
  const itemsPorCategoria = categorias.reduce((acc, cat) => {
    acc[cat] = cardapio.filter(item => item.categoria === cat)
    return acc
  }, {} as Record<string, any[]>)

  // Ordenar itens por categoria
  Object.keys(itemsPorCategoria).forEach(categoria => {
    switch (config.ordenacao) {
      case 'preco':
        itemsPorCategoria[categoria].sort((a, b) => a.precoVenda - b.precoVenda)
        break
      case 'alfabetica':
        itemsPorCategoria[categoria].sort((a, b) => a.nome.localeCompare(b.nome))
        break
      case 'margem':
        itemsPorCategoria[categoria].sort((a, b) => b.percentualMargem - a.percentualMargem)
        break
    }
  })

  const estilos = {
    moderno: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      headerColor: 'white',
      cardBackground: 'rgba(255,255,255,0.95)',
      shadow: '0 8px 32px rgba(0,0,0,0.1)'
    },
    classico: {
      background: '#f8f9fa',
      headerColor: '#2c3e50',
      cardBackground: 'white',
      shadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    minimalista: {
      background: 'white',
      headerColor: '#333',
      cardBackground: '#fafafa',
      shadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    colorido: {
      background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
      headerColor: 'white',
      cardBackground: 'rgba(255,255,255,0.9)',
      shadow: '0 4px 16px rgba(0,0,0,0.15)'
    }
  }

  const estilo = estilos[config.estiloVisual]

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Cardápio</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 20px;
          background: ${estilo.background};
          color: #333;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: ${estilo.cardBackground};
          border-radius: 16px;
          box-shadow: ${estilo.shadow};
          overflow: hidden;
        }
        .header {
          text-align: center;
          padding: 40px 20px;
          background: ${config.cores?.primaria || estilo.headerColor};
          color: white;
        }
        .logo {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        .title {
          font-size: 36px;
          font-weight: bold;
          margin: 0;
        }
        .subtitle {
          font-size: 16px;
          opacity: 0.9;
          margin-top: 8px;
        }
        .categoria {
          padding: 30px 20px 0;
        }
        .categoria-titulo {
          font-size: 24px;
          font-weight: bold;
          color: ${config.cores?.primaria || '#6366f1'};
          border-bottom: 2px solid ${config.cores?.primaria || '#6366f1'};
          padding-bottom: 10px;
          margin-bottom: 20px;
          text-transform: uppercase;
        }
        .item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 15px 0;
          border-bottom: 1px solid #eee;
        }
        .item:last-child {
          border-bottom: none;
        }
        .item-info {
          flex: 1;
        }
        .item-nome {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 5px;
        }
        .item-descricao {
          font-size: 14px;
          color: #666;
          line-height: 1.4;
        }
        .item-preco {
          font-size: 20px;
          font-weight: bold;
          color: ${config.cores?.secundaria || '#059669'};
          white-space: nowrap;
          margin-left: 20px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          border-top: 1px solid #eee;
        }
        .qr-code {
          width: 100px;
          height: 100px;
          margin: 0 auto 10px;
          background: #ddd;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #666;
        }
        .footer-text {
          font-size: 14px;
          color: #666;
        }
        @media print {
          body { background: white; }
          .container { box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          ${config.incluirLogo ? '<div class="logo">🍧</div>' : ''}
          <h1 class="title">Cardápio</h1>
          <p class="subtitle">Açaí e Sobremesas Artesanais</p>
        </div>
        
        ${Object.entries(itemsPorCategoria).map(([categoria, itens]) => `
          <div class="categoria">
            <h2 class="categoria-titulo">${categoria.replace('_', ' ')}</h2>
            ${itens.map(item => `
              <div class="item">
                <div class="item-info">
                  <div class="item-nome">${item.nome}</div>
                  ${config.incluirDescricoes && item.observacoes ? `
                    <div class="item-descricao">${item.observacoes}</div>
                  ` : ''}
                </div>
                <div class="item-preco">${formatCurrency(item.precoVenda)}</div>
              </div>
            `).join('')}
          </div>
        `).join('')}
        
        ${config.incluirQRCode ? `
          <div class="footer">
            <div class="qr-code">QR Code</div>
            <div class="footer-text">
              Escaneie para fazer seu pedido online!
            </div>
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `
}

function gerarHTMLRelatorioCompleto(config: ConfigExportacao, cardapio: any[]) {
  const totalCusto = cardapio.reduce((acc, item) => acc + item.custo, 0)
  const totalVenda = cardapio.reduce((acc, item) => acc + item.precoVenda, 0)
  const margemMedia = cardapio.reduce((acc, item) => acc + item.percentualMargem, 0) / cardapio.length

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Relatório Completo - Análise de Precificação</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 20px;
          background: #f5f7fa;
          color: #333;
        }
        .container {
          max-width: 1000px;
          margin: 0 auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .title {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .subtitle {
          font-size: 16px;
          opacity: 0.9;
        }
        .metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          padding: 30px;
          background: #f8f9fa;
        }
        .metric {
          text-align: center;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .metric-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
        }
        .metric-value {
          font-size: 24px;
          font-weight: bold;
          color: #4f46e5;
        }
        .content {
          padding: 30px;
        }
        .section {
          margin-bottom: 40px;
        }
        .section-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #374151;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .table th {
          background: #f3f4f6;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #374151;
        }
        .table td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        .table tr:last-child td {
          border-bottom: none;
        }
        .status-ativo {
          color: #059669;
          font-weight: 600;
        }
        .status-inativo {
          color: #dc2626;
          font-weight: 600;
        }
        .margem-alta { color: #059669; }
        .margem-media { color: #d97706; }
        .margem-baixa { color: #dc2626; }
        @media print {
          body { background: white; }
          .container { box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="title">Relatório de Análise de Precificação</h1>
          <p class="subtitle">Análise completa do cardápio e performance de preços</p>
          <p style="margin-top: 20px; font-size: 14px; opacity: 0.8;">
            Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
          </p>
        </div>
        
        <div class="metrics">
          <div class="metric">
            <div class="metric-label">Total de Produtos</div>
            <div class="metric-value">${cardapio.length}</div>
          </div>
          <div class="metric">
            <div class="metric-label">Margem Média</div>
            <div class="metric-value">${margemMedia.toFixed(1)}%</div>
          </div>
          <div class="metric">
            <div class="metric-label">Receita Potencial</div>
            <div class="metric-value">${formatCurrency(totalVenda)}</div>
          </div>
        </div>
        
        <div class="content">
          <div class="section">
            <h2 class="section-title">Detalhamento por Produto</h2>
            <table class="table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Custo</th>
                  <th>Preço</th>
                  <th>Margem</th>
                  <th>Lucro</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${cardapio.map(item => `
                  <tr>
                    <td><strong>${item.nome}</strong></td>
                    <td>${item.categoria}</td>
                    <td>${config.incluirCustos ? formatCurrency(item.custo) : '-'}</td>
                    <td>${formatCurrency(item.precoVenda)}</td>
                    <td class="${item.percentualMargem >= 50 ? 'margem-alta' : item.percentualMargem >= 30 ? 'margem-media' : 'margem-baixa'}">
                      ${config.incluirMargens ? `${item.percentualMargem.toFixed(1)}%` : '-'}
                    </td>
                    <td>${config.incluirCustos ? formatCurrency(item.markup) : '-'}</td>
                    <td class="${item.ativo ? 'status-ativo' : 'status-inativo'}">
                      ${item.ativo ? 'Ativo' : 'Inativo'}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <h2 class="section-title">Análise por Categoria</h2>
            <p style="color: #666; margin-bottom: 20px;">
              Distribuição de produtos e performance por categoria
            </p>
            <!-- Aqui seria adicionado um gráfico ou tabela resumo por categoria -->
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

export default function ExportacaoProfissional() {
  const { cardapio } = useApp()
  const [tipoDocumento, setTipoDocumento] = useState<'cardapio_cliente' | 'tabela_interna' | 'analise_custos' | 'relatorio_completo'>('cardapio_cliente')
  const [formato, setFormato] = useState<'pdf' | 'excel' | 'json' | 'qrcode'>('pdf')
  const [config, setConfig] = useState<ConfigExportacao>({
    incluirLogo: true,
    incluirCustos: false,
    incluirMargens: false,
    incluirFotos: false,
    incluirDescricoes: true,
    incluirCategorias: true,
    incluirQRCode: true,
    estiloVisual: 'moderno',
    ordenacao: 'categoria',
    cores: {
      primaria: '#6366f1',
      secundaria: '#059669',
      texto: '#374151'
    }
  })
  const [preview, setPreview] = useState<string | null>(null)
  const [zoom, setZoom] = useState(0.8)
  const [templatesSalvos, setTemplatesSalvos] = useState<TemplateExportacao[]>([])

  const gerarPreview = () => {
    const produtosAtivos = cardapio.filter(p => p.ativo)
    
    let html = ''
    switch (tipoDocumento) {
      case 'cardapio_cliente':
        html = gerarHTMLCardapio(config, produtosAtivos)
        break
      case 'relatorio_completo':
        html = gerarHTMLRelatorioCompleto(config, produtosAtivos)
        break
      case 'tabela_interna':
        html = gerarHTMLRelatorioCompleto({...config, incluirCustos: true, incluirMargens: true}, produtosAtivos)
        break
      case 'analise_custos':
        html = gerarHTMLRelatorioCompleto({...config, incluirCustos: true, incluirMargens: true}, produtosAtivos)
        break
    }
    
    setPreview(html)
  }

  const exportar = async () => {
    if (!preview) {
      gerarPreview()
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Simular exportação
    const nomeArquivo = `cardapio_${tipoDocumento}_${new Date().toISOString().split('T')[0]}.${formato}`
    
    if (formato === 'pdf') {
      // Aqui seria integrado com jsPDF ou similar
      alert(`PDF "${nomeArquivo}" seria gerado e baixado`)
    } else if (formato === 'excel') {
      // Aqui seria integrado com SheetJS ou similar
      alert(`Excel "${nomeArquivo}" seria gerado e baixado`)
    } else if (formato === 'json') {
      // Export como JSON
      const dados = {
        metadata: {
          tipo: tipoDocumento,
          dataExportacao: new Date().toISOString(),
          configuracoes: config
        },
        cardapio: cardapio.filter(p => p.ativo)
      }
      
      const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = nomeArquivo
      link.click()
      URL.revokeObjectURL(url)
    } else if (formato === 'qrcode') {
      alert('QR Code seria gerado com link para cardápio online')
    }
  }

  const salvarTemplate = () => {
    const nome = prompt('Nome do template:')
    if (!nome) return

    const template: TemplateExportacao = {
      id: Date.now().toString(),
      nome,
      tipo: tipoDocumento,
      formato,
      configuracoes: config,
      dataCriacao: new Date()
    }

    setTemplatesSalvos([...templatesSalvos, template])
  }

  const carregarTemplate = (template: TemplateExportacao) => {
    setTipoDocumento(template.tipo)
    setFormato(template.formato)
    setConfig(template.configuracoes)
    setPreview(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Download className="h-6 w-6 text-purple-600" />
            Exportação Profissional
          </h2>
          <p className="text-gray-600 mt-1">
            Crie documentos profissionais do seu cardápio
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Configurações */}
        <div className="col-span-4 space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              Configurar Exportação
            </h3>
            
            {/* Tipo de Documento */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-3">
                Tipo de Documento
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setTipoDocumento('cardapio_cliente')}
                  className={`p-3 border rounded-lg text-sm transition-colors ${
                    tipoDocumento === 'cardapio_cliente' 
                      ? 'border-purple-500 bg-purple-50 text-purple-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="h-5 w-5 mx-auto mb-1" />
                  Cardápio Cliente
                </button>
                <button 
                  onClick={() => setTipoDocumento('tabela_interna')}
                  className={`p-3 border rounded-lg text-sm transition-colors ${
                    tipoDocumento === 'tabela_interna' 
                      ? 'border-purple-500 bg-purple-50 text-purple-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Table className="h-5 w-5 mx-auto mb-1" />
                  Tabela Interna
                </button>
                <button 
                  onClick={() => setTipoDocumento('analise_custos')}
                  className={`p-3 border rounded-lg text-sm transition-colors ${
                    tipoDocumento === 'analise_custos' 
                      ? 'border-purple-500 bg-purple-50 text-purple-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <BarChart3 className="h-5 w-5 mx-auto mb-1" />
                  Análise Custos
                </button>
                <button 
                  onClick={() => setTipoDocumento('relatorio_completo')}
                  className={`p-3 border rounded-lg text-sm transition-colors ${
                    tipoDocumento === 'relatorio_completo' 
                      ? 'border-purple-500 bg-purple-50 text-purple-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <BookOpen className="h-5 w-5 mx-auto mb-1" />
                  Relatório Completo
                </button>
              </div>
            </div>
            
            {/* Formato */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Formato de Saída
              </label>
              <select 
                className="w-full rounded-lg border-gray-300"
                value={formato}
                onChange={(e) => setFormato(e.target.value as any)}
              >
                <option value="pdf">PDF - Documento</option>
                <option value="excel">Excel - Planilha</option>
                <option value="json">JSON - Dados</option>
                <option value="qrcode">QR Code - Link</option>
              </select>
            </div>
            
            {/* Opções de Conteúdo */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Incluir no Documento
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={config.incluirLogo}
                    onChange={(e) => setConfig({...config, incluirLogo: e.target.checked})}
                  />
                  <span className="text-sm">Logo da Empresa</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={config.incluirFotos}
                    onChange={(e) => setConfig({...config, incluirFotos: e.target.checked})}
                  />
                  <span className="text-sm">Fotos dos Produtos</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={config.incluirDescricoes}
                    onChange={(e) => setConfig({...config, incluirDescricoes: e.target.checked})}
                  />
                  <span className="text-sm">Descrições</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={config.incluirCustos}
                    onChange={(e) => setConfig({...config, incluirCustos: e.target.checked})}
                  />
                  <span className="text-sm">Informações de Custo</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={config.incluirMargens}
                    onChange={(e) => setConfig({...config, incluirMargens: e.target.checked})}
                  />
                  <span className="text-sm">Margens de Lucro</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={config.incluirQRCode}
                    onChange={(e) => setConfig({...config, incluirQRCode: e.target.checked})}
                  />
                  <span className="text-sm">QR Code para Pedidos</span>
                </label>
              </div>
            </div>
            
            {/* Estilo Visual */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Estilo Visual
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['moderno', 'classico', 'minimalista', 'colorido'].map(estilo => (
                  <button 
                    key={estilo}
                    onClick={() => setConfig({...config, estiloVisual: estilo as any})}
                    className={`p-2 border rounded text-sm transition-colors capitalize ${
                      config.estiloVisual === estilo 
                        ? 'border-purple-500 bg-purple-50 text-purple-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {estilo}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Botões de Ação */}
            <div className="flex gap-2">
              <button 
                onClick={gerarPreview}
                className="flex-1 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
              <button 
                onClick={exportar}
                className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar
              </button>
            </div>

            <button 
              onClick={salvarTemplate}
              className="w-full mt-2 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              Salvar Template
            </button>
          </div>
          
          {/* Templates Salvos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-medium mb-3">Templates Salvos</h4>
            <div className="space-y-2">
              {templatesSalvos.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhum template salvo
                </p>
              ) : (
                templatesSalvos.map(template => (
                  <button
                    key={template.id}
                    onClick={() => carregarTemplate(template)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{template.nome}</span>
                      <span className="text-xs text-gray-500">{template.formato}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {template.tipo.replace('_', ' ')}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Preview */}
        <div className="col-span-8">
          <div className="bg-white rounded-lg shadow h-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold">Preview do Documento</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setZoom(Math.min(zoom + 0.1, 1.5))}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setZoom(Math.max(zoom - 0.1, 0.3))}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="px-2 py-2 text-sm text-gray-600">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
            </div>
            
            <div className="p-6 overflow-auto" style={{ height: 'calc(100% - 60px)' }}>
              {preview ? (
                <DocumentPreview html={preview} zoom={zoom} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Configure e clique em Preview para visualizar
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}