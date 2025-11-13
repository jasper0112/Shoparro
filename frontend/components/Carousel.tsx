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
    title: 'New Arrivals',
    description: 'Explore the latest curated products with limited-time offers',
    buttonText: 'Shop Now',
    link: '/products',
  },
  {
    id: 2,
    title: 'Limited-Time Deals',
    description:
      "Enjoy exceptional discounts across the store - don't miss out on the savings",
    buttonText: 'View Details',
    link: '/products',
  },
  {
    id: 3,
    title: 'Quality Guaranteed',
    description:
      'Handpicked premium goods to deliver the best shopping experience',
    buttonText: 'Start Shopping',
    link: '/products',
  },
  {
    id: 4,
    title: 'Members Only',
    description: 'Join now to unlock exclusive perks and reward points',
    buttonText: 'Join Now',
    link: '/register',
  },
  {
    id: 5,
    title: 'Fast Delivery',
    description:
      'Nationwide shipping with speedy delivery for a smoother experience',
    buttonText: 'Order Now',
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
                  {slide.buttonText || 'Learn More'}
                </Link>
              )}
            </div>
          </div>
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

