'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './Carousel.module.css'

interface Slide {
  id: number
  title: string
  description: string
  image?: string
  link?: string
  buttonText?: string
}

interface CarouselProps {
  slides?: Slide[]
  autoPlay?: boolean
  interval?: number
}

const defaultSlides: Slide[] = [
  {
    id: 1,
    title: '新品上市',
    description: '探索最新精选产品，享受限时优惠',
    buttonText: '立即购买',
    link: '/products',
  },
  {
    id: 2,
    title: '限时特惠',
    description: '全场商品享受超值折扣，机会不容错过',
    buttonText: '查看详情',
    link: '/products',
  },
  {
    id: 3,
    title: '品质保证',
    description: '精选优质商品，为您提供最佳购物体验',
    buttonText: '开始购物',
    link: '/products',
  },
  {
    id: 4,
    title: '会员专享',
    description: '注册会员即可享受专属优惠和积分奖励',
    buttonText: '加入会员',
    link: '/register',
  },
  {
    id: 5,
    title: '快速配送',
    description: '全国包邮，快速送达，让您购物更便捷',
    buttonText: '立即下单',
    link: '/products',
  },
]

export default function Carousel({
  slides = defaultSlides,
  autoPlay = true,
  interval = 5000,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!autoPlay || isPaused) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, slides.length, isPaused])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  const currentSlide = slides[currentIndex]

  return (
    <div
      className={styles.carousel}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={styles.slidesContainer}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${styles.slide} ${
              index === currentIndex ? styles.active : ''
            }`}
            style={{
              backgroundImage: slide.image
                ? `url(${slide.image})`
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            <div className={styles.slideContent}>
              <h2 className={styles.slideTitle}>{slide.title}</h2>
              <p className={styles.slideDescription}>{slide.description}</p>
              {slide.link && (
                <Link href={slide.link} className={styles.slideButton}>
                  {slide.buttonText || '了解更多'}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 导航按钮 */}
      <button
        className={`${styles.navButton} ${styles.prevButton}`}
        onClick={goToPrevious}
        aria-label="上一张"
      >
        ‹
      </button>
      <button
        className={`${styles.navButton} ${styles.nextButton}`}
        onClick={goToNext}
        aria-label="下一张"
      >
        ›
      </button>

      {/* 指示器 */}
      <div className={styles.indicators}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${
              index === currentIndex ? styles.active : ''
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`跳转到第 ${index + 1} 张`}
          />
        ))}
      </div>
    </div>
  )
}

