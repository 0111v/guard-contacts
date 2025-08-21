import { supabase } from '../../lib/supabase'
import { Contact, CreateContactInput, UpdateContactInput } from '../types/contact'

export const contactsService = {
  async fetchContacts(): Promise<Contact[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createContact(contact: CreateContactInput): Promise<Contact> {
    let photo_url: string | undefined

    if (contact.photo) {
      photo_url = await this.uploadPhoto(contact.photo)
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        photo_url,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async uploadPhoto(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${(await supabase.auth.getUser()).data.user?.id}/${fileName}`

    const { error } = await supabase.storage
      .from('contact-photos')
      .upload(filePath, file)

    if (error) throw error

    const { data } = supabase.storage
      .from('contact-photos')
      .getPublicUrl(filePath)

    return data.publicUrl
  },

  async updateContact(id: string, updates: UpdateContactInput): Promise<Contact> {
    if (updates.name !== undefined && !updates.name.trim()) {
      throw new Error('Name is required and cannot be empty')
    }

    let photo_url: string | undefined

    if (updates.photo) {
      photo_url = await this.uploadPhoto(updates.photo)
    }

    const { photo, ...updateData } = updates
    const finalUpdates = {
      ...updateData,
      ...(photo_url && { photo_url })
    }

    const { data, error } = await supabase
      .from('contacts')
      .update(finalUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteContact(id: string): Promise<void> {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
