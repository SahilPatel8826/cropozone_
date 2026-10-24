import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { HiOutlineUser, HiOutlineShoppingBag, HiOutlineHeart, HiBars3BottomRight } from 'react-icons/hi2'
import { IoMdClose } from 'react-icons/io'
import { useSelector } from 'react-redux'
import Searchbar from './Searchbar'
import CartDrawer from '../Layout/CartDrawer'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/collections/all', label: 'Shop', end: true },
  { to: '/collections/all?category=Fruits&category=Vegetables', label: 'Fruits and vegetables' },
  { to: '/collections/all?category=Grains', label: 'Grains' },
]

const Navbar = () => {
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { cart } = useSelector((s) => s.cart)
  const { user } = useSelector((s) => s.auth)
  const wishCount = useSelector((s) => s.wishlist.items.length)
  const { pathname } = useLocation()
  const cartCount = cart?.products?.reduce((t, p) => t + p.quantity, 0) || 0

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => setMenuOpen(false), [pathname])

  const toContact = () => {
    setMenuOpen(false)
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }
  const linkCls = ({ isActive }) => `text-sm font-semibold transition hover:text-paddy ${isActive ? 'text-paddy' : 'text-soil-soft'}`
  const badge = 'absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-chilli px-1 text-[11px] font-bold text-white'

  return (
    <>
      <header className={`sticky top-0 z-40 bg-mist/90 backdrop-blur transition-shadow ${scrolled ? 'shadow-[0_1px_0_rgba(42,31,22,0.12)]' : ''}`}>
        <nav className='container mx-auto flex items-center justify-between px-6 py-4' aria-label='Main'>
          <Link to='/' className='font-display text-2xl font-extrabold text-paddy'>CropOzone</Link>

          <div className='hidden items-center gap-8 md:flex'>
            {links.map((l) => <NavLink key={l.label} to={l.to} end={l.end} className={() => linkCls({ isActive: l.end ? pathname === l.to : false })}>{l.label}</NavLink>)}
            <button onClick={toContact} className='text-sm font-semibold text-soil-soft transition hover:text-paddy'>Contact</button>
          </div>

          <div className='flex items-center gap-4'>
            {user?.role === 'admin' && <Link to='/admin' className='rounded-full bg-soil px-3 py-1 text-xs font-semibold text-white'>Admin</Link>}
            <Searchbar />
            <Link to='/wishlist' aria-label='Wishlist' className='relative hover:text-paddy'>
              <HiOutlineHeart className='h-6 w-6' />
              {wishCount > 0 && <span key={wishCount} className={`${badge} bump`}>{wishCount}</span>}
            </Link>
            <Link to={user ? '/profile' : '/login'} aria-label={user ? 'Profile' : 'Sign in'} className='hover:text-paddy'><HiOutlineUser className='h-6 w-6' /></Link>
            <button onClick={() => setCartOpen(true)} aria-label='Open cart' className='relative hover:text-paddy'>
              <HiOutlineShoppingBag className='h-6 w-6' />
              {cartCount > 0 && <span key={cartCount} className={`${badge} bump`}>{cartCount}</span>}
            </button>
            <button onClick={() => setMenuOpen(true)} aria-label='Open menu' className='md:hidden'><HiBars3BottomRight className='h-6 w-6' /></button>
          </div>
        </nav>
      </header>

      <CartDrawer drawerOpen={cartOpen} toggleCartDrawer={() => setCartOpen((o) => !o)} />

      {menuOpen && <div className='fixed inset-0 z-40 bg-soil/50 md:hidden' onClick={() => setMenuOpen(false)} />}
      <aside className={`fixed left-0 top-0 z-50 h-full w-3/4 max-w-xs bg-mist p-6 shadow-xl transition-transform duration-300 md:hidden ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`} aria-hidden={!menuOpen}>
        <div className='mb-8 flex items-center justify-between'>
          <span className='font-display text-xl font-extrabold text-paddy'>CropOzone</span>
          <button onClick={() => setMenuOpen(false)} aria-label='Close menu'><IoMdClose className='h-6 w-6' /></button>
        </div>
        <div className='flex flex-col gap-5 text-lg font-semibold'>
          {links.map((l) => <Link key={l.label} to={l.to}>{l.label}</Link>)}
          <Link to='/wishlist'>Wishlist</Link>
          <button onClick={toContact} className='text-left'>Contact</button>
        </div>
      </aside>
    </>
  )
}

export default Navbar
