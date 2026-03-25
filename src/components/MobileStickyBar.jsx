import { useEffect, useState } from 'react'
import styles from './MobileStickyBar.module.css'

export default function MobileStickyBar({ onBook }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When hero is NOT intersecting (scrolled past), show bar
        setIsVisible(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`${styles.bar} ${isVisible ? styles.visible : ''}`}>
      <button className={styles.bookBtn} onClick={onBook}>
        ⚡ BOOK NOW
      </button>
      <a 
        href="https://wa.me/923013202630" 
        target="_blank" 
        rel="noopener noreferrer" 
        className={styles.waBtn}
      >
        💬 WHATSAPP
      </a>
    </div>
  )
}
