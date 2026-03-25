import { useEffect, useRef } from 'react'
import styles from './About.module.css'

const stats = [
  { prefix: "International", value: "100%", label: "Premium glass enclosure & high-intensity lighting" },
  { prefix: "Professional", value: "6+", label: "Multi-sport activities in one premium hub", green: true },
  { prefix: "Solo Drills from", value: "PKR 399", label: "Automated drill sessions · Train without a partner" },
]

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.15 }
    )
    sectionRef.current?.querySelectorAll('.fade-up').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <div className="fade-up">
            <div className="section-label">Our Story</div>
            <h2 className="section-title">
              WE ARE <span className="hl-blue">BEYOND</span><br />THE GAME
            </h2>
            <p className={styles.body}>
              Built for Bahawalpur's next generation of players and dreamers.{' '}
              <strong>Beyond Padel</strong> isn't just a court — it's where energy, competition,
              and community collide. Pakistan's premium padel experience, right here in Model Town.
            </p>
            <p className={styles.body} style={{ marginTop: '1rem' }}>
              We brought the sport. We built the vibe. Now we're building the community.
            </p>
            <p className={styles.tagline}>Bahawalpur's First. Pakistan's Finest.</p>
          </div>
        </div>
        <div className={styles.right}>
          {stats.map((s, i) => (
            <div key={i} className={`fade-up ${styles.statCard} ${s.green ? styles.green : ''}`} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={styles.statPfx}>{s.prefix}</div>
              <div className={`${styles.statNum} ${s.green ? styles.greenNum : ''}`}>{s.value}</div>
              <div className={styles.statLbl}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
