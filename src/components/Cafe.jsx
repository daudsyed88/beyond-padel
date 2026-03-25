import { useEffect, useRef } from 'react'
import styles from './Cafe.module.css'
import sandwichImg from '../assets/cafe-sandwich.png'

export default function Cafe({ onBook }) {
  const sectionRef = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    sectionRef.current?.querySelectorAll('.fade-up').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="café" ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.visualSide}>
          <div className={`fade-up ${styles.imageWrapper}`}>
            <img src={sandwichImg} alt="Café Beyond" />
            <div className={styles.floatingLabel}>
              BEYOND CAFÉ · ON-SITE
            </div>
          </div>
        </div>
        <div className={`fade-up ${styles.content}`}>
          <div className="section-label">Fuel Your Game</div>
          <h2 className="section-title">
            CAFÉ <span className="hl-green">BEYOND</span><br />THE COURT
          </h2>
          <p className={styles.body}>
            Great sports deserve great food. Recharge with our artisan café serving specialty
            coffee, premium wraps, club sandwiches, and energy drinks — crafted to keep you
            at your peak, session after session.
          </p>
          <div className={styles.chips}>
            {['Specialty Coffee', 'Club Sandwiches', 'Wraps & Rolls', 'Fresh Juices', 'Energy Drinks'].map(c => (
              <span key={c} className={styles.chip}>{c}</span>
            ))}
          </div>
          <button 
            className={styles.bookBtn} 
            onClick={() => onBook('cafe')}
          >
            Book a Table
          </button>
        </div>
      </div>
    </section>
  )
}
