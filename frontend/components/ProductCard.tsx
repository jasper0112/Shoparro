'use client'

import Link from 'next/link'
import type { Product } from '@/lib/api'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    // TODO: Implement add-to-cart functionality
    alert(`Added ${product.name} to the cart`)
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
        <p className={styles.description}>{product.description}</p>
        <div className={styles.footer}>
          <div className={styles.priceSection}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
            {product.stock > 0 && (
              <span className={styles.stock}>Stock: {product.stock}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className={styles.addButton}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
          </button>
        </div>
      </div>
    </Link>
  )
}

