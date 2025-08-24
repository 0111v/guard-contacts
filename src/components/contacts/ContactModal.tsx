import { useState, useEffect, useCallback } from 'react'
import { Contact, CreateContactInput, UpdateContactInput } from '../../types/contact'
import { ContactAvatar } from './ContactAvatar'
import { AccountIcon } from '../icons/AccountIcon'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CreateContactInput | UpdateContactInput) => Promise<void>
  contact?: Contact | null // for editing existing contact
  loading?: boolean
}

export function ContactModal({ isOpen, onClose, onSave, contact, loading = false }: ContactModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [nameError, setNameError] = useState('')


  useEffect(() => {
    if (isOpen && contact) {
      // editing mode
      setName(contact.name)
      setEmail(contact.email || '')
      setPhone(contact.phone || '')
      setPhoto(null)
    } else if (isOpen) {
      // creating mode
      setName('')
      setEmail('')
      setPhone('')
      setPhoto(null)
    }
  }, [isOpen, contact])

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  // ESC key handler
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => document.removeEventListener('keydown', handleEscKey)
  }, [isOpen, handleClose])

  const handleSubmit = async () => {
    // Clear previous error
    setNameError('')
    
    // Validate name
    if (!name.trim()) {
      setNameError('Nome é obrigatório')
      return
    }

    try {
      if (contact) {
        // update existing contact
        await onSave({
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          photo: photo || undefined,
        })
      } else {
        // create new contact
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background-primary rounded-lg shadow-xl border border-background-secondary max-w-md w-full m-4 max-h-[90vh] overflow-y-visible ">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-background-secondary">
          <h2 className="text-heading text-content-primary">
            {contact ? 'Editar Contato' : 'Adicionar Contato'}
          </h2>
          <button
            onClick={handleClose}
            className="text-content-muted hover:text-content-primary transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Photo Section */}
          <div className="flex flex-col items-center gap-4 mb-6">
            {/* Photo Preview */}
            {/* <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-accent bg-background-secondary flex items-center justify-center"> */}
              <ContactAvatar 
                photo_url={photo ? URL.createObjectURL(photo) : contact?.photo_url}
                name={name || contact?.name}
                size='xl'
                className='mt-4'
                fallback={<AccountIcon className="w-12 h-12 text-content-muted" />}
              />
            {/* </div> */}
            
            {/* File Input Button */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button
                type="button"
                className="px-4 py-2 rounded-lg border-1 border-background-tertiary text-accent text-text-small hover:text-accent/80 transition-colors"
              >
                + Adicionar foto
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <label htmlFor="name" className="block text-content-primary text-text-medium font-medium mb-2">
                Nome
              </label>
              <input
                id="name"
                type="text"
                placeholder="Nome do contato"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (nameError) setNameError('') // Clear error when typing
                }}
                className={`w-full px-4 py-3 bg-background-secondary border rounded-lg text-content-primary placeholder-content-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
                  nameError ? 'border-accent-red' : 'border-background-secondary'
                }`}
              />
              {nameError && (
                <p className="mt-1 text-text-small text-accent-red">{nameError}</p>
              )}
            </div>
                        
            <div>
              <label htmlFor="phone" className="block text-content-primary text-text-medium font-medium mb-2">
                Telefone
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="Número de telefone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-background-secondary border border-background-secondary rounded-lg text-content-primary placeholder-content-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

                        <div>
              <label htmlFor="email" className="block text-content-primary text-text-medium font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email do contato"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-background-secondary border border-background-secondary rounded-lg text-content-primary placeholder-content-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>
          
          {photo && (
            <div className="mb-4 text-text-small text-content-muted">
              📸 Selecionado: {photo.name} ({(photo.size / 1024).toFixed(1)} KB)
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex gap-3 justify-end pt-5 border-t border-background-secondary">
            <button
              onClick={handleClose}
              disabled={loading}
              className="bg-background-tertiary text-content-primary px-4 py-2.5 rounded-lg font-medium hover:bg-background-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-accent-brand text-background-primary px-4 py-2.5 rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}