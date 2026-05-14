import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import StatsBar from '@/components/landing/StatsBar'
import Problem from '@/components/landing/Problem'
import HowItWorks from '@/components/landing/HowItWorks'
import Features from '@/components/landing/Features'
import Testimonials from '@/components/landing/Testimonials'
import Pricing from '@/components/landing/Pricing'
import FAQ from '@/components/landing/FAQ'
import FinalCTA from '@/components/landing/FinalCTA'
import Contact from '@/components/landing/Contact'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main className="bg-[#0a0a0f] min-h-screen">
      <Navbar />
      <Hero />
      <StatsBar />
      <Problem />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Contact />
      <Footer />
    </main>
  )
}
