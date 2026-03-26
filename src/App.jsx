import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import SportsHub from './components/SportsHub'
import Pricing from './components/Pricing'
import Cafe from './components/Cafe'
import Events from './components/Events'
import Hours from './components/Hours'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingSocials from './components/FloatingSocials'
import BookingSystem from './components/BookingSystem'

function App() {
  const [bookingSport, setBookingSport] = useState(null)

  const handleBook = (sportId = null) => {
    setBookingSport(sportId || true) // 'true' means open without pre-selection
  }

  return (
    <>
      <Navbar onBook={() => handleBook()} />
      <Hero onBook={() => handleBook()} />
      <About />
      <SportsHub onBook={handleBook} />
      <Pricing onBook={handleBook} />
      <Cafe onBook={handleBook} />
      <Events />
      <Hours />
      <Contact onBook={handleBook} />
      <Footer />
      <FloatingSocials />
      
      <BookingSystem 
        isOpen={!!bookingSport} 
        preSelectedSport={typeof bookingSport === 'string' ? bookingSport : null}
        onClose={() => setBookingSport(null)} 
      />
    </>
  )
}

export default App
