'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './login.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || '登录失败，请检查您的邮箱和密码')
      }

      // 保存 token 到 localStorage
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user || {}))
      }

      // 根据用户角色跳转
      const userRole = data.user?.role || 'CUSTOMER'
      if (userRole === 'ADMIN' || userRole === 'MERCHANT') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } catch (err: any) {
      setError(err.message || '登录失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>欢迎回来</h1>
          <p className={styles.subtitle}>登录您的 Shoparro 账户</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              邮箱地址
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="your.email@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              密码
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="请输入您的密码"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            还没有账户？{' '}
            <Link href="/register" className={styles.link}>
              立即注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

