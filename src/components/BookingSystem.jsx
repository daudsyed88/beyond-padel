import { useState, useEffect } from 'react'
import styles from './BookingSystem.module.css'

const SPORTS = [
  { id: 'padel', icon: '🎾', name: 'Padel Court', desc: 'Premium glass enclosure · Night play available' },
  { id: 'solo', icon: '🤖', name: 'Solo Drills (Machine)', desc: 'Train with automated machine · PKR 399/session' },
  { id: 'snooker', icon: '🎱', name: 'Snooker', desc: 'Professional tables · Calm dedicated space' },
  { id: 'tt', icon: '🏓', name: 'Table Tennis', desc: 'Fast-paced · All skill levels' },
  { id: 'badminton', icon: '🏸', name: 'Badminton', desc: 'Proper court · High-intensity lighting' },
  { id: 'foosball', icon: '⚽', name: 'Foosball', desc: 'Tournament table · Team battles' },
  { id: 'cafe', icon: '☕', name: 'Café Reservation', desc: 'Pre-book your table · Group bookings' },
  { id: 'tournament', icon: '🏆', name: 'Beyond Cup Registration', desc: 'Tournament entry · PKR 4,500/team' },
  { id: 'inquiry', icon: '💬', name: 'General Inquiry', desc: 'Any question, we answer fast' },
]

const TIME_SLOTS = [
  '3:00 PM – 4:00 PM', '4:00 PM – 5:00 PM', '5:00 PM – 6:00 PM', '6:00 PM – 7:00 PM',
  '7:00 PM – 8:00 PM', '8:00 PM – 9:00 PM', '9:00 PM – 10:00 PM', '10:00 PM – 11:00 PM',
  '11:00 PM – 12:00 AM', '12:00 AM – 1:00 AM', '1:00 AM – 2:00 AM', '2:00 AM – 3:00 AM'
]

const INITIAL_STATE = {
  sport: null,
  name: '',
  phone: '',
  date: new Date().toISOString().split('T')[0],
  slot: '',
  backupSlot: '',
  players: '',
  isRacketRental: false,
  notes: '',
  guests: '',
  teamName: '',
  experience: '',
  heardFrom: '',
  question: ''
}

