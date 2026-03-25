import { useEffect, useRef } from 'react'
import styles from './Hero.module.css'

export default function Hero({ onBook }) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [])

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.videoBg}>
        <video ref={videoRef} muted loop playsInline autoPlay>
          <source src="/hero-bg.mov" type="video/mp4" />
          <source src="/hero-bg.mov" type="video/quicktime" />
        </video>
        <div className={styles.overlay} />
      </div>

      <div className={styles.ticker}>
        {[1, 2].map(i => (
          <div key={i} className={styles.tickerTrack}>
            {['PADEL', 'SNOOKER', 'TABLE TENNIS', 'BADMINTON', 'FOOSBALL', 'CAFÉ', 'TOURNAMENTS', 'OPEN TILL 3AM', "BAHAWALPUR'S FINEST"].map((t, idx) => (
              <span key={idx}>{t} <span className={styles.dot}>·</span> </span>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.label}>Bahawalpur's First Premium Sports Club</div>
        <h1 className={styles.heading}>
          BEYOND<br />
          <span className={styles.blue}>PADEL</span>
        </h1>
        <p className={styles.sub}>One venue. Every game. Infinite energy.</p>
        <div className={styles.ctas}>
          <button 
            onClick={() => onBook()}
            className={styles.ctaPrimary}
            style={{ border: 'none', cursor: 'pointer' }}
          >
            Book a Session
          </button>
          <a href="#sports" className={styles.ctaSecondary}>Explore Sports</a>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <span>SCROLL</span>
        <div className={styles.arrow}>↓</div>
      </div>
    </section>
  )
}
