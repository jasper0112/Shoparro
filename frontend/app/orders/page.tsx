'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { getUser, isAuthenticated } from '@/lib/auth'
import { getOrdersByUser, type Order } from '@/lib/api'
import styles from './orders.module.css'

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const authed = isAuthenticated()
    setAuthChecked(true)
    if (!authed) {
      router.push('/login')
      return
    }

    const loadOrders = async () => {
      const currentUser = getUser()
      if (currentUser && currentUser.id) {
        try {
          setLoading(true)
          const response = await getOrdersByUser(currentUser.id, currentPage, 20)
          setOrders(response.content)
          setTotalPages(response.totalPages)
          setError(null)
        } catch (err: any) {
          setError(err.message || 'Failed to load orders')
          console.error('Error loading orders:', err)
        } finally {
          setLoading(false)
        }
      }
    }

    loadOrders()
  }, [router, currentPage])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
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

  if (!authChecked) {
    return null
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>My Orders</h1>
            <p className={styles.subtitle}>View and manage your order history</p>
          </header>

          {error && (
            <div className={styles.errorMessage}>
              <p>{error}</p>
            </div>
          )}

          {loading ? (
            <div className={styles.loading}>
              <p>Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📦</div>
              <h2>No orders yet</h2>
              <p>You haven't placed any orders. Start shopping to see your orders here.</p>
              <Link href="/" className={styles.shopButton}>
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className={styles.ordersList}>
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className={styles.orderCard}
                  >
                    <div className={styles.orderHeader}>
                      <div className={styles.orderInfo}>
                        <h3 className={styles.orderNumber}>
                          Order #{order.orderNumber}
                        </h3>
                        <p className={styles.orderDate}>
                          {formatDate(order.orderDate)}
                        </p>
                      </div>
                      <div className={styles.orderMeta}>
                        <span className={`${styles.statusBadge} ${getStatusBadgeClass(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                        <span className={styles.orderTotal}>
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>
                    </div>

                    <div className={styles.orderItems}>
                      <p className={styles.itemsCount}>
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                      <div className={styles.itemsPreview}>
                        {order.items.slice(0, 3).map((item, index) => (
                          <span key={item.id} className={styles.itemName}>
                            {item.productName}
                            {item.quantity > 1 && ` × ${item.quantity}`}
                            {index < Math.min(order.items.length, 3) - 1 && ', '}
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <span className={styles.moreItems}>
                            {' '}and {order.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {order.trackingNumber && (
                      <div className={styles.trackingInfo}>
                        <span className={styles.trackingLabel}>Tracking:</span>
                        <span className={styles.trackingNumber}>{order.trackingNumber}</span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className={styles.pageButton}
                  >
                    Previous
                  </button>
                  <span className={styles.pageInfo}>
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className={styles.pageButton}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  )
}

