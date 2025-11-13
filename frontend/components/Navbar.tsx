'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getUser, logout, isAuthenticated } from '@/lib/auth'
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
          🛒 Shoparro
        </Link>

        <div className={styles.search}>
          <input
            type="text"
            placeholder="搜索产品..."
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>🔍</button>
        </div>

        <div className={styles.right}>
          {user ? (
            <>
              <div className={styles.userInfo}>
                <span className={styles.userName}>👤 {user.name}</span>
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
                        个人资料
                      </Link>
                      <Link href="/orders" className={styles.menuItem}>
                        我的订单
                      </Link>
                      <button
                        onClick={handleLogout}
                        className={styles.menuItem}
                      >
                        登出
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <Link href="/cart" className={styles.cartButton}>
                🛒 购物车
              </Link>
            </>
          ) : (
            <div className={styles.authButtons}>
              <Link href="/login" className={styles.loginButton}>
                登录
              </Link>
              <Link href="/register" className={styles.registerButton}>
                注册
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

