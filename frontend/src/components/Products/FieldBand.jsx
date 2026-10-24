import React from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../Common/Reveal'
import field from '../../assets/grain-opt.webp'

const FieldBand = () => (
  <section className='relative isolate my-16 overflow-hidden bg-paddy-dark py-24 text-white'>
    <img src={field} alt='' loading='lazy' className='absolute inset-0 -z-20 h-full w-full object-cover' />
    <div className='absolute inset-0 -z-10 bg-paddy-dark/80' />
    <div className='container mx-auto grid gap-12 px-6 md:grid-cols-2'>
      <Reveal>
        <h2 className='text-3xl font-bold md:text-5xl'>If you grow</h2>
        <p className='mt-4 max-w-md text-lg text-white/85'>List your crop with photos and a rate you set. Traders order straight from you, and every order is tracked from placement to delivery.</p>
        <Link to='/register' className='btn-primary mt-7'>Create a seller account</Link>
      </Reveal>
      <Reveal delay={150}>
        <h2 className='text-3xl font-bold md:text-5xl'>If you trade</h2>
        <p className='mt-4 max-w-md text-lg text-white/85'>Filter by crop, region, pack size and organic status. Pay securely with PayPal and follow your orders in one place.</p>
        <Link to='/collections/all' className='btn-ghost mt-7'>Start buying</Link>
      </Reveal>
    </div>
  </section>
)

export default FieldBand
