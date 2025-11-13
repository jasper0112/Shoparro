'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ProductCard from '@/components/ProductCard'
import Carousel from '@/components/Carousel'
import { isAuthenticated } from '@/lib/auth'
import { fetchProducts, type Product } from '@/lib/api'
import styles from './page.module.css'

export default function Home() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    // Load the product list
    loadProducts()
  }, [router])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await fetchProducts()
      setProducts(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated()) {
    return null // Wait for redirect
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Welcome to Southside Cart</h1>
            <p className={styles.subtitle}>
              Discover quality products and enjoy shopping
            </p>
          </div>

          <Carousel />

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p>{error}</p>
              <button onClick={loadProducts} className={styles.retryButton}>
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className={styles.empty}>
              <p>No products available</p>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

