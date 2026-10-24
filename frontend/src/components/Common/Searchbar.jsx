import React, { useEffect, useRef, useState } from 'react'
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'

const KEY = 'cropozone:searches'
const POPULAR = ['Rice', 'Wheat', 'Tomato', 'Mango', 'Potato', 'Banana']
const readRecent = () => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } }

const Searchbar = () => {
  const [term, setTerm] = useState('')
  const [open, setOpen] = useState(false)
  const [recent, setRecent] = useState([])
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    setRecent(readRecent())
    inputRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  const go = (q) => {
    const value = q.trim()
    if (!value) return
    try { localStorage.setItem(KEY, JSON.stringify([value, ...readRecent().filter((r) => r !== value)].slice(0, 5))) } catch { /* storage unavailable */ }
    navigate(`/collections/all?search=${encodeURIComponent(value)}`)
    setOpen(false)
    setTerm('')
  }

  const chip = 'rounded-full border border-soil/15 px-3 py-1.5 text-sm transition hover:border-paddy hover:bg-paddy hover:text-white'

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label='Search crops' className='hover:text-paddy'>
        <HiMagnifyingGlass className='h-6 w-6' />
      </button>
      {open && (
        <div className='fixed inset-0 z-[60] bg-soil/60 backdrop-blur-sm' onClick={() => setOpen(false)} role='dialog' aria-modal='true' aria-label='Search'>
          <div className='bg-mist px-6 pb-8 pt-6 shadow-xl' onClick={(e) => e.stopPropagation()}>
            <form onSubmit={(e) => { e.preventDefault(); go(term) }} className='container mx-auto flex max-w-2xl items-center gap-3 border-b-2 border-paddy pb-2'>
              <HiMagnifyingGlass className='h-6 w-6 shrink-0 text-paddy' />
              <input ref={inputRef} value={term} onChange={(e) => setTerm(e.target.value)} placeholder='Search rice, tomato, mango…' className='w-full bg-transparent font-display text-2xl focus:outline-none' />
              <button type='button' onClick={() => setOpen(false)} aria-label='Close search'><HiMiniXMark className='h-7 w-7' /></button>
            </form>
            <div className='container mx-auto mt-6 max-w-2xl space-y-5'>
              {recent.length > 0 && (
                <div>
                  <p className='mb-2 text-sm font-semibold text-soil-soft'>Recent searches</p>
                  <div className='flex flex-wrap gap-2'>{recent.map((r) => <button key={r} onClick={() => go(r)} className={chip}>{r}</button>)}</div>
                </div>
              )}
              <div>
                <p className='mb-2 text-sm font-semibold text-soil-soft'>Popular crops</p>
                <div className='flex flex-wrap gap-2'>{POPULAR.map((r) => <button key={r} onClick={() => go(r)} className={chip}>{r}</button>)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Searchbar
