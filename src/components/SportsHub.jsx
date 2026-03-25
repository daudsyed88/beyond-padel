import { useEffect, useRef } from 'react'
import styles from './SportsHub.module.css'

import padelImg from '../assets/padel-court.png'
import snookerImg from '../assets/snooker-table.png'
import tableTennisImg from '../assets/table-tennis.png'
import badmintonImg from '../assets/badminton-court.png'
import foosballImg from '../assets/foosball-table.png'
import cafeImg from '../assets/cafe-sandwich.png'

const sports = [
  { name: 'Padel Court', desc: "Bahawalpur's first premium glass enclosure court. International standard lighting for night play.", img: padelImg, video: '/padel.mp4' },
  { name: 'Snooker', desc: 'Precision meets focus. Premium tables in a calm, dedicated professional space.', img: snookerImg, video: '/snooker.mp4' },
  { name: 'Table Tennis', desc: 'Spin. Smash. Score. Fast-paced sessions for players of all levels on professional tables.', img: tableTennisImg, video: '/tabletennis.mp4' },
  { name: 'Badminton', desc: 'Fast-paced thrill with proper court setup and high-intensity overhead lighting.', img: badmintonImg, video: '/badminton.mp4' },
  { name: 'Foosball', desc: 'Twist. Flick. Win. The ultimate team battle on a professional tournament table.', img: foosballImg, video: '/foosball.mp4' },
  { name: 'Café', desc: 'Refuel after the rally. Specialty coffee, wraps, and club sandwiches on-site.', img: cafeImg, video: '/cafe.mp4' },
]

export default function SportsHub({ onBook }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const fadeObserver = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    sectionRef.current?.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el))

    const videoObserver = new IntersectionObserver(
      entries => entries.forEach(e => {
        const vid = e.target.querySelector('video')
        if (!vid) return
        if (e.isIntersecting) { vid.play().catch(() => {}) }
        else { vid.pause(); vid.currentTime = 0 }
      }),
      { threshold: 0.6 }
    )
    sectionRef.current?.querySelectorAll(`.${styles.card}`).forEach(el => videoObserver.observe(el))

    return () => { fadeObserver.disconnect(); videoObserver.disconnect() }
  }, [])

  const handleEnter = (e) => {
    const vid = e.currentTarget.querySelector('video')
    if (vid) vid.play().catch(() => {})
  }
  const handleLeave = (e) => {
    const vid = e.currentTarget.querySelector('video')
    if (vid) { vid.pause(); vid.currentTime = 0 }
  }

  return (
    <section id="sports" ref={sectionRef} className={styles.section}>
      <div className={styles.header}>
        <div className={`fade-up section-label`}>One Venue. Every Game.</div>
        <h2 className={`fade-up section-title`}>
          THE <span className="hl-blue">SPORTS</span><br />HUB
        </h2>
        <p className={`fade-up ${styles.sub}`}>Experience the premium vibes of Bahawalpur.</p>
      </div>
      <div className={styles.grid}>
        {sports.map((sport, i) => (
            <div
              key={i}
              className={`fade-up ${styles.card}`}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            >
              <div className={styles.media}>
                <img src={sport.img} alt={sport.name} />
                <video muted loop playsInline>
                  <source src={sport.video} type="video/mp4" />
                </video>
                <div className={styles.mediaTint} />
                
                <div className={styles.infoOverlay}>
                  <h3>{sport.name}</h3>
                  <p>{sport.desc}</p>
                </div>

                {sport.name !== 'Café' && (
                  <button 
                    className={styles.bookBadge} 
                    onClick={() => onBook(sport.name.toLowerCase().includes('padel') ? 'padel' : sport.name.toLowerCase())}
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
        ))}
      </div>
    </section>
  )
}
