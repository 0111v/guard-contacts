import { create } from 'zustand'
import { Contact, CreateContactInput, UpdateContactInput } from '../types/contact'
import { contactsService } from '../services/contacts'

interface ContactsState {
  contacts: Contact[]
  loading: boolean
  error: string | null
  filter: string
}

interface ContactStore extends ContactsState {  
  getContacts: () => Promise<void>
  addContact: (contact: CreateContactInput) => Promise<void>
  editContact: (id: string, updates: UpdateContactInput) => Promise<Contact | null>
  removeContact: (id: string) => Promise<void>

  setFilter: (filter: string) => void  
  filteredContacts: () => Contact[]
}

export const useContactsStore = create<ContactStore>((set, get) => ({
  contacts: [],
  loading: false,
  error: null,
  filter: '',

  getContacts: async () => {
    set({ loading: true, error: null })

    try {
      const data = await contactsService.fetchContacts()
      set({ contacts: data })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch contacts', 
      })
    } finally {
      set({ loading: false })
    }
  },

  addContact: async (contact) => {
    set({ loading: true, error: null })

    try {
      const data = await contactsService.createContact(contact)
      set(state => ({ 
        contacts: [data, ...state.contacts],
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create contact',
      })
    } finally {
      set({ loading: false })
    }
  },

  editContact: async (id, updates) => {
    set({ loading: true, error: null })

    try {
      const updatedContact = await contactsService.updateContact(id, updates)

      set(state => ({
        contacts: state.contacts.map(contact => contact.id === id ? updatedContact : contact)
      }))

      return updatedContact
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to edit contact' })
      return null
    } finally {
      set({ loading: false })
    }
  },

  removeContact: async (id) => {
    set({ loading: true, error: null })

    try {
      await contactsService.deleteContact(id)

      set(state => ({
        contacts: state.contacts.filter(contact => contact.id !== id)
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete contact' })
    } finally {
      set({ loading: false })
    }
  },

  setFilter: (filter) => set({ filter }),

  filteredContacts: () => {
    const { contacts, filter } = get()
    
    if (filter) {
      return contacts.filter(contact => 
        contact.name.toLowerCase().startsWith(filter.toLowerCase()))
    }

    return contacts
  }
}))