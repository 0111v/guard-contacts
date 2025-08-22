import { useState, useEffect, useRef } from 'react'
import { Contact, CreateContactInput, UpdateContactInput } from '../../types/contact'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CreateContactInput | UpdateContactInput) => Promise<void>
  contact?: Contact | null // For editing existing contact
  loading?: boolean
}

export function ContactModal({ isOpen, onClose, onSave, contact, loading = false }: ContactModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)

  // Secret tooltip state
  const [showSecretTooltip, setShowSecretTooltip] = useState(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Reset form when modal opens/closes or contact changes
  useEffect(() => {
    if (isOpen && contact) {
      // Editing mode - populate form
      setName(contact.name)
      setEmail(contact.email || '')
      setPhone(contact.phone || '')
      setPhoto(null)
    } else if (isOpen) {
      // Adding mode - clear form
      setName('')
      setEmail('')
      setPhone('')
      setPhoto(null)
    }
  }, [isOpen, contact])

  // Secret tooltip handlers
  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowSecretTooltip(true)
    }, 7000) // 7 seconds
  }

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    setShowSecretTooltip(false)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  const handleSubmit = async () => {
    if (!name.trim()) return

    try {
      if (contact) {
        // Update existing contact
        await onSave({
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          photo: photo || undefined,
        })
      } else {
        // Create new contact
        await onSave({
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          photo: photo || undefined,
        })
      }
      onClose()
    } catch (error) {
      console.error('Error saving contact:', error)
    }
  }

  const handleClose = () => {
    setShowSecretTooltip(false)
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background-primary rounded-lg shadow-xl border border-background-secondary max-w-md w-full m-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-background-secondary">
          <h2 className="text-heading text-content-primary">
            {contact ? 'Editar Contato' : 'Adicionar Contato'}
          </h2>
          <button
            onClick={handleClose}
            className="text-content-muted hover:text-content-primary transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 mb-6">
            <input
              type="text"
              placeholder="Nome *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-3 bg-background-secondary border border-background-secondary rounded-lg text-content-primary placeholder-content-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 bg-background-secondary border border-background-secondary rounded-lg text-content-primary placeholder-content-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            <input
              type="tel"
              placeholder="Telefone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="px-4 py-3 bg-background-secondary border border-background-secondary rounded-lg text-content-primary placeholder-content-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="px-4 py-3 bg-background-secondary border border-background-secondary rounded-lg text-content-muted cursor-pointer hover:border-accent transition-colors">
                {photo ? `📸 ${photo.name}` : '📷 Escolher foto...'}
              </div>
            </div>
          </div>
          
          {photo && (
            <div className="mb-4 text-text-small text-content-muted">
              📸 Selecionado: {photo.name} ({(photo.size / 1024).toFixed(1)} KB)
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleClose}
              disabled={loading}
              className="bg-background-secondary text-content-muted px-6 py-3 rounded-lg font-medium hover:bg-background-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancelar
            </button>
            <div className="relative">
              <button
                onClick={handleSubmit}
                disabled={loading || !name.trim()}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="bg-accent text-background-primary px-6 py-3 rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Salvando...' : contact ? 'Atualizar Contato' : 'Adicionar Contato'}
              </button>
              
              {/* Secret Tooltip */}
              {showSecretTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-background-primary border border-accent rounded-lg shadow-lg text-content-primary text-text-small whitespace-nowrap animate-pulse">
                  🎉 Você encontrou o easter egg! Parabéns pela paciência!
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-accent"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}