import React from 'react'
import { HiOutlineCreditCard, HiOutlineTruck } from 'react-icons/hi2'
import { HiArrowPathRoundedSquare } from 'react-icons/hi2'

const items = [
  { Icon: HiOutlineTruck, title: 'Free delivery over $100', text: 'Shipped straight from the farm.' },
  { Icon: HiArrowPathRoundedSquare, title: '45-day returns', text: 'Money back if the lot isn’t as listed.' },
  { Icon: HiOutlineCreditCard, title: 'Secure checkout', text: 'Payments handled by PayPal.' },
]

const FeaturesSection = () => (
  <section className='container mx-auto grid gap-8 px-6 py-12 md:grid-cols-3'>
    {items.map(({ Icon, title, text }) => (
      <div key={title} className='flex items-start gap-4'>
        <span className='grid h-12 w-12 shrink-0 place-items-center rounded-full bg-paddy-light text-paddy'><Icon className='h-6 w-6' /></span>
        <div>
          <h4 className='font-semibold'>{title}</h4>
          <p className='text-sm text-soil-soft'>{text}</p>
        </div>
      </div>
    ))}
  </section>
)

export default FeaturesSection
