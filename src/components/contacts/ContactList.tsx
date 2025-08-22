import { Contact } from '../../types/contact'

interface ContactListProps {
  contacts: Contact[]
  loading?: boolean
  onEdit?: (contact: Contact) => void
  onDelete?: (contactId: string) => void
}

export function ContactList({ contacts, loading = false, onEdit, onDelete }: ContactListProps) {
  if (loading && contacts.length === 0) {
    return (
      <div className="bg-background-primary rounded-lg p-8 text-center">
        <p className="text-content-muted">Carregando contatos...</p>
      </div>
    )
  }

  if (contacts.length === 0) {
    return (
      <div className="bg-background-primary rounded-lg p-8 text-center">
        <p className="text-content-muted">Nenhum contato encontrado.</p>
      </div>
    )
  }

  return (
    <div className="bg-background-primary rounded-lg p-4 overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-[60px_1fr_200px_200px_100px] gap-4 p-4 border-b border-background-secondary text-content-muted text-text-small font-medium">
        <div></div>
        <div>Nome</div>
        <div>Telefone</div>
        <div>Email</div>
        <div>Ações</div>
      </div>
      
      {/* Table Rows */}
      {contacts.map((contact) => (
        <div key={contact.id} className="grid grid-cols-[60px_1fr_200px_200px_100px] gap-4 p-4 border-b border-background-secondary hover:bg-background-secondary/50 transition-colors">
          {/* Avatar */}
          <div className="flex items-center">
            {contact.photo_url ? (
              <img 
                src={contact.photo_url} 
                alt={contact.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-background-primary font-medium text-text-small">
                {contact.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          {/* Name */}
          <div className="flex items-center">
            <span className="text-content-primary text-text-medium font-medium">{contact.name}</span>
          </div>
          
          {/* Phone */}
          <div className="flex items-center">
            <span className="text-content-muted text-text-medium">{contact.phone || '-'}</span>
          </div>
          
          {/* Email */}
          <div className="flex items-center">
            <span className="text-content-muted text-text-medium">{contact.email || '-'}</span>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(contact)}
                disabled={loading}
                className="w-6 h-6 text-content-muted hover:text-accent transition-colors disabled:opacity-50"
                title="Editar contato"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(contact.id)}
                disabled={loading}
                className="w-6 h-6 text-content-muted hover:text-red-400 transition-colors disabled:opacity-50"
                title="Excluir contato"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}