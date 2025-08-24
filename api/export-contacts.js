// Real CSV export endpoint using Supabase data
import { Resend } from 'resend'
import { createAuthenticatedClient } from './_shared/supabase.js'
import { generateEmailTemplate, generateEmailSubject } from './_shared/email-template.js'
export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const authHeader = req.headers.authorization || ''
  const supabase = createAuthenticatedClient(authHeader)

  console.log('Auth header present?', Boolean(authHeader))
  console.log('Fetching contacts from Supabase...')

  let contacts = null
  let realCSV = ''

  try {
    const resp = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    contacts = resp.data
    const error = resp.error

    console.log('Supabase response:', { contacts: contacts?.length || 0, error })

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Failed to fetch contacts' })
    }

    if (!contacts || contacts.length === 0) {
      console.log('No contacts found')
      return res.status(404).json({ 
        error: 'No contacts found to export',
        message: 'Adicione alguns contatos antes de exportar'
      })
    }

    const csvHeader = 'Name,Email,Phone,Created At'
    const csvRows = contacts
      .map((contact) => {
        const name = (contact.name || '').replace(/"/g, '""') // Escape quotes
        const email = (contact.email || '').replace(/"/g, '""')
        const phone = (contact.phone || '').replace(/"/g, '""')
        const createdAt = new Date(contact.created_at).toLocaleDateString('pt-BR')
        return `"${name}","${email}","${phone}","${createdAt}"`
      })
      .join('\n')

    realCSV = `${csvHeader}\n${csvRows}`
    console.log(`Generated CSV with ${contacts.length} contacts`)
  } catch (serverError) {
    console.error('Server error:', serverError)
    return res.status(500).json({ error: 'Internal server error' })
  }

  // Check if user wants email delivery
  const { email } = req.query

  if (email) {
    try {
      console.log(`📧 Sending CSV to ${email}`)
      
      // Initialize Resend client
      const resend = new Resend(process.env.RESEND_API_KEY)
      
      // Create CSV buffer for attachment
      const csvBuffer = Buffer.from(realCSV, 'utf-8')
      const filename = `contacts-export-${new Date().toISOString().split('T')[0]}.csv`
      
      // Send email with attachment
      const emailResult = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: email,
        subject: generateEmailSubject(contacts.length),
        html: generateEmailTemplate(contacts.length, new Date().toISOString()),
        attachments: [
          {
            filename: filename,
            content: csvBuffer,
            type: 'text/csv'
          }
        ]
      })
      
      console.log('✅ Email sent successfully:', emailResult.data?.id)
      
      return res.status(200).json({
        success: true,
        message: `Export sent to ${email} successfully! 📧`,
        timestamp: new Date().toISOString(),
        contactCount: contacts.length,
        emailId: emailResult.data?.id
      })
      
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError)
      return res.status(500).json({
        error: 'Failed to send email',
        message: 'Falha ao enviar email. Verifique o endereço e tente novamente.'
      })
    }
  } else {
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `contacts-export-${timestamp}.csv`

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`)

    return res.status(200).send(realCSV)
  }
}
