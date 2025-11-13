'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './register.module.css'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

  const validateForm = () => {
    if (formData.password.length < 6) {
      setError('密码长度至少为 6 个字符')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || '注册失败，请稍后重试')
      }

      // 注册成功后自动登录
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user || {}))
      }

      // 跳转到首页或登录页
      router.push('/')
    } catch (err: any) {
      setError(err.message || '注册失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>创建账户</h1>
          <p className={styles.subtitle}>加入 Shoparro，开始您的购物之旅</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              姓名
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="请输入您的姓名"
              required
              autoComplete="name"
            />
          </div>

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
              placeholder="至少 6 个字符"
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              确认密码
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={styles.input}
              placeholder="请再次输入密码"
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            已有账户？{' '}
            <Link href="/login" className={styles.link}>
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

