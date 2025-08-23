import { Contact } from '../../types/contact'
import { EditIcon } from '../icons/EditIcon'
import { DeleteIcon } from '../icons/DeleteIcon'

interface ContactListProps {
  contacts: Contact[]
  loading?: boolean
  onEdit?: (contact: Contact) => void
  onDelete?: (contactId: string) => void
  className?: string
}

export function ContactList({ contacts, loading = false, onEdit, onDelete, className = '' }: ContactListProps) {
  if (loading && contacts.length === 0) {
    return (
      <div className=" p-12 text-center">
        <p className="text-content-muted">Carregando contatos...</p>
      </div>
    )
  }

  if (contacts.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-content-muted">Nenhum contato encontrado.</p>
      </div>
    )
  }

  return (
    <div className={`bg-background-secondary rounded-lg p-4 ${className}`}>
      <div className='pb-7'></div>
      <div className='h-px bg-background-tertiary'></div>
      {/* Table Header */}
      <div className="mt-7 grid grid-cols-[60px_1fr_1fr_1fr_130px] gap-4 p-4 text-content-muted text-text-small font-medium">
        <div>NOME</div>
        <div></div>
        <div>TELEFONE</div>
        <div>EMAIL</div>
        <div></div>
      </div>
      
      {/* Table Rows */}
      <div className='overflow-y-auto scrollbar-hide max-h-[52vh]'>
        {contacts.map((contact) => (
          <div key={contact.id} className="grid grid-cols-[80px_1fr_1fr_1fr_130px] gap-4 p-4 hover:bg-background-secondary/50 transition-colors relative">
            <div className="absolute bottom-0 left-4 right-1 h-px bg-background-tertiary"></div>
            {/* Avatar */}
            <div className="flex items-center ml-2">
              {contact.photo_url ? (
                <img 
                  src={contact.photo_url} 
                  alt={contact.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-content-muted flex items-center justify-center text-background-primary font-medium text-text-small">
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
              <span className="text-content-primary text-text-medium">{contact.phone || '-'}</span>
            </div>
            
            {/* Email */}
            <div className="flex items-center">
              <span className="text-content-primary text-text-medium">{contact.email || '-'}</span>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3 mr-4">
              {onEdit && (
                <button
                  onClick={() => onEdit(contact)}
                  disabled={loading}
                  className="flex items-center rounded-xl text-content-primary p-2 gap-1 border-2 border-background-tertiary hover:text-accent transition-colors disabled:opacity-50"
                  title="Editar contato"
                >
                  <EditIcon className="w-5 h-5" /> <span>Editar</span>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(contact.id)}
                  disabled={loading}
                  className="w-11 h-11 rounded-xl border-2 border-background-tertiary hover:text-red-400 transition-colors disabled:opacity-50"
                  title="Excluir contato"
                >
                  <DeleteIcon className="w-10 h-10 text-content-primary" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}