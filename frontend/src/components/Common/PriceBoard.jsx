import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

// Mandi-style rate board built from the products already in the store.
const PriceBoard = () => {
  const { products } = useSelector((s) => s.products)
  const items = products.slice(0, 12)
  if (!items.length) return null
  const row = (suffix) =>
    items.map((p) => (
      <Link key={p._id + suffix} to={`/products/${p._id}`} className='flex shrink-0 items-baseline gap-2 px-6 hover:text-turmeric'>
        <span className='font-medium'>{p.name}</span>
        <span className='tabular-nums text-turmeric'>${p.price}</span>
      </Link>
    ))
  return (
    <div className='board relative overflow-hidden border-t border-white/15 bg-soil/90 text-sm text-white backdrop-blur' aria-label='Current crop prices'>
      <div className='board-track flex w-max py-3'>
        <div className='flex'>{row('a')}</div>
        <div className='flex' aria-hidden='true'>{row('b')}</div>
      </div>
    </div>
  )
}

export default PriceBoard
