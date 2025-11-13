 'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import styles from './PromoSlider.module.css'

type SlideTheme = 'violet' | 'teal' | 'amber'

interface Slide {
  id: string
  title: string
  description: string
  ctaText: string
  href: string
  tag: string
  theme: SlideTheme
}

const SLIDES: Slide[] = [
  {
    id: 'new-arrivals',
    title: '新品限时 8 折',
    description: '挑选本周上架的精选产品，优惠今晚截止！',
    ctaText: '去逛逛',
    href: '/products?filter=new',
    tag: 'Hot',
    theme: 'violet',
  },
  {
    id: 'free-shipping',
    title: '全场免邮',
    description: '订单满 $99 自动免邮，全国范围都可配送。',
    ctaText: '了解详情',
    href: '/promotions/free-shipping',
    tag: 'Free',
    theme: 'teal',
  },
  {
    id: 'bundle',
    title: '组合套餐立省 $30',
    description: '购买任意两件组合商品，结账自动减免。',
    ctaText: '马上搭配',
    href: '/bundles',
    tag: 'Sale',
    theme: 'amber',
  },
]

const AUTO_SWITCH_INTERVAL = 6000

export default function PromoSlider() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const activeSlide = useMemo(() => SLIDES[activeIndex], [activeIndex])

  useEffect(() => {
    if (isCollapsed || isPaused) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length)
    }, AUTO_SWITCH_INTERVAL)

    return () => window.clearInterval(timer)
  }, [isCollapsed, isPaused])

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % SLIDES.length)
  }

  if (SLIDES.length === 0) {
    return null
  }

  if (isCollapsed) {
    return (
      <button
        type="button"
        className={styles.fab}
        onClick={() => setIsCollapsed(false)}
        aria-label="展开优惠推荐"
      >
        🔔 优惠推荐
      </button>
    )
  }

  return (
    <aside
      className={styles.slider}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-live="polite"
    >
      <div className={`${styles.slide} ${styles[activeSlide.theme]}`}>
        <div className={styles.header}>
          <span className={styles.tag}>{activeSlide.tag}</span>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => setIsCollapsed(true)}
            aria-label="隐藏优惠推荐"
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <h3 className={styles.title}>{activeSlide.title}</h3>
          <p className={styles.description}>{activeSlide.description}</p>
        </div>

        <div className={styles.footer}>
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.navButton}
              onClick={handlePrev}
              aria-label="上一条优惠"
            >
              ‹
            </button>
            <div className={styles.dots}>
              {SLIDES.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  className={`${styles.dot} ${
                    index === activeIndex ? styles.activeDot : ''
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`查看优惠 ${index + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              className={styles.navButton}
              onClick={handleNext}
              aria-label="下一条优惠"
            >
              ›
            </button>
          </div>

          <Link href={activeSlide.href} className={styles.cta}>
            {activeSlide.ctaText} →
          </Link>
        </div>
      </div>
    </aside>
  )
}
