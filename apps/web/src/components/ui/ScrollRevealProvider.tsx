'use client'

import { useEffect } from 'react'

export default function ScrollRevealProvider() {
  useEffect(() => {
    const selectors = [
      '.scroll-reveal',
      '.scroll-reveal-left',
      '.scroll-reveal-right',
      '.scroll-reveal-scale',
      '.scroll-reveal-stagger',
    ].join(', ')

    const els = document.querySelectorAll(selectors)

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const delay = parseInt(el.dataset.delay || '0', 10)
            setTimeout(() => el.classList.add('revealed'), delay)
            obs.unobserve(el)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
    )

    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return null
}
