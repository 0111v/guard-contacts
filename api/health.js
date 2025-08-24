// Health check endpoint to warm up serverless function
export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Simulate some processing time (like connecting to database)
  await new Promise(resolve => setTimeout(resolve, 100))

  res.status(200).json({
    status: 'ready',
    timestamp: new Date().toISOString(),
    message: 'Mini-server is warm and ready to export contacts! 🔥',
    coldStart: req.headers['x-vercel-cache'] ? false : true
  })
}