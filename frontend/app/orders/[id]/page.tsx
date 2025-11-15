'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { getUser, isAuthenticated } from '@/lib/auth'
import { getOrderById, cancelOrder, type Order } from '@/lib/api'
import styles from './order-detail.module.css'

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params?.id ? Number(params.id) : null

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  useEffect(() => {
    const authed = isAuthenticated()
    setAuthChecked(true)
    if (!authed) {
      router.push('/login')
      return
    }

    if (!orderId) {
      setError('Invalid order ID')
      setLoading(false)
      return
    }

    const loadOrder = async () => {
      try {
        setLoading(true)
        const orderData = await getOrderById(orderId)
        setOrder(orderData)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Failed to load order')
        console.error('Error loading order:', err)
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [router, orderId])

  const handleCancel = async () => {
    if (!order || !cancelReason.trim()) {
      return
    }

    const currentUser = getUser()
    if (!currentUser || !currentUser.id) {
      setError('User not found')
      return
    }

    setCancelling(true)
    try {
      const cancelledOrder = await cancelOrder(order.id, currentUser.id, cancelReason)
      setOrder(cancelledOrder)
      setShowCancelModal(false)
      setCancelReason('')
    } catch (err: any) {
      setError(err.message || 'Failed to cancel order')
    } finally {
      setCancelling(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(amount)
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return styles.statusCompleted
      case 'SHIPPED':
      case 'DELIVERED':
        return styles.statusShipped
      case 'PROCESSING':
        return styles.statusProcessing
      case 'PENDING_PAYMENT':
        return styles.statusPending
      case 'CANCELLED':
      case 'REFUNDED':
        return styles.statusCancelled
      default:
        return styles.statusDefault
    }
  }

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const canCancel = order && 
    order.status !== 'CANCELLED' && 
    order.status !== 'SHIPPED' && 
    order.status !== 'DELIVERED' && 
    order.status !== 'COMPLETED'

  if (!authChecked) {
    return null
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <Link href="/orders" className={styles.backLink}>
            ← Back to Orders
          </Link>

          {error && (
            <div className={styles.errorMessage}>
              <p>{error}</p>
            </div>
          )}

          {loading ? (
            <div className={styles.loading}>
              <p>Loading order details...</p>
            </div>
          ) : order ? (
            <>
              <header className={styles.header}>
                <div>
                  <h1 className={styles.title}>Order #{order.orderNumber}</h1>
                  <p className={styles.orderDate}>Placed on {formatDate(order.orderDate)}</p>
                </div>
                <div className={styles.headerActions}>
                  <span className={`${styles.statusBadge} ${getStatusBadgeClass(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  {canCancel && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className={styles.cancelButton}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </header>

              <div className={styles.content}>
                <div className={styles.mainContent}>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Order Items</h2>
                    <div className={styles.itemsList}>
                      {order.items.map((item) => (
                        <div key={item.id} className={styles.itemCard}>
                          <div className={styles.itemInfo}>
                            <h3 className={styles.itemName}>{item.productName}</h3>
                            <p className={styles.itemSku}>SKU: {item.productSku}</p>
                            {item.merchantName && (
                              <p className={styles.itemMerchant}>Sold by: {item.merchantName}</p>
                            )}
                            {item.notes && (
                              <p className={styles.itemNotes}>Note: {item.notes}</p>
                            )}
                          </div>
                          <div className={styles.itemPricing}>
                            <p className={styles.itemQuantity}>Quantity: {item.quantity}</p>
                            <p className={styles.itemUnitPrice}>
                              {formatCurrency(item.unitPrice)} each
                            </p>
                            <p className={styles.itemTotalPrice}>
                              {formatCurrency(item.totalPrice)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {order.notes && (
                    <section className={styles.section}>
                      <h2 className={styles.sectionTitle}>Order Notes</h2>
                      <p className={styles.notes}>{order.notes}</p>
                    </section>
                  )}

                  {order.cancellationReason && (
                    <section className={styles.section}>
                      <h2 className={styles.sectionTitle}>Cancellation Reason</h2>
                      <p className={styles.cancellationReason}>{order.cancellationReason}</p>
                      <p className={styles.cancelledDate}>
                        Cancelled on {formatDate(order.cancelledDate)}
                      </p>
                    </section>
                  )}
                </div>

                <div className={styles.sidebar}>
                  <section className={styles.summaryCard}>
                    <h2 className={styles.summaryTitle}>Order Summary</h2>
                    <div className={styles.summaryRow}>
                      <span>Subtotal</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    {order.shippingFee > 0 && (
                      <div className={styles.summaryRow}>
                        <span>Shipping</span>
                        <span>{formatCurrency(order.shippingFee)}</span>
                      </div>
                    )}
                    {order.taxAmount > 0 && (
                      <div className={styles.summaryRow}>
                        <span>Tax</span>
                        <span>{formatCurrency(order.taxAmount)}</span>
                      </div>
                    )}
                    {order.discountAmount > 0 && (
                      <div className={styles.summaryRow}>
                        <span>Discount</span>
                        <span className={styles.discount}>-{formatCurrency(order.discountAmount)}</span>
                      </div>
                    )}
                    <div className={styles.summaryTotal}>
                      <span>Total</span>
                      <span>{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </section>

                  <section className={styles.infoCard}>
                    <h2 className={styles.infoTitle}>Payment Information</h2>
                    <div className={styles.infoRow}>
                      <span>Status</span>
                      <span className={styles.paymentStatus}>{order.paymentStatus}</span>
                    </div>
                    {order.paymentMethod && (
                      <div className={styles.infoRow}>
                        <span>Method</span>
                        <span>{order.paymentMethod.replace(/_/g, ' ')}</span>
                      </div>
                    )}
                    {order.paymentReference && (
                      <div className={styles.infoRow}>
                        <span>Reference</span>
                        <span>{order.paymentReference}</span>
                      </div>
                    )}
                    {order.paymentDate && (
                      <div className={styles.infoRow}>
                        <span>Paid on</span>
                        <span>{formatDate(order.paymentDate)}</span>
                      </div>
                    )}
                  </section>

                  <section className={styles.infoCard}>
                    <h2 className={styles.infoTitle}>Shipping Information</h2>
                    {order.shippingName && (
                      <div className={styles.infoRow}>
                        <span>Name</span>
                        <span>{order.shippingName}</span>
                      </div>
                    )}
                    {order.shippingPhone && (
                      <div className={styles.infoRow}>
                        <span>Phone</span>
                        <span>{order.shippingPhone}</span>
                      </div>
                    )}
                    {order.shippingAddress && (
                      <div className={styles.shippingAddress}>
                        <p>{order.shippingAddress}</p>
                        <p>
                          {order.shippingCity}
                          {order.shippingPostcode && `, ${order.shippingPostcode}`}
                        </p>
                        {order.shippingCountry && <p>{order.shippingCountry}</p>}
                      </div>
                    )}
                    {order.shippingProvider && (
                      <div className={styles.infoRow}>
                        <span>Provider</span>
                        <span>{order.shippingProvider}</span>
                      </div>
                    )}
                    {order.trackingNumber && (
                      <div className={styles.infoRow}>
                        <span>Tracking</span>
                        <span className={styles.trackingNumber}>{order.trackingNumber}</span>
                      </div>
                    )}
                    {order.shippedDate && (
                      <div className={styles.infoRow}>
                        <span>Shipped on</span>
                        <span>{formatDate(order.shippedDate)}</span>
                      </div>
                    )}
                    {order.deliveredDate && (
                      <div className={styles.infoRow}>
                        <span>Delivered on</span>
                        <span>{formatDate(order.deliveredDate)}</span>
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>Order not found</p>
            </div>
          )}

          {showCancelModal && (
            <div className={styles.modalOverlay} onClick={() => setShowCancelModal(false)}>
              <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2>Cancel Order</h2>
                <p>Please provide a reason for cancelling this order:</p>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter cancellation reason..."
                  className={styles.cancelTextarea}
                  rows={4}
                />
                <div className={styles.modalActions}>
                  <button
                    onClick={() => {
                      setShowCancelModal(false)
                      setCancelReason('')
                    }}
                    className={styles.modalButtonSecondary}
                  >
                    Close
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={!cancelReason.trim() || cancelling}
                    className={styles.modalButtonPrimary}
                  >
                    {cancelling ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

