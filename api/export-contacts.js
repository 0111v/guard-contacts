// Mock export endpoint to simulate CSV generation
export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Simulate processing time for CSV generation
  console.log('Starting CSV export simulation...')
  await new Promise(resolve => setTimeout(resolve, 500))

  // Mock CSV content
  const mockCSV = `Name,Email,Phone,Created At
João Silva,joao@email.com,(11) 99999-1234,2024-01-15
Maria Santos,maria@email.com,(11) 99999-5678,2024-01-16
Pedro Oliveira,pedro@email.com,(11) 99999-9012,2024-01-17
Ana Costa,ana@email.com,(11) 99999-3456,2024-01-18
Carlos Souza,carlos@email.com,(11) 99999-7890,2024-01-19`

  // Check if user wants email delivery
  const { email } = req.query

  if (email) {
    // Mock email sending
    console.log(`Mock: Sending CSV to ${email}`)
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return res.status(200).json({
      success: true,
      message: `Export sent to ${email} successfully! 📧`,
      timestamp: new Date().toISOString(),
      contactCount: 5
    })
  } else {
    // Direct CSV download
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename=contacts-export.csv')
    
    return res.status(200).send(mockCSV)
  }
}