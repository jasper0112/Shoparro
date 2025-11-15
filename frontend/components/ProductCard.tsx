'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Product } from '@/lib/api'
import { addToCart } from '@/lib/cart'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.stock === 0 || product.status !== 'ACTIVE') {
      alert('This product is currently unavailable')
      return
    }

    addToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.imageUrl,
      price: product.price,
      stock: product.stock,
      merchantId: product.merchantId,
      merchantName: product.merchantName,
    })

    // Show confirmation and optionally navigate to cart
    if (confirm(`${product.name} added to cart! Go to cart?`)) {
      router.push('/cart')
    }
  }

  return (
    <Link href={`/products/${product.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholderImage}>
            <span>📦</span>
          </div>
        )}
        {product.stock === 0 && (
          <div className={styles.outOfStock}>Out of stock</div>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{product.name}</h3>
        {product.description && (
          <p className={styles.description}>{product.description}</p>
        )}
        {product.brand && (
          <p className={styles.brand}>Brand: {product.brand}</p>
        )}
        <div className={styles.footer}>
          <div className={styles.priceSection}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</span>
            )}
            {product.stock > 0 && (
              <span className={styles.stock}>Stock: {product.stock}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className={styles.addButton}
            disabled={product.stock === 0 || product.status !== 'ACTIVE'}
          >
            {product.stock === 0 || product.status !== 'ACTIVE' 
              ? 'Unavailable' 
              : 'Add to cart'}
          </button>
        </div>
      </div>
    </Link>
  )
}

