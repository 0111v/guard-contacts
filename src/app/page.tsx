'use client'

import { useState, useEffect } from 'react'
import { useContactsStore } from '../stores/contacts'
import { useAuthStore } from '../stores/auth'
import { Contact, CreateContactInput, UpdateContactInput } from '../types/contact'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { ContactList } from '../components/contacts/ContactList'
import { ContactModal } from '../components/contacts/ContactModal'
import { ExportModal } from '../components/contacts/ExportModal'
import { AlphabetFilter } from '../components/contacts/AlphabetFilter'
import { Sidebar } from '../components/layout/Sidebar'
import { SecretTooltip } from '../components/ui/SecretTooltip'

export default function Home() {
  const { user, logout } = useAuthStore()
  
  const { 
    contacts, 
    loading, 
    error, 
    filter,
    getContacts, 
    addContact, 
    editContact, 
    removeContact, 
    setFilter,
    filteredContacts 
  } = useContactsStore()

  const [showContactModal, setShowContactModal] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [showExportModal, setShowExportModal] = useState(false)

  const handleAddContact = () => {
    setEditingContact(null)
    setShowContactModal(true)
  }

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact)
    setShowContactModal(true)
  }

  const handleCloseModal = () => {
    setShowContactModal(false)
    setEditingContact(null)
  }

  const handleSaveContact = async (data: CreateContactInput | UpdateContactInput) => {
    if (editingContact) {
      await editContact(editingContact.id, data)
    } else {
      await addContact(data as CreateContactInput)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return
    await removeContact(id)
  }

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout()
    }
  }

  const handleExportContacts = () => {
    setShowExportModal(true)
  }

  useEffect(() => {
    getContacts()
  }, [])

  const displayContacts = filteredContacts()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-primary flex">
        {/* Left Sidebar */}
        <Sidebar user={user} onLogout={handleLogout} />

        {/* Main Content Area */}
        <div className="flex-1 bg-background-primary flex items-center justify-start">
          <div className="bg-background-secondary rounded-4xl shadow-lg border border-background-primary flex overflow-hidden max-h-[80vh] w-full max-w-[80vw]">

            {/* Contact Content */}
            <div className="flex-1 p-10">
              {/* Top Bar */}
              <div className='flex justify-between'>
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-heading font-bold text-content-primary">Lista de contatos</h1>
                </div>

                {/* need a name for this part */}
                <div className='flex gap-3'>
                  {/* Search Input */}
                  <div className="mb-6 relative rounded-xl border-2 border-background-tertiary">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <svg className="w-5 h-5 text-content-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Pesquisar"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="w-100 pl-12 pr-4 py-2 text-left border border-background-secondary rounded-lg text-content-primary placeholder-content-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                  </div>
              
                  {/* Export Button */}
                  <div className="mb-6">
                    <button
                      onClick={handleExportContacts}
                      className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <span>⬇</span>
                      Exportar CSV
                    </button>
                  </div>

                  {/* Add Contact Button */}
                  <div className="mb-6">
                    <SecretTooltip>
                      <button
                        onClick={handleAddContact}
                        className="bg-background-tertiary text-white px-6 py-3 rounded-xl font-medium hover:bg-accent/90 transition-colors flex items-center gap-2"
                      >
                        <span>+</span>
                        Adicionar Contato
                      </button>
                    </SecretTooltip>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {/* Contacts List */}
              <div className='flex items-start'>
                <AlphabetFilter 
                  currentFilter={filter}
                  onFilterChange={setFilter}
                />
                <div className="flex-1">
                {/* <div className="flex mb-4"> */}
                  {/* <h2 className="text-xl font-semibold">
                    Contacts ({displayContacts.length}
                    {filter && ` of ${contacts.length}`})
                  </h2> */}
                  {/* <button
                    onClick={getContacts}
                    disabled={loading}
                    className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Refresh'}
                  </button> */}
                {/* </div> */}
                
                <ContactList
                  contacts={displayContacts}
                  loading={loading}
                  onEdit={handleEditContact}
                  onDelete={handleDelete}
                  className="mr-4 ml-8 "
                />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={showContactModal}
        onClose={handleCloseModal}
        onSave={handleSaveContact}
        contact={editingContact}
        loading={loading}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </ProtectedRoute>
  )
}
