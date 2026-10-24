import React from 'react'
import { Link } from 'react-router-dom'
import farm from '../../assets/farm-opt.webp'

const FeaturedCollection = () => (
  <section className='container mx-auto px-6 py-16'>
    <div className='grid items-center overflow-hidden rounded-3xl bg-turmeric-light lg:grid-cols-2'>
      <div className='p-8 md:p-14'>
        <h2 className='text-4xl font-bold leading-tight lg:text-5xl'>Fewer hands between the field and the buyer.</h2>
        <p className='mt-5 max-w-md text-lg text-soil-soft'>An online market where farmers and traders deal directly, with buying, selling and transport in one place.</p>
        <Link to='/collections/all' className='btn-dark mt-8'>See what’s listed</Link>
      </div>
      <img src={farm} alt='Illustration of people tending a ring of farmland' loading='lazy' className='float-slow h-full max-h-[480px] w-full object-cover' />
    </div>
  </section>
)

export default FeaturedCollection
