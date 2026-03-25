import { useEffect, useRef } from 'react'
import styles from './Pricing.module.css'

const plans = [
  {
    label: 'SOLO DRILLS',
    price: 'PKR 399',
    unit: '/ session',
    features: ['Automated drill machine', 'Personal court focus', '30-40 min session'],
    cta: 'Book Solo',
    type: 'Solo Drills'
  },
  {
    label: 'COURT RENTAL',
    price: '4,000–5,500',
    unit: 'PKR / hour',
    features: ['Premium glass court', 'Pro lighting included', 'Peak & Off-peak rates'],
    cta: 'Book Court',
    highlight: true,
    type: 'Court Rental'
  },
  {
    label: 'TOURNAMENT',
    price: 'PKR 4,500',
    unit: '/ team',
    features: ['Cash prize: PKR 25,000+ for winners', 'Knockout format · 16 teams', 'Tournament atmosphere'],
    cta: 'Register Team',
    type: 'Tournament Entry'
  },
]

export default function Pricing({ onBook }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    sectionRef.current?.querySelectorAll('.fade-up').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="play" ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <div className="fade-up">
          <div className="section-label">Courts &amp; Pricing</div>
          <h2 className="section-title">
            PLAY <span className="hl-blue">YOUR</span><br />WAY
          </h2>
        </div>
        <div className={styles.grid}>
          {plans.map((plan, i) => (
            <div key={i} className={`fade-up ${styles.card} ${plan.highlight ? styles.highlight : ''}`}>
              {plan.highlight && <div className={styles.badge}>Most Popular</div>}
              <div className={styles.planLabel}>{plan.label}</div>
              <div className={styles.price}>{plan.price} <span className={styles.unit}>{plan.unit}</span></div>
              <ul className={styles.features}>
                {plan.features.map((f, j) => <li key={j}>{f}</li>)}
              </ul>
              <button
                onClick={() => {
                  const id = plan.label.toLowerCase().includes('solo') ? 'solo' : 
                             plan.label.toLowerCase().includes('rental') ? 'padel' : 
                             plan.label.toLowerCase().includes('tournament') ? 'tournament' : null;
                  onBook(id);
                }}
                className={`${styles.cta} ${plan.highlight ? styles.ctaHighlight : ''}`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
