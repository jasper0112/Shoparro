import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>欢迎来到 Shoparro</h1>
        <p className={styles.description}>
          E-Commerce Platform for Australian SMEs
        </p>
        <div className={styles.actions}>
          <Link href="/login" className={styles.button}>
            登录
          </Link>
          <Link href="/register" className={styles.buttonSecondary}>
            注册
          </Link>
        </div>
      </div>
    </main>
  )
}

