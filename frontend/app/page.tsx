'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ProductCard from '@/components/ProductCard'
import Carousel from '@/components/Carousel'
import { isAuthenticated } from '@/lib/auth'
import { fetchProducts, type Product } from '@/lib/api'
import styles from './page.module.css'

const QUICK_FILTERS = [
  { id: 'all', label: 'All products' },
  { id: 'in-stock', label: 'In stock' },
  { id: 'low-stock', label: 'Low stock' },
  { id: 'sold-out', label: 'Out of stock' },
]

const CURATED_CATEGORIES = [
  {
    id: 'living',
    title: 'Home & Living',
    description: 'Furniture, decor, and essentials to elevate every room.',
  },
  {
    id: 'fashion',
    title: 'Fashion & Apparel',
    description: 'Seasonal styles, loungewear, and everyday fits.',
  },
  {
    id: 'tech',
    title: 'Tech & Gadgets',
    description: 'Smart devices, accessories, and remote work must-haves.',
  },
  {
    id: 'wellness',
    title: 'Health & Wellness',
    description: 'Supplements, fitness gear, and self-care favorites.',
  },
]

const SHOPPING_BENEFITS = [
  {
    id: 'shipping',
    title: 'Fast shipping',
    description: 'Same-day dispatch on orders placed before 3 PM.',
  },
  {
    id: 'support',
    title: 'Dedicated support',
    description: 'Real people ready to help you 7 days a week.',
  },
  {
    id: 'secure',
    title: 'Secure checkout',
    description: '256-bit encrypted payments with buyer protection.',
  },
]

export default function Home() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [authChecked, setAuthChecked] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    const authed = isAuthenticated()
    setIsAuthed(authed)
    setAuthChecked(true)
    if (!authed) {
      router.push('/login')
      return
    }
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

  const metrics = useMemo(() => {
    if (products.length === 0) {
      return [
        { id: 'catalog', label: 'Products live', value: '0' },
        { id: 'inventory', label: 'Units in stock', value: '0' },
        { id: 'low', label: 'Low inventory', value: '0' },
      ]
    }

    const inStock = products.filter((product) => product.stock > 0)
    const lowStock = inStock.filter((product) => product.stock <= 5)
    const totalUnits = products.reduce((total, product) => total + product.stock, 0)

    return [
      {
        id: 'catalog',
        label: 'Products live',
        value: products.length.toString(),
      },
      {
        id: 'inventory',
        label: 'Units in stock',
        value: totalUnits.toLocaleString(),
      },
      {
        id: 'low',
        label: 'Low inventory',
        value: lowStock.length.toString(),
      },
    ]
  }, [products])

  const filteredProducts = useMemo(() => {
    switch (activeFilter) {
      case 'in-stock':
        return products.filter((product) => product.stock > 0)
      case 'low-stock':
        return products.filter((product) => product.stock > 0 && product.stock <= 5)
      case 'sold-out':
        return products.filter((product) => product.stock === 0)
      case 'all':
      default:
        return products
    }
  }, [activeFilter, products])

  const curatedProductSections = useMemo(() => {
    if (products.length === 0) {
      return []
    }

    const featured = products.slice(0, 4)
    const trending = products.slice(4, 8)
    const justRestocked = products
      .filter((product) => product.stock > 5)
      .slice(0, 4)

    return [
      {
        id: 'featured',
        title: 'Featured picks',
        subtitle: 'Hand-selected standouts to start your shopping journey.',
        items: featured,
      },
      {
        id: 'trending',
        title: 'Trending now',
        subtitle: 'Popular with shoppers this week across Southside Cart.',
        items: trending,
      },
      {
        id: 'restocked',
        title: 'Freshly restocked',
        subtitle: 'Back on the shelves and ready to ship today.',
        items: justRestocked,
      },
    ].filter((section) => section.items.length > 0)
  }, [products])

  const isReady = authChecked && isAuthed

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

          {isReady && <Carousel />}

          {!isReady ? null : loading ? (
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
            <>
              <section className={styles.topSection}>
                <div className={styles.metrics}>
                  {metrics.map((metric) => (
                    <article key={metric.id} className={styles.metricCard}>
                      <span className={styles.metricLabel}>{metric.label}</span>
                      <strong className={styles.metricValue}>{metric.value}</strong>
                    </article>
                  ))}
                </div>

                <div className={styles.categoriesSection}>
                  <header className={styles.sectionHeader}>
                    <div>
                      <h2 className={styles.sectionTitle}>Shop by category</h2>
                      <p className={styles.sectionSubtitle}>
                        Jump straight into curated collections tailored to every lifestyle.
                      </p>
                    </div>
                  </header>
                  <div className={styles.categoriesGrid}>
                    {CURATED_CATEGORIES.map((category) => (
                      <article key={category.id} className={styles.categoryCard}>
                        <h3 className={styles.categoryTitle}>{category.title}</h3>
                        <p className={styles.categoryDescription}>{category.description}</p>
                        <button type="button" className={styles.categoryCta}>
                          Explore {category.title}
                        </button>
                      </article>
                    ))}
                  </div>
                </div>
              </section>

              <section className={styles.benefits}>
                {SHOPPING_BENEFITS.map((benefit) => (
                  <article key={benefit.id} className={styles.benefitCard}>
                    <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                    <p className={styles.benefitDescription}>{benefit.description}</p>
                  </article>
                ))}
              </section>

              <section className={styles.filterBar}>
                <div>
                  <h2 className={styles.sectionTitle}>Browse the catalog</h2>
                  <p className={styles.sectionSubtitle}>
                    Use quick filters to navigate inventory based on availability.
                  </p>
                </div>
                <div className={styles.filterButtons}>
                  {QUICK_FILTERS.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setActiveFilter(filter.id)}
                      className={`${styles.filterButton} ${
                        activeFilter === filter.id ? styles.filterButtonActive : ''
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </section>

              {curatedProductSections.map((section) => (
                <section key={section.id} className={styles.section}>
                  <header className={styles.sectionHeader}>
                    <div>
                      <h2 className={styles.sectionTitle}>{section.title}</h2>
                      <p className={styles.sectionSubtitle}>{section.subtitle}</p>
                    </div>
                    <button type="button" className={styles.sectionCta}>
                      View all
                    </button>
                  </header>
                  <div className={styles.sectionGrid}>
                    {section.items.map((product) => (
                      <ProductCard key={`${section.id}-${product.id}`} product={product} />
                    ))}
                  </div>
                </section>
              ))}

              <section className={styles.section}>
                <header className={styles.sectionHeader}>
                  <div>
                    <h2 className={styles.sectionTitle}>All products</h2>
                    <p className={styles.sectionSubtitle}>
                      Comprehensive view of everything in stock right now.
                    </p>
                  </div>
                </header>
                {filteredProducts.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>No products match this filter yet. Try a different view.</p>
                  </div>
                ) : (
                  <div className={styles.productsGrid}>
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </>
  )
}

