import React, { useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { imgUrl } from '../../utils/img'

const NewArrivals = () => {
  const scrollRef = useRef(null)
  const drag = useRef({ down: false, x: 0, left: 0, moved: false })
  const [items, setItems] = useState([])
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`)
      .then((r) => setItems(r.data))
      .catch((e) => console.error(e))
  }, [])

  const update = () => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 0)
    setCanRight(el.scrollWidth > el.scrollLeft + el.clientWidth + 1)
  }
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', update, { passive: true })
    update()
    return () => el.removeEventListener('scroll', update)
  }, [items])

  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  const onDown = (e) => { drag.current = { down: true, x: e.pageX, left: scrollRef.current.scrollLeft, moved: false } }
  const onMove = (e) => {
    const d = drag.current
    if (!d.down) return
    const dx = e.pageX - d.x
    if (Math.abs(dx) > 4) d.moved = true
    scrollRef.current.scrollLeft = d.left - dx
  }
  const onUp = () => { drag.current.down = false }

  const btn = (enabled) => `grid h-11 w-11 place-items-center rounded-full border transition ${enabled ? 'border-paddy bg-white text-paddy hover:bg-paddy hover:text-white' : 'cursor-not-allowed border-soil/10 text-soil/25'}`

  return (
    <section className='py-16'>
      <div className='container mx-auto mb-8 flex items-end justify-between gap-6 px-6'>
        <div>
          <h2 className='text-3xl font-bold md:text-4xl'>New arrivals</h2>
          <p className='mt-2 max-w-lg text-soil-soft'>Fresh listings from farms this week.</p>
        </div>
        <div className='flex gap-2'>
          <button onClick={() => scroll(-1)} disabled={!canLeft} aria-label='Scroll left' className={btn(canLeft)}><FiChevronLeft className='text-xl' /></button>
          <button onClick={() => scroll(1)} disabled={!canRight} aria-label='Scroll right' className={btn(canRight)}><FiChevronRight className='text-xl' /></button>
        </div>
      </div>
      <div
        ref={scrollRef}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        className='container mx-auto flex snap-x gap-5 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
      >
        {items.length === 0 && Array.from({ length: 4 }).map((_, i) => <div key={i} className='skeleton h-[420px] min-w-[70%] rounded-2xl sm:min-w-[40%] lg:min-w-[23%]' />)}
        {items.map((p) => (
          <Link
            key={p._id}
            to={`/products/${p._id}`}
            draggable='false'
            onClick={(e) => drag.current.moved && e.preventDefault()}
            className='group relative min-w-[70%] snap-start overflow-hidden rounded-2xl sm:min-w-[40%] lg:min-w-[23%]'
          >
            <img src={imgUrl(p.images?.[0]?.src)} alt={p.images?.[0]?.altText || p.name} draggable='false' loading='lazy' className='h-[420px] w-full object-cover transition duration-500 group-hover:scale-105' />
            <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-soil/85 to-transparent p-5 pt-16 text-white'>
              <h4 className='font-display text-lg font-semibold'>{p.name}</h4>
              <p className='tabular-nums text-white/85'>${p.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default NewArrivals
