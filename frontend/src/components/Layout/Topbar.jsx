import React from 'react'
import { TbBrandMeta } from 'react-icons/tb'
import { IoLogoInstagram } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'

const Topbar = () => (
  <div className='bg-paddy text-sm text-white'>
    <div className='container mx-auto flex items-center justify-between px-6 py-2'>
      <div className='hidden items-center gap-3 md:flex'>
        <a href='https://www.facebook.com' aria-label='Meta' className='hover:text-turmeric'><TbBrandMeta className='h-5 w-5' /></a>
        <a href='https://www.twitter.com' aria-label='X' className='hover:text-turmeric'><RiTwitterXLine className='h-4 w-4' /></a>
        <a href='https://www.instagram.com' aria-label='Instagram' className='hover:text-turmeric'><IoLogoInstagram className='h-5 w-5' /></a>
      </div>
      <p className='flex-1 text-center'>Free delivery on orders over $100</p>
      <a href='tel:+911234567890' className='hidden hover:text-turmeric md:block'>+91 12345 67890</a>
    </div>
  </div>
)

export default Topbar
