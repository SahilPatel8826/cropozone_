import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { HiMiniXMark } from 'react-icons/hi2'

const LABELS = { category: 'Category', material: 'Type', region: 'Region', size: 'Pack', color: 'Colour', maxPrice: 'Up to $', search: 'Search' }

const ActiveFilters = () => {
  const [params, setParams] = useSearchParams()
  const chips = []
  Object.keys(LABELS).forEach((key) => {
    params.getAll(key).forEach((raw) => raw.split(',').filter(Boolean).forEach((v) => {
      if (key === 'maxPrice' && Number(v) >= 1000) return
      chips.push({ key, v })
    }))
  })
  if (!chips.length) return null

  const remove = ({ key, v }) => {
    const next = new URLSearchParams()
    params.forEach((val, k) => {
      if (k !== key) return next.append(k, val)
      const kept = val.split(',').filter((x) => x !== v)
      if (kept.length) next.append(k, kept.join(','))
    })
    setParams(next)
  }

  return (
    <div className='mb-6 flex flex-wrap items-center gap-2'>
      {chips.map((c) => (
        <button key={c.key + c.v} onClick={() => remove(c)} className='flex items-center gap-1.5 rounded-full bg-paddy-light px-3 py-1.5 text-sm font-medium text-paddy transition hover:bg-paddy hover:text-white' aria-label={`Remove filter ${LABELS[c.key]} ${c.v}`}>
          {LABELS[c.key]}: {c.v}<HiMiniXMark className='h-4 w-4' />
        </button>
      ))}
      <button onClick={() => setParams(new URLSearchParams())} className='px-2 text-sm font-semibold underline'>Clear all</button>
    </div>
  )
}

export default ActiveFilters
