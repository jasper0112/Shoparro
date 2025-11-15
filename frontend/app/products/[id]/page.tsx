'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { isAuthenticated, getUser } from '@/lib/auth'
import { getProductById, type Product } from '@/lib/api'
import { addToCart } from '@/lib/cart'
import styles from './product-detail.module.css'

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params?.id ? Number(params.id) : null

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    const authed = isAuthenticated()
    setAuthChecked(true)
    if (!authed) {
      router.push('/login')
      return
    }

    if (!productId) {
      setError('Invalid product ID')
      setLoading(false)
      return
    }

    const loadProduct = async () => {
      try {
        setLoading(true)
        const productData = await getProductById(productId)
        setProduct(productData)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Failed to load product')
        console.error('Error loading product:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [router, productId])

  const handleAddToCart = () => {
    if (!product) return

    if (product.stock === 0 || product.status !== 'ACTIVE') {
      alert('This product is currently unavailable')
      return
    }

    if (quantity > product.stock) {
      alert(`Only ${product.stock} items available in stock`)
      setQuantity(product.stock)
      return
    }

    addToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.imageUrl,
      price: product.price,
      stock: product.stock,
      quantity: quantity,
      merchantId: product.merchantId,
      merchantName: product.merchantName,
    })

    if (confirm(`${quantity} x ${product.name} added to cart! Go to cart?`)) {
      router.push('/cart')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(amount)
  }

  const getImageUrls = (): string[] => {
    if (!product) return []
    const urls: string[] = []
    if (product.imageUrl) urls.push(product.imageUrl)
    if (product.imageUrls) {
      const additionalUrls = product.imageUrls.split(',').map(url => url.trim()).filter(Boolean)
      urls.push(...additionalUrls)
    }
    return urls.length > 0 ? urls : []
  }

  const images = getImageUrls()
  const displayImage = images[selectedImageIndex] || product?.imageUrl

  if (!authChecked) {
    return null
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <Link href="/products" className={styles.backLink}>
            ← Back to Products
          </Link>

          {error && (
            <div className={styles.errorMessage}>
              <p>{error}</p>
            </div>
          )}

          {loading ? (
            <div className={styles.loading}>
              <p>Loading product details...</p>
            </div>
          ) : product ? (
            <div className={styles.productContent}>
              <div className={styles.imageSection}>
                {displayImage ? (
                  <div className={styles.mainImageContainer}>
                    <img
                      src={displayImage}
                      alt={product.name}
                      className={styles.mainImage}
                    />
                  </div>
                ) : (
                  <div className={styles.placeholderImage}>
                    <span>📦</span>
                  </div>
                )}
                {images.length > 1 && (
                  <div className={styles.thumbnailList}>
                    {images.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`${styles.thumbnail} ${selectedImageIndex === index ? styles.active : ''}`}
                      >
                        <img src={url} alt={`${product.name} ${index + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.infoSection}>
                <div className={styles.header}>
                  <h1 className={styles.title}>{product.name}</h1>
                  {product.brand && (
                    <p className={styles.brand}>Brand: {product.brand}</p>
                  )}
                  {product.merchantName && (
                    <p className={styles.merchant}>Sold by: {product.merchantName}</p>
                  )}
                </div>

                <div className={styles.priceSection}>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>{formatCurrency(product.price)}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <>
                        <span className={styles.originalPrice}>
                          {formatCurrency(product.originalPrice)}
                        </span>
                        <span className={styles.discount}>
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>
                  {product.unit && (
                    <p className={styles.unit}>Per {product.unit}</p>
                  )}
                </div>

                {product.description && (
                  <div className={styles.description}>
                    <h2 className={styles.sectionTitle}>Description</h2>
                    <p>{product.description}</p>
                  </div>
                )}

                <div className={styles.details}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>SKU:</span>
                    <span className={styles.detailValue}>{product.sku || 'N/A'}</span>
                  </div>
                  {product.category && (
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Category:</span>
                      <span className={styles.detailValue}>{product.category}</span>
                    </div>
                  )}
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Status:</span>
                    <span className={`${styles.statusBadge} ${styles[product.status.toLowerCase()]}`}>
                      {product.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  {product.rating && product.rating > 0 && (
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Rating:</span>
                      <span className={styles.detailValue}>
                        ⭐ {product.rating.toFixed(1)} ({product.reviewCount || 0} reviews)
                      </span>
                    </div>
                  )}
                  {product.salesCount && product.salesCount > 0 && (
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Sales:</span>
                      <span className={styles.detailValue}>{product.salesCount} sold</span>
                    </div>
                  )}
                </div>

                {product.specifications && (
                  <div className={styles.specifications}>
                    <h2 className={styles.sectionTitle}>Specifications</h2>
                    <pre className={styles.specsContent}>{product.specifications}</pre>
                  </div>
                )}

                <div className={styles.purchaseSection}>
                  <div className={styles.stockInfo}>
                    {product.stock > 0 ? (
                      <span className={styles.inStock}>
                        ✓ In Stock ({product.stock} available)
                      </span>
                    ) : (
                      <span className={styles.outOfStock}>✗ Out of Stock</span>
                    )}
                  </div>

                  {product.stock > 0 && (
                    <div className={styles.quantitySelector}>
                      <label htmlFor="quantity" className={styles.quantityLabel}>
                        Quantity:
                      </label>
                      <div className={styles.quantityControls}>
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className={styles.quantityButton}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          id="quantity"
                          value={quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1
                            setQuantity(Math.max(1, Math.min(val, product.stock)))
                          }}
                          min="1"
                          max={product.stock}
                          className={styles.quantityInput}
                        />
                        <button
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          className={styles.quantityButton}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  <div className={styles.actionButtons}>
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className={styles.addToCartButton}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                    <button
                      onClick={() => {
                        handleAddToCart()
                        router.push('/cart')
                      }}
                      className={styles.buyNowButton}
                      disabled={product.stock === 0}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Product not found</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

