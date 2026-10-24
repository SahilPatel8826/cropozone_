import React from 'react'
import { useSearchParams } from 'react-router-dom'

const SortOptions = () => {
  const [params, setParams] = useSearchParams()
  const onChange = (e) => {
    const next = new URLSearchParams(params)
    e.target.value ? next.set('sortBy', e.target.value) : next.delete('sortBy')
    setParams(next)
  }
  return (
    <label className='flex items-center gap-2 text-sm font-semibold'>
      Sort by
      <select value={params.get('sortBy') || ''} onChange={onChange} className='field w-auto py-2'>
        <option value=''>Featured</option>
        <option value='priceAsc'>Price: low to high</option>
        <option value='priceDesc'>Price: high to low</option>
        <option value='popularity'>Top rated</option>
      </select>
    </label>
  )
}

export default SortOptions
