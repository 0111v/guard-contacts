export function generateEmailTemplate(contactCount, timestamp) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Exportação de Contatos</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4CAF50; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .stats { background: white; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #4CAF50; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
    .button { display: inline-block; background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 Exportação de Contatos</h1>
    </div>
    
    <div class="content">
      <h2>Olá!</h2>
      
      <p>Sua exportação de contatos foi processada com sucesso! 🎉</p>
      
      <div class="stats">
        <h3>📊 Detalhes da Exportação:</h3>
        <ul>
          <li><strong>Total de contatos:</strong> ${contactCount}</li>
          <li><strong>Formato:</strong> CSV (Excel compatível)</li>
          <li><strong>Data/Hora:</strong> ${new Date(timestamp).toLocaleString('pt-BR')}</li>
        </ul>
      </div>
      
      <p>O arquivo CSV está em anexo e pode ser aberto diretamente no Excel, Google Sheets ou qualquer editor de planilhas.</p>
      
      <p><strong>Colunas incluídas:</strong></p>
      <ul>
        <li>Nome</li>
        <li>Email</li>
        <li>Telefone</li>
        <li>Data de Criação</li>
      </ul>
      
      <div class="footer">
        <p>Este email foi enviado automaticamente pelo sistema Guard Contatos.</p>
        <p>Se você não solicitou esta exportação, pode ignorar este email com segurança.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

export function generateEmailSubject(contactCount) {
  return `📧 Exportação de ${contactCount} contatos - ${new Date().toLocaleDateString('pt-BR')}`
}