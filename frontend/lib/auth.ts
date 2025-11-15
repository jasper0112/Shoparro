// Authentication utility functions

export interface User {
  id: number
  username: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  role: string
  address?: string
  city?: string
  postcode?: string
  country?: string
  businessName?: string
  businessLicense?: string
  businessDescription?: string
  enabled?: boolean
  createdAt?: string
  updatedAt?: string
  lastLoginAt?: string
}

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export const isAuthenticated = (): boolean => {
  return getToken() !== null
}

export const logout = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export const getAuthHeaders = (): HeadersInit => {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// Helper to get display name
export const getDisplayName = (user: User | null): string => {
  if (!user) return 'User'
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`
  }
  if (user.firstName) return user.firstName
  if (user.username) return user.username
  return user.email
}

