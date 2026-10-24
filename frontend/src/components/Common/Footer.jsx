import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { TbBrandMeta } from 'react-icons/tb'
import { IoLogoInstagram } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'
import { FiPhoneCall, FiMail } from 'react-icons/fi'
import bg from '../../assets/oat-opt.webp'

const Col = ({ title, children }) => (
  <div>
    <h3 className='mb-4 text-lg font-semibold'>{title}</h3>
    <ul className='space-y-2 text-white/75'>{children}</ul>
  </div>
)
const item = (to, label) => <li key={label}><Link to={to} className='transition hover:text-turmeric'>{label}</Link></li>

const Footer = () => {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)

  const subscribe = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/subscribe`, { email })
      toast.success(data.message || 'You’re subscribed')
      setEmail('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Couldn’t subscribe. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <footer id='contact' className='relative isolate mt-24 overflow-hidden bg-soil text-white'>
      <img src={bg} alt='' loading='lazy' className='absolute inset-0 -z-20 h-full w-full object-cover' />
      <div className='absolute inset-0 -z-10 bg-soil/90' />
      <div className='container mx-auto grid gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-4'>
        <div className='lg:pr-6'>
          <p className='font-display text-2xl font-extrabold text-turmeric'>CropOzone</p>
          <p className='mt-3 text-white/75'>Get new listings and seasonal rates by email. First order gets 10% off.</p>
          <form onSubmit={subscribe} className='mt-5 flex'>
            <label htmlFor='nl-email' className='sr-only'>Email address</label>
            <input id='nl-email' type='email' required value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Your email' className='w-full rounded-l-full bg-white/10 px-4 py-3 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-turmeric' />
            <button disabled={busy} className='rounded-r-full bg-turmeric px-5 text-sm font-semibold text-soil transition hover:bg-turmeric-dark hover:text-white disabled:opacity-60'>{busy ? 'Joining…' : 'Subscribe'}</button>
          </form>
        </div>
        <Col title='Shop'>
          {item('/collections/all', 'All crops')}
          {item('/collections/all?category=Fruits', 'Fruits')}
          {item('/collections/all?category=Vegetables', 'Vegetables')}
          {item('/collections/all?category=Grains', 'Grains')}
          {item('/collections/all?material=Organic', 'Organic')}
        </Col>
        <Col title='Account'>
          {item('/profile', 'My orders')}
          {item('/wishlist', 'Wishlist')}
          {item('/login', 'Sign in')}
          {item('/register', 'Create account')}
        </Col>
        <div>
          <h3 className='mb-4 text-lg font-semibold'>Contact</h3>
          <p className='flex items-center gap-2 text-white/75'><FiPhoneCall /> +91 12345 67890</p>
          <p className='mt-2 flex items-center gap-2 text-white/75'><FiMail /> hello@cropozone.com</p>
          <div className='mt-5 flex gap-4'>
            <a href='https://www.facebook.com' aria-label='Meta' className='hover:text-turmeric'><TbBrandMeta className='h-5 w-5' /></a>
            <a href='https://www.instagram.com' aria-label='Instagram' className='hover:text-turmeric'><IoLogoInstagram className='h-5 w-5' /></a>
            <a href='https://www.twitter.com' aria-label='X' className='hover:text-turmeric'><RiTwitterXLine className='h-5 w-5' /></a>
          </div>
        </div>
      </div>
      <p className='border-t border-white/15 py-5 text-center text-sm text-white/60'>© {new Date().getFullYear()} CropOzone. All rights reserved.</p>
    </footer>
  )
}

export default Footer
