// Utility functions for API calls
import { getAuthHeaders } from './auth'
import type { User } from './auth'

const API_BASE_URL = 'http://localhost:8080/api'

export type ProductStatus = 
  | 'ACTIVE'
  | 'INACTIVE'
  | 'OUT_OF_STOCK'
  | 'DISCONTINUED'

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  stock: number
  category?: string
  imageUrl?: string
  imageUrls?: string
  status: ProductStatus
  enabled?: boolean
  originalPrice?: number
  sku?: string
  brand?: string
  unit?: string
  specifications?: string
  salesCount?: number
  viewCount?: number
  rating?: number
  reviewCount?: number
  merchantId?: number
  merchantName?: string
  createdAt?: string
  updatedAt?: string
}

export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
}

// Legacy function for backward compatibility
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await getActiveProducts(0, 100)
    return response.content
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

// Legacy function for backward compatibility
export const fetchProductById = async (id: number): Promise<Product | null> => {
  try {
    return await getProductById(id)
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

// Order API functions
export type OrderStatus = 
  | 'PENDING_PAYMENT'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'REFUNDED'

export type PaymentStatus = 
  | 'PENDING'
  | 'PAID'
  | 'REFUNDED'
  | 'FAILED'
  | 'PARTIALLY_PAID'

export type PaymentMethod = 
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'PAYPAL'
  | 'WECHAT_PAY'
  | 'ALIPAY'
  | 'BANK_TRANSFER'
  | 'CASH_ON_DELIVERY'

export interface OrderItem {
  id: number
  productId: number
  productName: string
  productSku: string
  quantity: number
  unitPrice: number
  totalPrice: number
  merchantId?: number
  merchantName?: string
  status?: string
  notes?: string
}

export interface Order {
  id: number
  orderNumber: string
  customerId: number
  customerName?: string
  customerEmail?: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod?: PaymentMethod
  subtotal: number
  shippingFee: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  shippingName?: string
  shippingPhone?: string
  shippingAddress?: string
  shippingCity?: string
  shippingPostcode?: string
  shippingCountry?: string
  shippingProvider?: string
  trackingNumber?: string
  paymentReference?: string
  notes?: string
  cancellationReason?: string
  orderDate: string
  paymentDate?: string
  shippedDate?: string
  deliveredDate?: string
  cancelledDate?: string
  updatedAt?: string
  items: OrderItem[]
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

export interface CreateOrderRequest {
  userId: number
  items: Array<{
    productId: number
    quantity: number
    notes?: string
  }>
  paymentMethod?: PaymentMethod
  shippingFee?: number
  taxAmount?: number
  discountAmount?: number
  shippingName?: string
  shippingPhone?: string
  shippingAddress?: string
  shippingCity?: string
  shippingPostcode?: string
  shippingCountry?: string
  notes?: string
}

export const getOrdersByUser = async (
  userId: number,
  page: number = 0,
  size: number = 20
): Promise<PageResponse<Order>> => {
  const response = await fetch(
    `${API_BASE_URL}/orders/user/${userId}?page=${page}&size=${size}&sortBy=orderDate&sortDir=DESC`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch orders')
  }

  return await response.json()
}

export const getOrderById = async (id: number): Promise<Order> => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch order')
  }

  return await response.json()
}

export const getOrderByNumber = async (orderNumber: string): Promise<Order> => {
  const response = await fetch(`${API_BASE_URL}/orders/number/${orderNumber}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch order')
  }

  return await response.json()
}

export const cancelOrder = async (orderId: number, userId: number, reason: string): Promise<Order> => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ userId, reason }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to cancel order')
  }

  return await response.json()
}

export const createOrder = async (data: CreateOrderRequest): Promise<Order> => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create order')
  }

  return await response.json()
}

// Product API functions
export interface CreateProductRequest {
  name: string
  description?: string
  price: number
  stock?: number
  category?: string
  imageUrl?: string
  imageUrls?: string
  status?: ProductStatus
  originalPrice?: number
  sku?: string
  brand?: string
  unit?: string
  specifications?: string
}

export interface UpdateProductRequest {
  name?: string
  description?: string
  price?: number
  stock?: number
  category?: string
  imageUrl?: string
  imageUrls?: string
  status?: ProductStatus
  enabled?: boolean
  originalPrice?: number
  sku?: string
  brand?: string
  unit?: string
  specifications?: string
}

export const getAllProducts = async (
  page: number = 0,
  size: number = 20,
  sortBy: string = 'createdAt',
  sortDir: string = 'DESC'
): Promise<PageResponse<Product>> => {
  const response = await fetch(
    `${API_BASE_URL}/products?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch products')
  }

  return await response.json()
}

export const getActiveProducts = async (
  page: number = 0,
  size: number = 20,
  sortBy: string = 'createdAt',
  sortDir: string = 'DESC'
): Promise<PageResponse<Product>> => {
  const response = await fetch(
    `${API_BASE_URL}/products/active?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch active products')
  }

  return await response.json()
}

export const getProductById = async (id: number): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch product')
  }

  return await response.json()
}

export const getProductsByMerchant = async (
  merchantId: number,
  page: number = 0,
  size: number = 20
): Promise<PageResponse<Product>> => {
  const response = await fetch(
    `${API_BASE_URL}/products/merchant/${merchantId}/page?page=${page}&size=${size}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch merchant products')
  }

  return await response.json()
}

export const getProductsByCategory = async (
  category: string,
  page: number = 0,
  size: number = 20
): Promise<PageResponse<Product>> => {
  const response = await fetch(
    `${API_BASE_URL}/products/category/${encodeURIComponent(category)}?page=${page}&size=${size}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch products by category')
  }

  return await response.json()
}

export const searchProducts = async (
  keyword: string,
  page: number = 0,
  size: number = 20
): Promise<PageResponse<Product>> => {
  const response = await fetch(
    `${API_BASE_URL}/products/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to search products')
  }

  return await response.json()
}

export const getProductsByPriceRange = async (
  minPrice: number,
  maxPrice: number,
  page: number = 0,
  size: number = 20
): Promise<PageResponse<Product>> => {
  const response = await fetch(
    `${API_BASE_URL}/products/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}&page=${page}&size=${size}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch products by price range')
  }

  return await response.json()
}

export const createProduct = async (
  merchantId: number,
  data: CreateProductRequest
): Promise<Product> => {
  const response = await fetch(
    `${API_BASE_URL}/products?merchantId=${merchantId}`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create product')
  }

  return await response.json()
}

export const updateProduct = async (
  id: number,
  merchantId: number,
  data: UpdateProductRequest
): Promise<Product> => {
  const response = await fetch(
    `${API_BASE_URL}/products/${id}?merchantId=${merchantId}`,
    {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update product')
  }

  return await response.json()
}

export const deleteProduct = async (
  id: number,
  merchantId: number
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/products/${id}?merchantId=${merchantId}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to delete product')
  }
}

export const updateProductStock = async (
  id: number,
  quantity: number
): Promise<Product> => {
  const response = await fetch(
    `${API_BASE_URL}/products/${id}/stock?quantity=${quantity}`,
    {
      method: 'PATCH',
      headers: getAuthHeaders(),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update stock')
  }

  return await response.json()
}

export const toggleProductStatus = async (
  id: number,
  merchantId: number
): Promise<Product> => {
  const response = await fetch(
    `${API_BASE_URL}/products/${id}/toggle-status?merchantId=${merchantId}`,
    {
      method: 'PATCH',
      headers: getAuthHeaders(),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to toggle product status')
  }

  return await response.json()
}
