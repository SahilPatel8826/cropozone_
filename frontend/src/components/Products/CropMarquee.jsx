import React from 'react'
import { crops } from './CropStrip'

// Slow marquee of crop names and photos, runs the opposite way to the price board.
const CropMarquee = () => {
  const row = (k) => crops.map((c) => (
    <span key={c.name + k} className='flex shrink-0 items-center gap-6 pr-6'>
      <span className='font-display text-5xl font-extrabold text-soil/15 md:text-7xl'>{c.name}</span>
      <img src={c.img} alt='' loading='lazy' className='h-14 w-14 rounded-full object-cover md:h-20 md:w-20' />
    </span>
  ))
  return (
    <div className='board overflow-hidden py-10' aria-hidden='true'>
      <div className='board-track-rev flex w-max'>
        <div className='flex'>{row('a')}</div>
        <div className='flex'>{row('b')}</div>
      </div>
    </div>
  )
}

export default CropMarquee
