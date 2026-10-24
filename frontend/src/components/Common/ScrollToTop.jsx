import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { HiArrowUp } from 'react-icons/hi2'

// Scrolls to top on route change (keeps position when only filters change) and shows a back-to-top button.
const ScrollToTop = () => {
  const { pathname } = useLocation()
  const [show, setShow] = useState(false)

  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label='Back to top'
      className='fixed bottom-6 right-6 z-30 grid h-12 w-12 place-items-center rounded-full bg-paddy text-white shadow-lg transition hover:bg-paddy-dark'
    >
      <HiArrowUp className='h-5 w-5' />
    </button>
  )
}

export default ScrollToTop
