import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearWishlist } from '../redux/slices/wishlistSlice'
import ProductGrid from '../components/Products/ProductGrid'

const Wishlist = () => {
  const dispatch = useDispatch()
  const items = useSelector((s) => s.wishlist.items)
  return (
    <div className='container mx-auto px-6 py-12'>
      <div className='mb-8 flex flex-wrap items-end justify-between gap-4'>
        <h1 className='text-4xl font-bold'>Wishlist</h1>
        {items.length > 0 && <button onClick={() => dispatch(clearWishlist())} className='text-sm font-semibold underline'>Clear wishlist</button>}
      </div>
      {items.length === 0 ? (
        <div className='rounded-2xl bg-white p-12 text-center'>
          <p className='font-display text-2xl font-semibold'>Nothing saved yet</p>
          <p className='mt-2 text-soil-soft'>Tap the heart on any crop to keep it here.</p>
          <Link to='/collections/all' className='btn-dark mt-6'>Browse crops</Link>
        </div>
      ) : (
        <ProductGrid products={items} />
      )}
    </div>
  )
}

export default Wishlist
