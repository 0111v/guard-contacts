const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-vercel-url.vercel.app/api'  // Update this with your actual Vercel URL
  : 'http://localhost:3000/api'

export const exportService = {
  // Health check to warm up serverless function
  async warmUpServer(): Promise<{ isReady: boolean; message: string }> {
    try {
      console.log('🔥 Warming up mini-server...')
      const startTime = Date.now()
      
      const response = await fetch(`${API_BASE}/health`, {
        method: 'GET'
      })
      
      const data = await response.json()
      const duration = Date.now() - startTime
      
      console.log(`✅ Server warmed up in ${duration}ms`, data)
      
      return {
        isReady: true,
        message: data.message
      }
    } catch (error) {
      console.error('❌ Failed to warm up server:', error)
      return {
        isReady: false,
        message: 'Failed to connect to export server'
      }
    }
  },

  // Export contacts as CSV download
  async exportContacts(): Promise<Blob> {
    try {
      console.log('📥 Starting CSV download...')
      const startTime = Date.now()
      
      const response = await fetch(`${API_BASE}/export-contacts`, {
        method: 'GET'
      })

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`)
      }

      const blob = await response.blob()
      const duration = Date.now() - startTime
      
      console.log(`✅ CSV generated in ${duration}ms`)
      return blob
      
    } catch (error) {
      console.error('❌ Export failed:', error)
      throw error
    }
  },

  // Export contacts to email
  async exportToEmail(email: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`📧 Sending export to ${email}...`)
      const startTime = Date.now()
      
      const response = await fetch(`${API_BASE}/export-contacts?email=${encodeURIComponent(email)}`, {
        method: 'GET'
      })

      if (!response.ok) {
        throw new Error(`Email export failed: ${response.statusText}`)
      }

      const data = await response.json()
      const duration = Date.now() - startTime
      
      console.log(`✅ Email sent in ${duration}ms`)
      return data
      
    } catch (error) {
      console.error('❌ Email export failed:', error)
      throw error
    }
  }
}