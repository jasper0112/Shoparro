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
    title: 'New Arrivals: 20% Off',
    description:
      "Browse this week's curated products - the sale ends tonight!",
    ctaText: 'Shop Now',
    href: '/products?filter=new',
    tag: 'Hot',
    theme: 'violet',
  },
  {
    id: 'free-shipping',
    title: 'Free Shipping on Everything',
    description:
      'Spend $99 or more and automatically unlock free delivery nationwide.',
    ctaText: 'Learn More',
    href: '/promotions/free-shipping',
    tag: 'Free',
    theme: 'teal',
  },
  {
    id: 'bundle',
    title: 'Bundle & Save $30',
    description: 'Pick any two bundle items and save instantly at checkout.',
    ctaText: 'Build a Bundle',
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
        aria-label="Expand promotions"
      >
        🔔 Promotions
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
            aria-label="Hide promotions"
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
              aria-label="Previous promotion"
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
                  aria-label={`View promotion ${index + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              className={styles.navButton}
              onClick={handleNext}
              aria-label="Next promotion"
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
