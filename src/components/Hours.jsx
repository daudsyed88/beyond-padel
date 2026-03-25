import styles from './Hours.module.css'

export default function Hours() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <div className={styles.title}>BEYOND TIME</div>
          <div className={styles.sub}>WE NEVER SLEEP. PLAY TILL 3 AM OR BOOK THE ENTIRE NIGHT.</div>
          <div className={styles.grid}>
            <div className={styles.timingBox}>
              <span className={styles.label}>DAILY HOURS</span>
              <span className={styles.hl}>3:00 PM — 3:00 AM</span>
            </div>
            <div className={styles.timingBox}>
              <span className={styles.label}>RAMADAN HOURS</span>
              <span className={styles.hl}>3:00 PM — 5:00 AM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
