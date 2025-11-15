// Shopping cart utility functions using localStorage

export interface CartItem {
  productId: number
  productName: string
  productImage?: string
  price: number
  quantity: number
  stock: number
  merchantId?: number
  merchantName?: string
  notes?: string
}

const CART_STORAGE_KEY = 'southside_cart'

export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return []
  try {
    const cartStr = localStorage.getItem(CART_STORAGE_KEY)
    if (!cartStr) return []
    return JSON.parse(cartStr)
  } catch {
    return []
  }
}

export const saveCart = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch (error) {
    console.error('Error saving cart:', error)
  }
}

export const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }): void => {
  const cart = getCart()
  const existingItemIndex = cart.findIndex(
    (cartItem) => cartItem.productId === item.productId
  )

  if (existingItemIndex >= 0) {
    // Update quantity if item already exists
    const newQuantity = (cart[existingItemIndex].quantity + (item.quantity || 1))
    const maxQuantity = Math.min(newQuantity, item.stock)
    cart[existingItemIndex].quantity = maxQuantity
  } else {
    // Add new item
    cart.push({
      ...item,
      quantity: item.quantity || 1,
    })
  }

  saveCart(cart)
}

export const removeFromCart = (productId: number): void => {
  const cart = getCart()
  const filteredCart = cart.filter((item) => item.productId !== productId)
  saveCart(filteredCart)
}

export const updateCartItemQuantity = (productId: number, quantity: number): void => {
  const cart = getCart()
  const itemIndex = cart.findIndex((item) => item.productId === productId)

  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      removeFromCart(productId)
    } else {
      // Update quantity (don't exceed stock)
      const maxQuantity = Math.min(quantity, cart[itemIndex].stock)
      cart[itemIndex].quantity = maxQuantity
      saveCart(cart)
    }
  }
}

export const clearCart = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CART_STORAGE_KEY)
}

export const getCartItemCount = (): number => {
  const cart = getCart()
  return cart.reduce((total, item) => total + item.quantity, 0)
}

export const getCartTotal = (): number => {
  const cart = getCart()
  return cart.reduce((total, item) => total + item.price * item.quantity, 0)
}

export const getCartSubtotal = (): number => {
  return getCartTotal()
}

export const isProductInCart = (productId: number): boolean => {
  const cart = getCart()
  return cart.some((item) => item.productId === productId)
}

export const getCartItem = (productId: number): CartItem | undefined => {
  const cart = getCart()
  return cart.find((item) => item.productId === productId)
}

