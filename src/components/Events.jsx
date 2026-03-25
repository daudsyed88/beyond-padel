import { useEffect, useRef } from 'react'
import styles from './Events.module.css'

const events = [
  { 
    label: 'COMPLETED', 
    title: 'BEYOND CUP — INAUGURAL TOURNAMENT', 
    desc: "Bahawalpur's first padel tournament. 16 teams, knockout format, 4th–6th February. The rivalry has begun.",
    type: 'past'
  },
  { 
    label: 'COMING SOON', 
    title: 'NEXT BEYOND EVENT', 
    desc: "Something big is being planned. Follow @beyondpadelbwp on Instagram to be the first to know.",
    type: 'upcoming',
    cta: 'FOLLOW FOR UPDATES →',
    link: 'https://instagram.com/beyondpadelbwp'
  },
]

export default function Events() {
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
    <section id="events" ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <div className="fade-up">
          <div className="section-label">Tournaments & More</div>
          <h2 className="section-title">
            BEYOND <span className="hl-green">EVENTS</span>
          </h2>
        </div>
        <div className={styles.grid}>
          {events.map((e, i) => (
            <div key={i} className={`fade-up ${styles.card} ${e.type === 'past' ? styles.past : styles.upcoming}`}>
              <div className={styles.label}>
                {e.type === 'upcoming' && <span className={styles.pulseDot} />}
                {e.label}
              </div>
              <h3 className={styles.title}>{e.title}</h3>
              <p className={styles.desc}>{e.desc}</p>
              {e.cta && (
                <a href={e.link} target="_blank" rel="noopener noreferrer" className={styles.cta}>
                  {e.cta}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