export default function BookingSystem({ isOpen, onClose, preSelectedSport }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState(INITIAL_STATE)
  const [errors, setErrors] = useState({})
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (preSelectedSport) {
        setFormData({ ...INITIAL_STATE, sport: preSelectedSport })
        setStep(2)
      } else {
        setFormData(INITIAL_STATE)
        setStep(1)
      }
      setErrors({})
    }
  }, [isOpen, preSelectedSport])

  const handleBack = () => setStep(s => s - 1)

  if (!isOpen) return null

  const selectedSport = SPORTS.find(s => s.id === formData.sport)

  const validateStep = () => {
    const newErrors = {}
    if (step === 1) {
      if (!formData.sport) newErrors.sport = 'Please select a service'
    } else if (step === 2) {
      if (!formData.name || formData.name.trim().length < 2) {
        newErrors.name = 'Full Name is required (min 2 chars)'
      } else if (/\d/.test(formData.name)) {
        newErrors.name = 'Name should not contain numbers'
      }
      
      const cleanPhone = formData.phone.replace(/-/g, '')
      if (!/^03\d{9}$/.test(cleanPhone)) {
        newErrors.phone = 'Please enter a valid Pakistani number (e.g. 0301-3202630)'
      }

      const selectedDate = new Date(formData.date)
      const today = new Date()
      today.setHours(0,0,0,0)
      if (selectedDate < today) newErrors.date = 'Please select today or a future date'

      if (!['inquiry', 'cafe', 'tournament', 'solo'].includes(formData.sport)) {
        if (!formData.slot) newErrors.slot = 'Preferred slot is required'
        if (!formData.backupSlot) newErrors.backupSlot = 'Backup slot is required'
        if (formData.slot && formData.slot === formData.backupSlot) {
          newErrors.backupSlot = 'Backup slot must differ from your preferred slot'
        }
        
        if (formData.sport === 'padel') {
          if (!formData.players) newErrors.players = 'Please select player count'
        } else {
          if (!formData.players || formData.players < 1 || formData.players > 6) {
            newErrors.players = 'Please enter 1–6 players'
          }
        }
      }

      if (formData.sport === 'solo') {
        if (!formData.slot) newErrors.slot = 'Preferred slot is required'
        if (!formData.backupSlot) newErrors.backupSlot = 'Backup slot is required'
      }

      if (formData.sport === 'cafe') {
        if (!formData.slot) newErrors.slot = 'Approximate time is required'
        if (!formData.guests || formData.guests < 1) newErrors.guests = 'Number of guests is required'
      }

      if (formData.sport === 'tournament') {
        if (!formData.teamName) newErrors.teamName = 'Team name is required'
        if (!formData.experience) newErrors.experience = 'Experience level is required'
      }

      if (formData.sport === 'inquiry') {
        if (!formData.question || formData.question.length < 5) {
          newErrors.question = 'Please provide a clear question'
        }
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      setStep(s => s + 1)
      const contentEl = document.querySelector(`.${styles.content}`)
      if (contentEl) contentEl.scrollTop = 0
    }
  }

  const handleWhatsApp = () => {
    const dateFormatted = new Date(formData.date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

    let sportSpecific = ''
    if (formData.sport === 'padel') {
      const playersLabel = formData.players === 'Need Partner' ? 'Partner match needed' : formData.players
      sportSpecific = `Players: ${playersLabel}\nRacket Rental: ${formData.isRacketRental ? 'Yes' : 'No'}`
    } else if (formData.sport === 'solo') {
      sportSpecific = `Players: 1 (Solo Machine Drill)`
    } else if (['snooker', 'tt', 'badminton', 'foosball'].includes(formData.sport)) {
      sportSpecific = `Number of Players: ${formData.players}`
    } else if (formData.sport === 'cafe') {
      sportSpecific = `Guests: ${formData.guests}\nSpecial Request: ${formData.notes || 'None'}`
    } else if (formData.sport === 'tournament') {
      sportSpecific = `Team Name: ${formData.teamName}\nExperience: ${formData.experience}\nHeard via: ${formData.heardFrom || 'None'}`
    } else if (formData.sport === 'inquiry') {
      sportSpecific = `Message: ${formData.question}`
    }

    const message = `🎾 BEYOND PADEL — BOOKING REQUEST
━━━━━━━━━━━━━━━━━━━━━━

Sport / Service: ${selectedSport?.name}
Name: ${formData.name}
Phone: ${formData.phone}
Date: ${dateFormatted}
${formData.slot ? `Preferred Slot: ${formData.slot}\n` : ''}${formData.backupSlot ? `Backup Slot: ${formData.backupSlot}\n` : ''}
${sportSpecific}

Additional Notes: ${formData.notes && !['cafe', 'inquiry'].includes(formData.sport) ? formData.notes : (formData.notes || 'None')}

━━━━━━━━━━━━━━━━━━━━━━
Sent via beyondpadel.com
Please confirm availability. 🙏`

    const url = `https://wa.me/923013202630?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      onClose()
    }, 3000)
  }

  return (
    <div className={styles.overlay}>
      {showToast && <div className={styles.toast}>✅ WhatsApp opened! Send the message to complete your request.</div>}
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        
        <div className={styles.stepIndicator}>
          <div className={`${styles.stepPill} ${step >= 1 ? styles.active : ''} ${step > 1 ? styles.completed : ''}`}>
            {step > 1 ? <span className={styles.checkmark}>✓</span> : <span className={styles.stepLabel}>1 SELECT SPORT</span>}
          </div>
          <div className={`${styles.stepPill} ${step >= 2 ? styles.active : ''} ${step > 2 ? styles.completed : ''}`}>
             {step > 2 ? <span className={styles.checkmark}>✓</span> : <span className={styles.stepLabel}>2 YOUR DETAILS</span>}
          </div>
          <div className={`${styles.stepPill} ${step >= 3 ? styles.active : ''}`}>
            <span className={styles.stepLabel}>3 CONFIRM & SEND</span>
          </div>
        </div>

        <div className={styles.content}>
          <h2 className={styles.stepTitle}>
            {step === 1 && 'SELECT SPORT'}
            {step === 2 && 'YOUR DETAILS'}
            {step === 3 && 'REVIEW & SEND'}
          </h2>

          {step === 1 && (
            <div className={styles.sportGrid}>
              {SPORTS.map(sport => (
                <div 
                  key={sport.id}
                  className={`${styles.sportCard} ${formData.sport === sport.id ? styles.selected : ''}`}
                  onClick={() => setFormData({ ...formData, sport: sport.id })}
                >
                  <span className={styles.sportIcon}>{sport.icon}</span>
                  <div className={styles.sportName}>{sport.name}</div>
                  <p className={styles.sportDesc}>{sport.desc}</p>
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className={styles.formContent}>
              <div className={styles.grid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name <span className={styles.required}>*</span></label>
                  <input 
                    type="text" 
                    className={`${styles.input} ${errors.name ? styles.error : ''}`}
                    placeholder="Ahmed Ali"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <p className={styles.errorMsg}>{errors.name}</p>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number <span className={styles.required}>*</span></label>
                  <input 
                    type="tel" 
                    className={`${styles.input} ${errors.phone ? styles.error : ''}`}
                    placeholder="0301-3202630"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                  {errors.phone && <p className={styles.errorMsg}>{errors.phone}</p>}
                </div>
              </div>

              <div className={styles.grid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Preferred Date <span className={styles.required}>*</span></label>
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    className={`${styles.input} ${errors.date ? styles.error : ''}`}
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                  {errors.date && <p className={styles.errorMsg}>{errors.date}</p>}
                </div>

                {formData.sport !== 'inquiry' && formData.sport !== 'tournament' && (
                  <div className={styles.formGroup}>
                    <label className={styles.label}>{formData.sport === 'cafe' ? 'Approximate Time' : 'Preferred Time Slot'} <span className={styles.required}>*</span></label>
                    {formData.sport === 'cafe' ? (
                      <input 
                        type="time"
                        className={`${styles.input} ${errors.slot ? styles.error : ''}`}
                        value={formData.slot}
                        onChange={e => setFormData({ ...formData, slot: e.target.value })}
                      />
                    ) : (
                      <select 
                        className={`${styles.select} ${errors.slot ? styles.error : ''}`}
                        value={formData.slot}
                        onChange={e => setFormData({ ...formData, slot: e.target.value })}
                      >
                        <option value="">Select a slot</option>
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    )}
                    {errors.slot && <p className={styles.errorMsg}>{errors.slot}</p>}
                    {formData.slot && ['7:00 PM – 8:00 PM', '8:00 PM – 9:00 PM', '9:00 PM – 10:00 PM'].includes(formData.slot) && (
                      <div className={styles.peakNotice}>⚡ This is a peak slot. Book at least 24h ahead!</div>
                    )}
                  </div>
                )}
              </div>

              {formData.sport === 'padel' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Backup Time Slot <span className={styles.required}>*</span></label>
                    <select 
                      className={`${styles.select} ${errors.backupSlot ? styles.error : ''}`}
                      value={formData.backupSlot}
                      onChange={e => setFormData({ ...formData, backupSlot: e.target.value })}
                    >
                      <option value="">Select a different slot</option>
                      {TIME_SLOTS.filter(t => t !== formData.slot).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {errors.backupSlot && <p className={styles.errorMsg}>{errors.backupSlot}</p>}
                    <p style={{ fontSize: '0.75rem', color: '#8A9BB0', marginTop: '0.4rem' }}>Court availability is first-come, first-served. We'll offer the next best option if unavailable.</p>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Number of Players <span className={styles.required}>*</span></label>
                    <div className={styles.radioGroup}>
                      {[
                        { val: '2 Players', label: '2 Players — Half court / drill side' },
                        { val: '4 Players', label: '4 Players — Full court' },
                        { val: 'Need Partner', label: 'I need a partner matched — open to pairing' }
                      ].map(opt => (
                        <label key={opt.val} className={`${styles.radioLabel} ${formData.players === opt.val ? styles.active : ''}`}>
                          <input 
                            type="radio" 
                            name="players"
                            className={styles.radioInput}
                            checked={formData.players === opt.val}
                            onChange={() => setFormData({ ...formData, players: opt.val })}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                    {errors.players && <p className={styles.errorMsg}>{errors.players}</p>}
                    <p style={{ fontSize: '0.75rem', color: '#8A9BB0', marginTop: '0.4rem' }}>Unsure about full vs half court? Select 2 players and mention in notes.</p>
                  </div>

                  <div className={styles.formGroup}>
                    <div className={styles.toggleRow}>
                      <span className={styles.label} style={{ marginBottom: 0 }}>Racket & Ball Rental</span>
                      <label className={styles.toggleSwitch}>
                        <input 
                          type="checkbox" 
                          checked={formData.isRacketRental}
                          onChange={e => setFormData({ ...formData, isRacketRental: e.target.checked })}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#8A9BB0', marginTop: '0.5rem' }}>
                      {formData.isRacketRental ? "Yes, include rental" : "I have my own"}
                    </p>
                  </div>

                  <div className={`${styles.infoBox} ${styles.blue}`}>
                   ⚡ Peak hours (7PM–10PM) fill fast. We recommend booking 24 hours ahead. Your slot is only confirmed once you receive a WhatsApp reply from us.
                  </div>
                </>
              )}

              {['snooker', 'tt', 'badminton', 'foosball'].includes(formData.sport) && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Backup Time Slot <span className={styles.required}>*</span></label>
                    <select 
                      className={`${styles.select} ${errors.backupSlot ? styles.error : ''}`}
                      value={formData.backupSlot}
                      onChange={e => setFormData({ ...formData, backupSlot: e.target.value })}
                    >
                      <option value="">Select a different slot</option>
                      {TIME_SLOTS.filter(t => t !== formData.slot).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {errors.backupSlot && <p className={styles.errorMsg}>{errors.backupSlot}</p>}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Number of Players (Max 6) <span className={styles.required}>*</span></label>
                    <input 
                      type="number" 
                      min="1" max="6"
                      className={`${styles.input} ${errors.players ? styles.error : ''}`}
                      value={formData.players}
                      onChange={e => setFormData({ ...formData, players: e.target.value })}
                    />
                    {errors.players && <p className={styles.errorMsg}>{errors.players}</p>}
                  </div>
                </>
              )}

              {formData.sport === 'cafe' && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>Number of Guests <span className={styles.required}>*</span></label>
                  <input 
                    type="number" 
                    min="1"
                    className={`${styles.input} ${errors.guests ? styles.error : ''}`}
                    value={formData.guests}
                    onChange={e => setFormData({ ...formData, guests: e.target.value })}
                  />
                  {errors.guests && <p className={styles.errorMsg}>{errors.guests}</p>}
                </div>
              )}

              {formData.sport === 'tournament' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Team Name <span className={styles.required}>*</span></label>
                    <input 
                      type="text" 
                      className={`${styles.input} ${errors.teamName ? styles.error : ''}`}
                      placeholder="Enter team name"
                      value={formData.teamName}
                      onChange={e => setFormData({ ...formData, teamName: e.target.value })}
                    />
                    {errors.teamName && <p className={styles.errorMsg}>{errors.teamName}</p>}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Experience Level <span className={styles.required}>*</span></label>
                    <div className={styles.radioGroup}>
                      {['Beginners (first tournament)', 'Intermediate', 'Competitive'].map(opt => (
                        <label key={opt} className={`${styles.radioLabel} ${formData.experience === opt ? styles.active : ''}`}>
                          <input 
                            type="radio" 
                            name="experience"
                            className={styles.radioInput}
                            checked={formData.experience === opt}
                            onChange={() => setFormData({ ...formData, experience: opt })}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                    {errors.experience && <p className={styles.errorMsg}>{errors.experience}</p>}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>How did you hear about Beyond Cup?</label>
                    <select 
                      className={styles.select}
                      value={formData.heardFrom}
                      onChange={e => setFormData({ ...formData, heardFrom: e.target.value })}
                    >
                      <option value="">Select source</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Friend">Friend</option>
                      <option value="Walk-in">Walk-in</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className={`${styles.infoBox} ${styles.green}`}>
                    🏆 Beyond Cup Entry: PKR 4,500 per team · Prize: PKR 25,000+ for winners. Registration confirmed only after WhatsApp reply from Beyond Padel. Team registration does not guarantee a spot until payment is received.
                  </div>
                </>
              )}

              {formData.sport === 'inquiry' && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>Your Question <span className={styles.required}>*</span></label>
                  <textarea 
                    className={`${styles.textarea} ${errors.question ? styles.error : ''}`}
                    placeholder="Ask us anything..."
                    rows="4"
                    value={formData.question}
                    onChange={e => setFormData({ ...formData, question: e.target.value })}
                  />
                  {errors.question && <p className={styles.errorMsg}>{errors.question}</p>}
                </div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.label}>{formData.sport === 'cafe' ? 'Special Request' : 'Additional Notes (Optional)'}</label>
                <textarea 
                  className={styles.textarea}
                  placeholder={formData.sport === 'cafe' ? "Birthday, group event, etc." : "Anything else we should know?"}
                  rows="2"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <p style={{ color: '#8A9BB0', fontSize: '0.75rem', textAlign: 'center', marginTop: '1rem' }}>
                Beyond Padel operates 3:00 PM – 3:00 AM daily.<br />
                Ramadan hours: 3:00 PM – 5:00 AM.
              </p>
            </div>
          )}
          
          {step === 3 && (
            <div className={styles.reviewContent}>
              <div className={styles.summaryCard}>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Sport</span>
                    <span className={styles.summaryValue}>{selectedSport?.name}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Name</span>
                    <span className={styles.summaryValue}>{formData.name}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Date</span>
                    <span className={styles.summaryValue}>{new Date(formData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric'})}</span>
                  </div>
                  {formData.slot && (
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>{formData.sport === 'cafe' ? 'Time' : 'Slot'}</span>
                      <span className={styles.summaryValue}>{formData.slot}</span>
                    </div>
                  )}
                  {formData.backupSlot && (
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Backup</span>
                      <span className={styles.summaryValue}>{formData.backupSlot}</span>
                    </div>
                  )}
                  {(formData.players || formData.guests) && (
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>{formData.sport === 'cafe' ? 'Guests' : 'Players'}</span>
                      <span className={styles.summaryValue}>{formData.players || formData.guests}</span>
                    </div>
                  )}
                  {formData.sport === 'padel' && (
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Racket Rental</span>
                      <span className={styles.summaryValue}>{formData.isRacketRental ? 'Yes' : 'No'}</span>
                    </div>
                  )}
                  {formData.teamName && (
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Team</span>
                      <span className={styles.summaryValue}>{formData.teamName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.warningBanner}>
                <span>⚠️</span>
                <div>
                  This is a booking REQUEST, not a confirmation.
                  Your booking is only confirmed once Beyond Padel replies on WhatsApp.
                  Please do not arrive without receiving a confirmation message.
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={`${styles.footer} ${step === 3 ? styles.stickyFooter : ''}`}>
          {step > 1 && <button onClick={handleBack} className={styles.prevBtn}>← EDIT DETAILS</button>}
          {step < 3 ? (
            <button onClick={handleNext} className={styles.nextBtn} disabled={step === 1 && !formData.sport}>
              {step === 1 ? 'NEXT: DETAILS' : 'NEXT: REVIEW'}
            </button>
          ) : (
            <button onClick={handleWhatsApp} className={`${styles.nextBtn} ${styles.whatsappBtn}`}>
              SEND ON WHATSAPP →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
