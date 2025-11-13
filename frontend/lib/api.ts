// Utility functions for API calls

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

