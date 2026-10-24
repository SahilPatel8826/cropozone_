import React from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../Common/Reveal'
import produce from '../../assets/product1-opt.webp'
import grain from '../../assets/grain-opt.webp'

const Tile = ({ to, title, text, img, className = '', dark, delay = 0 }) => (
  <Reveal variant='clip' delay={delay} className='flex flex-1'>
  <Link to={to} className={`group relative isolate flex min-h-[420px] flex-1 items-end overflow-hidden rounded-3xl p-8 ${className}`}>
    <img src={img} alt='' loading='lazy' className='absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-105' />
    {!dark && <div className='absolute inset-0 -z-10 bg-gradient-to-t from-soil/80 via-soil/20 to-transparent' />}
    <div className={dark ? 'text-soil' : 'text-white'}>
      <h2 className='text-3xl font-bold'>{title}</h2>
      <p className='mt-1 opacity-85'>{text}</p>
      <span className={`mt-4 inline-block rounded-full px-5 py-2 text-sm font-semibold transition group-hover:bg-turmeric group-hover:text-soil ${dark ? 'bg-paddy text-white' : 'bg-white text-soil'}`}>Shop {title.toLowerCase()}</span>
    </div>
  </Link>
  </Reveal>
)

const CategoryCollectionSection = () => (
  <section className='container mx-auto px-6 py-16'>
    <div className='flex flex-col gap-6 md:flex-row'>
      <Tile to='/collections/all?category=Fruits&category=Vegetables' title='Fruits and vegetables' text='Picked fresh, priced by the farm.' img={produce} dark className='bg-white [&>img]:object-contain [&>img]:p-6 [&>img]:pb-24' />
      <Tile to='/collections/all?category=Grains' title='Grains' text='Rice, wheat, oats and more, by the sack.' img={grain} delay={150} />
    </div>
  </section>
)

export default CategoryCollectionSection
