// Utility functions for API calls
import { getAuthHeaders } from './auth'
import type { User } from './auth'

const API_BASE_URL = 'http://localhost:8080/api'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  imageUrl?: string
}

export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
}

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch product list')
    }

    const data = await response.json()
    return Array.isArray(data) ? data : data.products || []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export const fetchProductById = async (id: number): Promise<Product | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch product details')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

// User API functions
export interface RegisterData {
  username: string
  email: string
  password: string
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  city?: string
  postcode?: string
  country?: string
}

export interface UpdateUserData {
  username?: string
  email?: string
  password?: string
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  city?: string
  postcode?: string
  country?: string
  businessName?: string
  businessLicense?: string
  businessDescription?: string
}

export interface LoginResponse {
  token: string
  user: User
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Login failed')
  }

  return await response.json()
}

export const register = async (data: RegisterData): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Registration failed')
  }

  return await response.json()
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) return null

    // Get user ID from token or use a get user endpoint
    // For now, we'll need to decode the token or use a /me endpoint
    // Since backend doesn't have /me, we'll get user from localStorage
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
    return null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export const getUserById = async (id: number): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch user')
  }

  return await response.json()
}

export const updateUser = async (id: number, data: UpdateUserData): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update user')
  }

  return await response.json()
}

