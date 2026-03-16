export interface Cat {
  id: number
  name: string
  age_years: number | null
  breed: string | null
  description: string | null
  photo_url: string | null
  is_adopted: boolean
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

export interface TokenResponse {
  access_token: string
  token_type: string
}
