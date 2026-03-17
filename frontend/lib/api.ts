import type { Cat, Page, User, Application, AdminApplication, TokenResponse } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }

  return res.json() as Promise<T>
}

// --- Cats ---
export const getCats = (params?: string) => apiFetch<Page<Cat>>(`/cats${params ? `?${params}` : ''}`)
export const getCat = (id: number) => apiFetch<Cat>(`/cats/${id}`)

// --- Auth ---
export const register = (email: string, password: string) =>
  apiFetch<User>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

export const login = (email: string, password: string) =>
  apiFetch<TokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

// --- Applications ---
export const submitApplication = (catId: number, message: string, token: string) =>
  apiFetch<Application>('/applications', {
    method: 'POST',
    body: JSON.stringify({ cat_id: catId, message }),
  }, token)

export const getMyApplications = (token: string) =>
  apiFetch<Application[]>('/applications/mine', {}, token)

// --- Admin ---
export const getAdminApplications = (token: string) =>
  apiFetch<AdminApplication[]>('/admin/applications', {}, token)

export const updateApplicationStatus = (id: number, status: string, token: string) =>
  apiFetch<Application>(`/admin/applications/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }, token)

export const createCat = (data: Partial<Cat>, token: string) =>
  apiFetch<Cat>('/cats', { method: 'POST', body: JSON.stringify(data) }, token)

export const updateCat = (id: number, data: Partial<Cat>, token: string) =>
  apiFetch<Cat>(`/cats/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, token)

export const deleteCat = (id: number, token: string) =>
  apiFetch<void>(`/cats/${id}`, { method: 'DELETE' }, token)
