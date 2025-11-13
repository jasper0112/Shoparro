'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ProductCard from '@/components/ProductCard'
import PromoSlider from '@/components/PromoSlider'
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
    // 检查用户是否已登录
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    // 加载产品列表
    loadProducts()
  }, [router])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await fetchProducts()
      setProducts(data)
    } catch (err: any) {
      setError(err.message || '加载产品失败')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated()) {
    return null // 等待重定向
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>欢迎来到 Shoparro</h1>
            <p className={styles.subtitle}>
              发现优质产品，享受购物乐趣
            </p>
          </div>

          <Carousel />

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>加载中...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p>{error}</p>
              <button onClick={loadProducts} className={styles.retryButton}>
                重试
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className={styles.empty}>
              <p>暂无产品</p>
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
      <PromoSlider />
    </>
  )
}

