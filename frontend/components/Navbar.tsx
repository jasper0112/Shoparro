'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getUser, logout, isAuthenticated, getDisplayName } from '@/lib/auth'
import { getCartItemCount } from '@/lib/cart'
import type { User } from '@/lib/auth'
import styles from './Navbar.module.css'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getUser())
    }
    updateCartCount()
    
    // Update cart count when storage changes (from other tabs/windows)
    const handleStorageChange = () => updateCartCount()
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Update cart count periodically
  useEffect(() => {
    const interval = setInterval(updateCartCount, 1000)
    return () => clearInterval(interval)
  }, [])

  const updateCartCount = () => {
    setCartCount(getCartItemCount())
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/products')
    }
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          🛒 Southside Cart
        </Link>

        <form onSubmit={handleSearch} className={styles.search}>
          <input
            type="text"
            placeholder="Search products..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className={styles.searchButton}>🔍</button>
        </form>

        <div className={styles.right}>
          {user ? (
            <>
              <div className={styles.userInfo}>
                <span className={styles.userName}>👤 {getDisplayName(user)}</span>
                <div className={styles.userMenu}>
                  <button
                    className={styles.menuButton}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    ▼
                  </button>
                  {isMenuOpen && (
                    <div className={styles.dropdown}>
                      <Link href="/products" className={styles.menuItem}>
                        Browse Products
                      </Link>
                      <Link href="/orders" className={styles.menuItem}>
                        My Orders
                      </Link>
                      <Link href="/profile" className={styles.menuItem}>
                        Profile
                      </Link>
                      {user?.role === 'MERCHANT' && (
                        <Link href="/merchant/products" className={styles.menuItem}>
                          My Products
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className={styles.menuItem}
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <Link href="/cart" className={styles.cartButton}>
                🛒 Cart
                {cartCount > 0 && (
                  <span className={styles.cartBadge}>{cartCount}</span>
                )}
              </Link>
            </>
          ) : (
            <div className={styles.authButtons}>
              <Link href="/login" className={styles.loginButton}>
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

