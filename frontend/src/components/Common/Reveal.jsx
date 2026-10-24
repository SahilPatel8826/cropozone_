import React, { useEffect, useRef, useState } from 'react'

// Reveals its children once when scrolled into view.
// variant: "up" (rise + fade) | "clip" (wipe open, good for images) | "fade"
const Reveal = ({ as: Tag = 'div', variant = 'up', delay = 0, className = '', children, ...rest }) => {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) { setShown(true); return }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setShown(true); io.disconnect() }
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const delayStyle = { transitionDelay: shown ? `${delay}ms` : '0ms' }

  // clip-path hides the element from IntersectionObserver, so the wipe goes on an inner wrapper
  if (variant === 'clip') {
    return (
      <Tag ref={ref} className={className} {...rest}>
        <div style={delayStyle} className={`reveal reveal-clip flex h-full flex-1 ${shown ? 'in' : ''}`}>{children}</div>
      </Tag>
    )
  }

  return (
    <Tag ref={ref} style={delayStyle} className={`reveal reveal-${variant} ${shown ? 'in' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

export default Reveal
