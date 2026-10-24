import React from 'react'
import { Link } from 'react-router-dom'

const AuthShell = ({ image, title, subtitle, children, footer, caption }) => (
  <div className='grid min-h-[calc(100vh-8rem)] md:grid-cols-2'>
    <div className='flex flex-col justify-center px-6 py-12 md:px-16'>
      <div className='mx-auto w-full max-w-md'>
        <Link to='/' className='font-display text-xl font-extrabold text-paddy'>CropOzone</Link>
        <h1 className='mt-8 text-4xl font-bold'>{title}</h1>
        <p className='mt-2 text-soil-soft'>{subtitle}</p>
        <div className='mt-8'>{children}</div>
        <p className='mt-6 text-sm text-soil-soft'>{footer}</p>
      </div>
    </div>
    <div className='relative hidden md:block'>
      <img src={image} alt='' className='absolute inset-0 h-full w-full object-cover' />
      <div className='absolute inset-0 bg-gradient-to-t from-soil/70 via-transparent to-transparent' />
      <p className='absolute bottom-10 left-10 right-10 font-display text-3xl font-bold leading-tight text-white'>{caption}</p>
    </div>
  </div>
)

export default AuthShell
