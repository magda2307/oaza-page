export interface Cat {
  id: number
  name: string
  age_years: number | null
  breed: string | null
  description: string | null
  photo_url: string | null
  photos?: string[]
  is_adopted: boolean
  tags: string[]
  created_at: string
}

export interface User {
  id: number
  email: string
  is_admin: boolean
  created_at: string
}

export interface Application {
  id: number
  user_id: number
  cat_id: number
  message: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface AdminApplication extends Application {
  cat_name: string
  user_email: string
}

export interface Page<T> {
  items: T[]
  total: number
  page: number
  pages: number
  limit: number
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface SuccessStory {
  id: string
  cat_name: string
  cat_photo_url: string | null
  cat_photo_alt: string
  diagnosis_tags: string[]
  story_type: 'fiv_felv' | 'po_wypadku' | 'terminal' | 'senior' | 'specjalne'
  adopter_name: string
  adopter_city: string
  quote: string
  adoption_year: number
  story_slug?: string
}
