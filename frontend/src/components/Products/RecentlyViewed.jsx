import React, { useState } from 'react'
import { getRecent } from '../../utils/recentlyViewed'
import ProductGrid from './ProductGrid'

const RecentlyViewed = ({ excludeId }) => {
  const [items] = useState(() => getRecent().filter((p) => p._id !== excludeId).slice(0, 4))
  if (!items.length) return null
  return (
    <section className='container mx-auto px-6 py-12'>
      <h2 className='mb-6 text-2xl font-bold'>Recently viewed</h2>
      <ProductGrid products={items} />
    </section>
  )
}

export default RecentlyViewed
