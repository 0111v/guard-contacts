'use client'

import { useState } from 'react'
import { exportService } from '../../services/export'

export function ExportTest() {
  const [isWarming, setIsWarming] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [warmUpMessage, setWarmUpMessage] = useState('')
  const [email, setEmail] = useState('')

  const handleWarmUp = async () => {
    setIsWarming(true)
    setIsReady(false)
    
    try {
      const result = await exportService.warmUpServer()
      setIsReady(result.isReady)
      setWarmUpMessage(result.message)
    } catch {
      setWarmUpMessage('Failed to warm up server')
    } finally {
      setIsWarming(false)
    }
  }

  const handleDownload = async () => {
    setIsExporting(true)
    
    try {
      const blob = await exportService.exportContacts()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'contacts-test-export.csv'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed! Check console for details.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleEmailExport = async () => {
    if (!email.trim()) {
      alert('Please enter an email address')
      return
    }
    
    setIsExporting(true)
    
    try {
      const result = await exportService.exportToEmail(email)
      alert(result.message)
    } catch (error) {
      console.error('Email export failed:', error)
      alert('Email export failed! Check console for details.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">🧪 Mini-Server Test</h2>
      
      {/* Warm-up section */}
      <div className="mb-6">
        <button
          onClick={handleWarmUp}
          disabled={isWarming}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isWarming ? '🔥 Warming up...' : '🔥 Warm Up Server'}
        </button>
        
        {warmUpMessage && (
          <div className={`mt-2 p-3 rounded text-sm ${isReady ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {warmUpMessage}
          </div>
        )}
      </div>

      {/* Export section */}
      <div className="space-y-4">
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? '📥 Generating...' : '📥 Download CSV'}
        </button>
        
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleEmailExport}
            disabled={isExporting || !email.trim()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📧
          </button>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p><strong>Test Steps:</strong></p>
        <ol className="list-decimal list-inside space-y-1 mt-2">
          <li>Click &quot;Warm Up Server&quot; and measure time</li>
          <li>Click &quot;Download CSV&quot; (should be fast if warmed)</li>
          <li>Try email export with your email</li>
          <li>Open browser dev tools to see console logs</li>
        </ol>
      </div>
    </div>
  )
}