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
    // TODO: 实现添加到购物车功能
    alert(`已将 ${product.name} 添加到购物车`)
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
          <div className={styles.outOfStock}>缺货</div>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.footer}>
          <div className={styles.priceSection}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
            {product.stock > 0 && (
              <span className={styles.stock}>库存: {product.stock}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className={styles.addButton}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? '缺货' : '加入购物车'}
          </button>
        </div>
      </div>
    </Link>
  )
}

