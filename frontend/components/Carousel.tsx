'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './Carousel.module.css'

interface Slide {
  id: number
  image: string
  link: string
  ariaLabel: string
}

interface CarouselProps {
  slides?: Slide[]
  autoPlay?: boolean
  interval?: number
}

const defaultSlides: Slide[] = [
  {
    id: 1,
    image: '/p1.png',
    link: '/products',
    ariaLabel: 'Discover featured collection',
  },
  {
    id: 2,
    image: '/p2.png',
    link: '/products',
    ariaLabel: 'Browse latest arrivals',
  },
  {
    id: 3,
    image: '/p3.png',
    link: '/products',
    ariaLabel: 'Explore trending picks',
  },
  {
    id: 4,
    image: '/p4.png',
    link: '/products',
    ariaLabel: 'See curated essentials',
  },
  {
    id: 5,
    image: '/p5.png',
    link: '/products',
    ariaLabel: 'Shop seasonal offers',
  },
]

export default function Carousel({
  slides = defaultSlides,
  autoPlay = true,
  interval = 2500,
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
          <Link
            key={slide.id}
            href={slide.link}
            aria-label={slide.ariaLabel}
            className={`${styles.slide} ${
              index === currentIndex ? styles.active : ''
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
            }}
          >
            <span className={styles.visuallyHidden}>{slide.ariaLabel}</span>
          </Link>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        className={`${styles.navButton} ${styles.prevButton}`}
        onClick={goToPrevious}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        className={`${styles.navButton} ${styles.nextButton}`}
        onClick={goToNext}
        aria-label="Next slide"
      >
        ›
      </button>

      {/* Indicators */}
      <div className={styles.indicators}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${
              index === currentIndex ? styles.active : ''
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

