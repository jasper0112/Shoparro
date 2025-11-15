'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getUser, logout, isAuthenticated, getDisplayName } from '@/lib/auth'
import type { User } from '@/lib/auth'
import styles from './Navbar.module.css'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getUser())
    }
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          🛒 Southside Cart
        </Link>

        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search products..."
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>🔍</button>
        </div>

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
                      <Link href="/profile" className={styles.menuItem}>
                        Profile
                      </Link>
                      <Link href="/orders" className={styles.menuItem}>
                        My orders
                      </Link>
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

