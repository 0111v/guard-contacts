export interface Contact {
  id: string
  user_id: string
  name: string
  email?: string
  phone?: string
  photo_url?: string
  created_at: string
  updated_at: string
}

export interface CreateContactInput {
  name: string
  email?: string
  phone?: string
  photo?: File
}

export interface UpdateContactInput {
  name?: string
  email?: string
  phone?: string
  photo?: File
}