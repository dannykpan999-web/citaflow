import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Problem from '@/components/landing/Problem'
import HowItWorks from '@/components/landing/HowItWorks'
import DashboardPreview from '@/components/landing/DashboardPreview'
import Pricing from '@/components/landing/Pricing'
import FAQ from '@/components/landing/FAQ'
import FinalCTA from '@/components/landing/FinalCTA'
import Contact from '@/components/landing/Contact'
import Footer from '@/components/landing/Footer'
import ScrollRevealProvider from '@/components/ui/ScrollRevealProvider'

export default function LandingPage() {
  return (
    <main className="min-h-screen" style={{ background: '#ffffff' }}>
      <ScrollRevealProvider />
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <DashboardPreview />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Contact />
      <Footer />
    </main>
  )
}
