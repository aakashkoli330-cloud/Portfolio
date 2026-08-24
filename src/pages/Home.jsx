import { motion } from 'framer-motion'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import About from '../components/About.jsx'
import Skills from '../components/Skills.jsx'
import Projects from '../components/Projects.jsx'
import Experience from '../components/Experience.jsx'
import Contact from '../components/Contact.jsx'
import Footer from '../components/Footer.jsx'
import SourceBadge from '../components/SourceBadge.jsx'
import { SiteDataProvider, useSiteData } from '../context/SiteData.jsx'

function Splash() {
  return (
    <div className="grid min-h-screen place-items-center bg-paper">
      <motion.span
        aria-hidden="true"
        animate={{ scale: [1, 1.25, 1], opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        className="h-16 w-16 rounded-full bg-gradient-to-br from-grape via-flare to-honey shadow-[0_10px_40px_rgba(18,32,92,0.25)]"
      />
    </div>
  )
}

function SiteShell() {
  const { ready } = useSiteData()

  if (!ready) return <Splash />

  return (
    <div className="relative min-h-screen overflow-x-clip bg-paper text-cream">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <SourceBadge />
    </div>
  )
}

export default function Home() {
  return (
    <SiteDataProvider>
      <SiteShell />
    </SiteDataProvider>
  )
}
