import { useEffect, useRef } from 'react'
import styles from './Contact.module.css'

export default function Contact() {
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
    <section id="contact" ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <div className={`fade-up ${styles.header}`}>
          <div className="section-label">Get in Touch</div>
          <h2 className="section-title">READY TO <span className="hl-blue">PLAY?</span></h2>
        </div>
        <div className={styles.grid}>
          <div className={`fade-up ${styles.card}`}>
            <div className={styles.icon}>📍</div>
            <div className={styles.info}>
              <h4>VISIT US</h4>
              <p>Beyond Padel, 42/3 A, Model Town, Bahawalpur, Pakistan</p>
            </div>
          </div>
          <div className={`fade-up ${styles.mapContainer}`}>
            <iframe 
              src="https://maps.google.com/maps?q=29.386212,71.656627&z=17&output=embed" 
              width="100%" height="100%" style={{ border: 0, borderRadius: '12px' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}
