import React from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../Common/ProductCard'
import Reveal from '../Common/Reveal'

const gridCls = 'grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4'

const ProductGrid = ({ products = [], loading, error, cols }) => {
  if (loading) {
    return (
      <div className={cols || gridCls} aria-busy='true'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className='skeleton aspect-[4/5] rounded-2xl' />
            <div className='skeleton mt-3 h-4 w-2/3 rounded' />
            <div className='skeleton mt-2 h-3 w-1/3 rounded' />
          </div>
        ))}
      </div>
    )
  }
  if (error) {
    return (
      <div className='rounded-2xl border border-chilli/30 bg-chilli/5 p-6 text-center'>
        <p className='font-semibold'>Couldn’t load crops</p>
        <p className='mt-1 text-sm text-soil-soft'>{error}. Check that the backend is running and try again.</p>
      </div>
    )
  }
  if (!products.length) {
    return (
      <div className='rounded-2xl bg-white p-10 text-center'>
        <p className='font-display text-xl font-semibold'>No crops match these filters</p>
        <p className='mt-1 text-soil-soft'>Remove a filter or browse everything.</p>
        <Link to='/collections/all' className='btn-dark mt-5'>Browse all crops</Link>
      </div>
    )
  }
  return (
    <div className={cols || gridCls}>
      {products.map((p, i) => <Reveal key={p._id} delay={(i % 4) * 80}><ProductCard product={p} /></Reveal>)}
    </div>
  )
}

export default ProductGrid
