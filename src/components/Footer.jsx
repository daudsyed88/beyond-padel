import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          BEYOND <span className={styles.blue}>PADEL</span>
        </div>
        <div className={styles.links}>
          <a href="#about">About</a>
          <a href="#play">Pricing</a>
          <a href="#sports">Sports Hub</a>
          <a href="#contact">Contact</a>
        </div>
        <div className={styles.bottom}>
          <p>© {currentYear} BEYOND PADEL. ALL RIGHTS RESERVED.</p>
          <div className={styles.social}>
            <span>FOLLOW THE VIBE →</span>
            <a href="https://instagram.com/beyondpadelbwp" target="_blank" rel="noopener noreferrer">@beyondpadelbwp</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
