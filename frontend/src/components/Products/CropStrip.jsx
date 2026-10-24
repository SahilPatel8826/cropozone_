import React from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../Common/Reveal'
import tomato from '../../assets/crops/tomato.webp'
import banana from '../../assets/crops/banana.webp'
import corn from '../../assets/crops/corn.webp'
import broccoli from '../../assets/crops/broccoli.webp'
import pepper from '../../assets/crops/pepper.webp'
import blueberry from '../../assets/crops/blueberry.webp'
import rice from '../../assets/crops/rice.webp'
import wheat from '../../assets/crops/wheat.webp'
import lentils from '../../assets/crops/lentils.webp'
import oats from '../../assets/crops/oats.webp'

export const crops = [
  { name: 'Tomato', img: tomato }, { name: 'Banana', img: banana }, { name: 'Corn', img: corn },
  { name: 'Broccoli', img: broccoli }, { name: 'Pepper', img: pepper }, { name: 'Blueberry', img: blueberry },
  { name: 'Rice', img: rice }, { name: 'Wheat', img: wheat }, { name: 'Lentils', img: lentils }, { name: 'Oats', img: oats },
]

const CropStrip = () => (
  <section className='container mx-auto px-6 pt-16'>
    <Reveal><h2 className='mb-8 text-3xl font-bold md:text-4xl'>Shop by crop</h2></Reveal>
    <div className='-mx-6 flex gap-6 overflow-x-auto px-6 pb-4 [scrollbar-width:none] md:justify-between [&::-webkit-scrollbar]:hidden'>
      {crops.map((c, i) => (
        <Reveal key={c.name} delay={i * 60} className='shrink-0'>
          <Link to={`/collections/all?search=${c.name}`} className='group flex w-24 flex-col items-center gap-3 md:w-28'>
            <span className='relative block h-24 w-24 overflow-hidden rounded-full ring-2 ring-transparent ring-offset-4 ring-offset-mist transition duration-300 group-hover:-translate-y-2 group-hover:ring-turmeric md:h-28 md:w-28'>
              <img src={c.img} alt='' loading='lazy' className='h-full w-full object-cover transition duration-500 group-hover:scale-125 group-hover:rotate-6' />
            </span>
            <span className='text-sm font-semibold transition group-hover:text-paddy'>{c.name}</span>
          </Link>
        </Reveal>
      ))}
    </div>
  </section>
)

export default CropStrip
