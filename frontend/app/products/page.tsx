'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import ProductCard from '@/components/ProductCard'
import { isAuthenticated } from '@/lib/auth'
import { 
  getActiveProducts, 
  searchProducts, 
  getProductsByCategory,
  getProductsByPriceRange,
  type Product 
} from '@/lib/api'
import styles from './products.module.css'

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest' },
  { value: 'price', label: 'Price: Low to High' },
  { value: 'price', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A-Z' },
]

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Living',
  'Food & Beverages',
  'Sports & Outdoors',
  'Books',
  'Toys & Games',
  'Health & Beauty',
]

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [authChecked, setAuthChecked] = useState(false)

  // Filters
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortDir, setSortDir] = useState('DESC')

  useEffect(() => {
    const authed = isAuthenticated()
    setAuthChecked(true)
    if (!authed) {
      router.push('/login')
      return
    }

    // Get search query from URL
    const query = searchParams.get('q')
    if (query && !searchKeyword) {
      setSearchKeyword(query)
    }
  }, [router, searchParams])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      let response
      if (searchKeyword.trim()) {
        response = await searchProducts(searchKeyword, currentPage, 20)
      } else if (selectedCategory) {
        response = await getProductsByCategory(selectedCategory, currentPage, 20)
      } else if (minPrice || maxPrice) {
        const min = minPrice ? parseFloat(minPrice) : 0
        const max = maxPrice ? parseFloat(maxPrice) : 999999
        response = await getProductsByPriceRange(min, max, currentPage, 20)
      } else {
        response = await getActiveProducts(currentPage, 20, sortBy, sortDir)
      }

      setProducts(response.content)
      setTotalPages(response.totalPages)
    } catch (err: any) {
      setError(err.message || 'Failed to load products')
      console.error('Error loading products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const authed = isAuthenticated()
    setAuthChecked(true)
    if (!authed) {
      router.push('/login')
      return
    }

    loadProducts()
  }, [router, currentPage, selectedCategory, sortBy, sortDir, searchKeyword, minPrice, maxPrice])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(0)
    loadProducts()
  }

  const handleFilterChange = () => {
    setCurrentPage(0)
    loadProducts()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(amount)
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
            <h1 className={styles.title}>Products</h1>
            <p className={styles.subtitle}>Browse our complete catalog</p>
          </header>

          <div className={styles.content}>
            <aside className={styles.sidebar}>
              <div className={styles.filterSection}>
                <h2 className={styles.filterTitle}>Search</h2>
                <form onSubmit={handleSearch} className={styles.searchForm}>
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Search products..."
                    className={styles.searchInput}
                  />
                  <button type="submit" className={styles.searchButton}>
                    Search
                  </button>
                </form>
              </div>

              <div className={styles.filterSection}>
                <h2 className={styles.filterTitle}>Category</h2>
                <div className={styles.categoryList}>
                  <button
                    onClick={() => {
                      setSelectedCategory('')
                      handleFilterChange()
                    }}
                    className={`${styles.categoryButton} ${!selectedCategory ? styles.active : ''}`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category)
                        handleFilterChange()
                      }}
                      className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.filterSection}>
                <h2 className={styles.filterTitle}>Price Range</h2>
                <div className={styles.priceRange}>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className={styles.priceInput}
                    min="0"
                    step="0.01"
                  />
                  <span className={styles.priceSeparator}>-</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className={styles.priceInput}
                    min="0"
                    step="0.01"
                  />
                  <button
                    onClick={handleFilterChange}
                    className={styles.applyButton}
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className={styles.filterSection}>
                <h2 className={styles.filterTitle}>Sort By</h2>
                <select
                  value={`${sortBy}-${sortDir}`}
                  onChange={(e) => {
                    const [newSortBy, newSortDir] = e.target.value.split('-')
                    setSortBy(newSortBy)
                    setSortDir(newSortDir)
                    setCurrentPage(0)
                  }}
                  className={styles.sortSelect}
                >
                  <option value="createdAt-DESC">Newest First</option>
                  <option value="price-ASC">Price: Low to High</option>
                  <option value="price-DESC">Price: High to Low</option>
                  <option value="name-ASC">Name: A-Z</option>
                  <option value="name-DESC">Name: Z-A</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setSearchKeyword('')
                  setSelectedCategory('')
                  setMinPrice('')
                  setMaxPrice('')
                  setSortBy('createdAt')
                  setSortDir('DESC')
                  setCurrentPage(0)
                  loadProducts()
                }}
                className={styles.clearFilters}
              >
                Clear All Filters
              </button>
            </aside>

            <div className={styles.productsArea}>
              {error && (
                <div className={styles.errorMessage}>
                  <p>{error}</p>
                  <button onClick={loadProducts} className={styles.retryButton}>
                    Retry
                  </button>
                </div>
              )}

              {loading ? (
                <div className={styles.loading}>
                  <p>Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>🔍</div>
                  <h2>No products found</h2>
                  <p>Try adjusting your filters or search terms.</p>
                </div>
              ) : (
                <>
                  <div className={styles.resultsInfo}>
                    <p>
                      Showing {products.length} product{products.length !== 1 ? 's' : ''}
                      {totalPages > 1 && ` (Page ${currentPage + 1} of ${totalPages})`}
                    </p>
                  </div>

                  <div className={styles.productsGrid}>
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
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
          </div>
        </div>
      </main>
    </>
  )
}

