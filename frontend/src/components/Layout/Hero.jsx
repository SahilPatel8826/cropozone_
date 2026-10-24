import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import hero from '../../assets/img4-opt.webp'
import mango from '../../assets/crops/mango-cut.webp'
import oranges from '../../assets/crops/oranges-cut.webp'
import carrot from '../../assets/crops/carrot-cut.webp'
import PriceBoard from '../Common/PriceBoard'

// Floating crops: depth = how far they drift with the pointer, bob = idle float length
const floaters = [
  { src: oranges, cls: 'right-[4%] top-[14%] w-40 xl:w-52', depth: 26, bob: 6.5, delay: 700, rot: '-8deg' },
  { src: mango, cls: 'right-[24%] bottom-[16%] w-44 xl:w-56', depth: 44, bob: 7.5, delay: 900, rot: '6deg' },
  { src: carrot, cls: 'right-[2%] bottom-[10%] w-28 xl:w-36', depth: 16, bob: 5.5, delay: 1100, rot: '14deg' },
]

const lines = ['Crops at the', 'farm‑gate', 'price.']

const Hero = () => {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
    el.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
  }
  const onLeave = () => { ref.current?.style.setProperty('--px', 0); ref.current?.style.setProperty('--py', 0) }

  return (
    <section ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ '--px': 0, '--py': 0 }} className='relative isolate overflow-hidden bg-soil text-white'>
      {/* mirrored in the keyframes so the trader sits on the right and the copy stays clear of his face */}
      <img src={hero} alt='A trader checking produce at a market stall' className='kenburns absolute inset-0 -z-20 h-full w-full object-cover object-center' fetchpriority='high' />
      <div className='absolute inset-0 -z-10 bg-gradient-to-r from-soil via-soil/70 to-transparent' />
      <div className='absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-soil/80 to-transparent' />

      <div className='pointer-events-none absolute inset-0 hidden lg:block' aria-hidden='true'>
        {floaters.map((f) => (
          <div key={f.src} className={`absolute ${f.cls}`} style={{ transform: `translate3d(calc(var(--px) * ${f.depth}px), calc(var(--py) * ${f.depth}px), 0)`, transition: 'transform .35s ease-out' }}>
            <img src={f.src} alt='' className='drop-in drop-shadow-[0_24px_30px_rgba(0,0,0,.45)]' style={{ '--rot': f.rot, '--bob': `${f.bob}s`, animationDelay: `${f.delay}ms, ${f.delay + 800}ms` }} />
          </div>
        ))}
      </div>

      <div className='container mx-auto px-6 pb-24 pt-20 md:pb-36 md:pt-32'>
        <h1 className='max-w-3xl text-5xl font-extrabold leading-[0.95] sm:text-6xl lg:text-8xl'>
          {lines.map((l, i) => (
            <span key={l} className='block overflow-hidden pb-[0.1em]'>
              <span className='rise block' style={{ animationDelay: `${250 + i * 140}ms` }}>{l}</span>
            </span>
          ))}
        </h1>
        <p className='fade-in mt-6 max-w-xl text-lg text-white/85' style={{ animationDelay: '800ms' }}>
          CropOzone connects farmers and traders to buy and sell grains, fruit and vegetables directly, with transport and tracking built in.
        </p>
        <div className='fade-in mt-8 flex flex-wrap gap-3' style={{ animationDelay: '950ms' }}>
          <Link to='/collections/all' className='btn-primary'>Browse crops</Link>
          <Link to='/collections/all?material=Organic' className='btn-ghost'>Organic only</Link>
        </div>
      </div>
      <PriceBoard />
    </section>
  )
}

export default Hero
