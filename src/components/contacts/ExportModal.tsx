'use client'

import { useState, useEffect } from 'react'
import { exportService } from '../../services/export'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [email, setEmail] = useState('')
  const [exportMode, setExportMode] = useState<'download' | 'email'>('download')
  const [serverReady, setServerReady] = useState(false)

  useEffect(() => {
    if (isOpen && !serverReady) {
      warmUpServer()
    }
  }, [isOpen, serverReady])

  const warmUpServer = async () => {
    try {
      console.log('🔥 Warming up server for export...')
      const result = await exportService.warmUpServer()
      setServerReady(result.isReady)
      console.log('✅ Server warmed up:', result.message)
    } catch (error) {
      console.error('❌ Server warmup failed:', error)
      setServerReady(false)
    } 
  }

  if (!isOpen) return null

  const handleDirectDownload = async () => {
    try {
      setIsExporting(true)
      const blob = await exportService.exportContacts()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `contacts-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      onClose()
    } catch (error) {
      console.error('Export failed:', error)
      alert('Falha ao exportar contatos. Tente novamente.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleEmailExport = async () => {
    if (!email) {
      alert('Por favor, insira um email válido.')
      return
    }

    try {
      setIsExporting(true)
      const result = await exportService.exportToEmail(email)
      alert(result.message)
      setEmail('')
      onClose()
    } catch (error) {
      console.error('Email export failed:', error)
      alert('Falha ao enviar email. Tente novamente.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleSubmit = () => {
    if (exportMode === 'download') {
      handleDirectDownload()
    } else {
      handleEmailExport()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background-secondary rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-content-primary">Exportar Contatos</h2>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="text-content-muted hover:text-content-primary disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Export Mode Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="exportMode"
                value="download"
                checked={exportMode === 'download'}
                onChange={(e) => setExportMode(e.target.value as 'download')}
                className="text-accent"
              />
              <span className="text-content-primary">Download direto (.csv)</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="exportMode"
                value="email"
                checked={exportMode === 'email'}
                onChange={(e) => setExportMode(e.target.value as 'email')}
                className="text-accent"
              />
              <span className="text-content-primary">Enviar por email</span>
            </label>
          </div>

          {/* Email Input (only shown when email mode is selected) */}
          {exportMode === 'email' && (
            <div className="pt-2">
              <input
                type="email"
                placeholder="seu-email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isExporting}
                className="w-full px-4 py-3 rounded-xl border border-background-tertiary text-content-primary placeholder-content-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="flex-1 px-6 py-3 rounded-xl border border-background-tertiary text-content-primary hover:bg-background-tertiary/20 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isExporting}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <span className="animate-spin">⏳</span>
                {exportMode === 'download' ? 'Exportando...' : 'Enviando...'}
              </>
            ) : (
              <>
                <span>{exportMode === 'download' ? '⬇' : '📧'}</span>
                {exportMode === 'download' ? 'Baixar CSV' : 'Enviar Email'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}