'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { isAuthenticated, getUser } from '@/lib/auth'
import {
  getCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  getCartTotal,
  getCartItemCount,
  type CartItem,
} from '@/lib/cart'
import { createOrder, type PaymentMethod } from '@/lib/api'
import styles from './cart.module.css'

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkoutData, setCheckoutData] = useState({
    shippingName: '',
    shippingPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingPostcode: '',
    shippingCountry: 'Australia',
    paymentMethod: 'CREDIT_CARD' as PaymentMethod,
    notes: '',
  })

  useEffect(() => {
    const authed = isAuthenticated()
    setAuthChecked(true)
    if (!authed) {
      router.push('/login')
      return
    }

    loadCart()
  }, [router])

  const loadCart = () => {
    const cart = getCart()
    setCartItems(cart)
  }

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId)
    loadCart()
  }

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    updateCartItemQuantity(productId, newQuantity)
    loadCart()
  }

  const handleCheckout = async () => {
    const currentUser = getUser()
    if (!currentUser || !currentUser.id) {
      alert('Please login to checkout')
      return
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty')
      return
    }

    setLoading(true)
    try {
      const orderData = {
        userId: currentUser.id,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          notes: item.notes,
        })),
        paymentMethod: checkoutData.paymentMethod,
        shippingName: checkoutData.shippingName || currentUser.firstName + ' ' + currentUser.lastName || currentUser.username,
        shippingPhone: checkoutData.shippingPhone || currentUser.phone || '',
        shippingAddress: checkoutData.shippingAddress || currentUser.address || '',
        shippingCity: checkoutData.shippingCity || currentUser.city || '',
        shippingPostcode: checkoutData.shippingPostcode || currentUser.postcode || '',
        shippingCountry: checkoutData.shippingCountry || currentUser.country || 'Australia',
        notes: checkoutData.notes,
      }

      const order = await createOrder(orderData)
      
      // Clear cart after successful order
      clearCart()
      
      // Redirect to order confirmation
      router.push(`/orders/${order.id}`)
    } catch (error: any) {
      alert(error.message || 'Failed to create order. Please try again.')
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(amount)
  }

  const subtotal = getCartTotal()
  const shippingFee = subtotal > 100 ? 0 : 10 // Free shipping over $100
  const taxAmount = subtotal * 0.1 // 10% GST
  const total = subtotal + shippingFee + taxAmount

  if (!authChecked) {
    return null
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Shopping Cart</h1>
            <p className={styles.subtitle}>
              {cartItems.length === 0
                ? 'Your cart is empty'
                : `${getCartItemCount()} item${getCartItemCount() !== 1 ? 's' : ''} in your cart`}
            </p>
          </header>

          {cartItems.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🛒</div>
              <h2>Your cart is empty</h2>
              <p>Start shopping to add items to your cart.</p>
              <Link href="/products" className={styles.shopButton}>
                Browse Products
              </Link>
            </div>
          ) : (
            <div className={styles.content}>
              <div className={styles.cartItems}>
                <div className={styles.itemsHeader}>
                  <h2>Items</h2>
                  <button onClick={clearCart} className={styles.clearButton}>
                    Clear Cart
                  </button>
                </div>

                {cartItems.map((item) => (
                  <div key={item.productId} className={styles.cartItem}>
                    <Link href={`/products/${item.productId}`} className={styles.itemImage}>
                      {item.productImage ? (
                        <img src={item.productImage} alt={item.productName} />
                      ) : (
                        <div className={styles.placeholderImage}>📦</div>
                      )}
                    </Link>

                    <div className={styles.itemInfo}>
                      <Link href={`/products/${item.productId}`}>
                        <h3 className={styles.itemName}>{item.productName}</h3>
                      </Link>
                      {item.merchantName && (
                        <p className={styles.itemMerchant}>Sold by: {item.merchantName}</p>
                      )}
                      <p className={styles.itemPrice}>{formatCurrency(item.price)} each</p>
                    </div>

                    <div className={styles.itemQuantity}>
                      <label htmlFor={`qty-${item.productId}`}>Quantity:</label>
                      <div className={styles.quantityControls}>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          className={styles.quantityButton}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          id={`qty-${item.productId}`}
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1
                            handleQuantityChange(item.productId, val)
                          }}
                          min="1"
                          max={item.stock}
                          className={styles.quantityInput}
                        />
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          className={styles.quantityButton}
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                      <p className={styles.stockInfo}>
                        {item.stock} available
                      </p>
                    </div>

                    <div className={styles.itemTotal}>
                      <p className={styles.itemTotalPrice}>
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className={styles.removeButton}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.summary}>
                <div className={styles.summaryCard}>
                  <h2 className={styles.summaryTitle}>Order Summary</h2>
                  <div className={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Shipping</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className={styles.freeShipping}>FREE</span>
                      ) : (
                        formatCurrency(shippingFee)
                      )}
                    </span>
                  </div>
                  {shippingFee > 0 && subtotal < 100 && (
                    <p className={styles.shippingNote}>
                      Add {formatCurrency(100 - subtotal)} more for free shipping!
                    </p>
                  )}
                  <div className={styles.summaryRow}>
                    <span>Tax (GST)</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                  <div className={styles.summaryTotal}>
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowCheckout(true)}
                  className={styles.checkoutButton}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Proceed to Checkout'}
                </button>

                <Link href="/products" className={styles.continueShopping}>
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}

          {showCheckout && (
            <div className={styles.modalOverlay} onClick={() => setShowCheckout(false)}>
              <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2>Checkout</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleCheckout()
                  }}
                  className={styles.checkoutForm}
                >
                  <div className={styles.formSection}>
                    <h3>Shipping Information</h3>
                    <div className={styles.formRow}>
                      <label>
                        Full Name *
                        <input
                          type="text"
                          value={checkoutData.shippingName}
                          onChange={(e) =>
                            setCheckoutData({ ...checkoutData, shippingName: e.target.value })
                          }
                          required
                          placeholder="Enter your full name"
                        />
                      </label>
                    </div>

                    <div className={styles.formRow}>
                      <label>
                        Phone Number *
                        <input
                          type="tel"
                          value={checkoutData.shippingPhone}
                          onChange={(e) =>
                            setCheckoutData({ ...checkoutData, shippingPhone: e.target.value })
                          }
                          required
                          placeholder="+61 400 000 000"
                        />
                      </label>
                    </div>

                    <div className={styles.formRow}>
                      <label>
                        Address *
                        <input
                          type="text"
                          value={checkoutData.shippingAddress}
                          onChange={(e) =>
                            setCheckoutData({ ...checkoutData, shippingAddress: e.target.value })
                          }
                          required
                          placeholder="Street address"
                        />
                      </label>
                    </div>

                    <div className={styles.formGrid}>
                      <div className={styles.formRow}>
                        <label>
                          City *
                          <input
                            type="text"
                            value={checkoutData.shippingCity}
                            onChange={(e) =>
                              setCheckoutData({ ...checkoutData, shippingCity: e.target.value })
                            }
                            required
                            placeholder="City"
                          />
                        </label>
                      </div>

                      <div className={styles.formRow}>
                        <label>
                          Postcode *
                          <input
                            type="text"
                            value={checkoutData.shippingPostcode}
                            onChange={(e) =>
                              setCheckoutData({
                                ...checkoutData,
                                shippingPostcode: e.target.value,
                              })
                            }
                            required
                            placeholder="Postcode"
                          />
                        </label>
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <label>
                        Country *
                        <input
                          type="text"
                          value={checkoutData.shippingCountry}
                          onChange={(e) =>
                            setCheckoutData({ ...checkoutData, shippingCountry: e.target.value })
                          }
                          required
                        />
                      </label>
                    </div>
                  </div>

                  <div className={styles.formSection}>
                    <h3>Payment Method</h3>
                    <div className={styles.formRow}>
                      <label>
                        Payment Method *
                        <select
                          value={checkoutData.paymentMethod}
                          onChange={(e) =>
                            setCheckoutData({
                              ...checkoutData,
                              paymentMethod: e.target.value as PaymentMethod,
                            })
                          }
                          required
                        >
                          <option value="CREDIT_CARD">Credit Card</option>
                          <option value="DEBIT_CARD">Debit Card</option>
                          <option value="PAYPAL">PayPal</option>
                          <option value="WECHAT_PAY">WeChat Pay</option>
                          <option value="ALIPAY">Alipay</option>
                          <option value="BANK_TRANSFER">Bank Transfer</option>
                          <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
                        </select>
                      </label>
                    </div>
                  </div>

                  <div className={styles.formSection}>
                    <h3>Additional Notes</h3>
                    <div className={styles.formRow}>
                      <label>
                        Order Notes (Optional)
                        <textarea
                          value={checkoutData.notes}
                          onChange={(e) =>
                            setCheckoutData({ ...checkoutData, notes: e.target.value })
                          }
                          rows={3}
                          placeholder="Special delivery instructions, etc."
                          maxLength={1000}
                        />
                      </label>
                    </div>
                  </div>

                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                    <button type="submit" disabled={loading} className={styles.submitButton}>
                      {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

