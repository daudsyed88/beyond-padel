import { useEffect, useState } from 'react'
import styles from './Navbar.module.css'

export default function Navbar({ onBook }) {
  const [scrolled, setScrolled] = useState(false)
  const [status, setStatus] = useState({ state: 'CLOSED', label: 'OPENS AT 3PM', tooltip: 'Opens today at 3:00 PM' })
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    
    // Status Logic
    const updateStatus = () => {
      const now = new Date()
      // PKT is UTC+5
      const pkt = new Date(now.getTime() + (5 * 60 * 60 * 1000) + (now.getTimezoneOffset() * 60 * 1000))
      const hrs = pkt.getHours()
      const mins = pkt.getMinutes()
      const month = pkt.getMonth() // 0-indexed
      const date = pkt.getDate()
      const year = pkt.getFullYear()

      // Ramadan Detection
      const isRamadan = (year === 2025 && month === 2) || (year === 2026 && month === 2 && date <= 29)
      const closeHr = isRamadan ? 5 : 3
      
      // Convert to minutes from midnight for easier comparison
      const nowMins = hrs * 60 + mins
      const openStart = 15 * 60 // 3:00 PM
      const openEnd = closeHr * 60 + (closeHr < 15 ? 24 * 60 : 0) // 3:00 AM or 5:00 AM next day
      
      const currentInMins = nowMins + (hrs < 15 ? 24 * 60 : 0)
      
      let newState = 'CLOSED'
      let newLabel = 'OPENS AT 3PM'
      let newTooltip = 'Opens today at 3:00 PM'

      if (currentInMins >= openStart && currentInMins < openEnd) {
        const remaining = openEnd - currentInMins
        if (remaining <= 45) {
          newState = 'CLOSING'
          newLabel = 'CLOSING SOON'
          newTooltip = 'Last bookings in 45 mins'
        } else {
          newState = 'OPEN'
          newLabel = 'OPEN NOW'
          newTooltip = `Closes at ${closeHr}:00 AM`
        }
      }

      setStatus({ state: newState, label: newLabel, tooltip: newTooltip })
    }

    updateStatus()
    const timer = setInterval(updateStatus, 60000)

    return () => {
      window.removeEventListener('scroll', onScroll)
      clearInterval(timer)
    }
  }, [])

  const StatusPill = ({ mobile = false }) => (
    <div 
      className={`${styles.statusPill} ${styles[status.state]} ${mobile ? styles.mobileOnly : styles.desktopOnly}`}
      title={status.tooltip}
    >
      {status.state === 'OPEN' && <span className={styles.dot} />}
      {status.label}
    </div>
  )

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <a href="#hero" className={styles.logo}>
          BEYOND <span>PADEL</span>
        </a>

        <div className={styles.right}>
          <div className={`${styles.links} ${isMenuOpen ? styles.menuVisible : ''}`}>
            {['Play', 'Sports', 'Café', 'Events'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)}>
                {item}
              </a>
            ))}
            <StatusPill mobile />
          </div>

          <div className={styles.actions}>
            <StatusPill />
            <button onClick={onBook} className={styles.bookBtn}>
              Book Now
            </button>
            <button className={styles.hamburger} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div className={`${styles.bar} ${isMenuOpen ? styles.bar1 : ''}`} />
              <div className={`${styles.bar} ${isMenuOpen ? styles.bar2 : ''}`} />
              <div className={`${styles.bar} ${isMenuOpen ? styles.bar3 : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
