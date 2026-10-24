import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import Hero from '../components/Layout/Hero'
import CategoryCollectionSection from '../components/Products/CategoryCollectionSection'
import NewArrivals from '../components/Products/NewArrivals'
import ProductDetails from '../components/Products/ProductDetails'
import ProductGrid from '../components/Products/ProductGrid'
import FeaturedCollection from '../components/Products/FeaturedCollection'
import FeaturesSection from '../components/Products/FeaturesSection'
import CropStrip from '../components/Products/CropStrip'
import CropMarquee from '../components/Products/CropMarquee'
import Reveal from '../components/Common/Reveal'
import FieldBand from '../components/Products/FieldBand'
import RecentlyViewed from '../components/Products/RecentlyViewed'
import { fetchProductsByFilters } from '../redux/slices/productSlice'

const Home = () => {
  const dispatch = useDispatch()
  const { products, loading, error } = useSelector((state) => state.products)
  const [bestSeller, setBestSeller] = useState(null)

  useEffect(() => {
    dispatch(fetchProductsByFilters({ sortBy: 'popularity', limit: 8 }))
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`)
      .then((r) => setBestSeller(r.data))
      .catch((e) => {
        // 404 just means no products in the database yet (run the seeder)
        setBestSeller(false)
        if (e.response?.status !== 404) console.error(e)
      })
  }, [dispatch])

  return (
    <div>
      <Hero />
      <CropStrip />
      <CategoryCollectionSection />
      <NewArrivals />

      {bestSeller !== false && (
        <section className='container mx-auto px-6 pt-8'>
          <Reveal><h2 className='text-3xl font-bold md:text-4xl'>Best seller</h2></Reveal>
        </section>
      )}
      {bestSeller
        ? <ProductDetails productId={bestSeller._id} />
        : bestSeller === null && <div className='container mx-auto px-6 py-6'><div className='skeleton h-96 rounded-2xl' /></div>}

      <section className='container mx-auto px-6 py-16'>
        <div className='mb-8 flex items-end justify-between gap-4'>
          <Reveal><h2 className='text-3xl font-bold md:text-4xl'>Top picks by traders</h2></Reveal>
          <Link to='/collections/all' className='text-sm font-semibold text-paddy underline'>View all</Link>
        </div>
        <ProductGrid products={products} loading={loading} error={error} />
      </section>

      <CropMarquee />
      <FieldBand />
      <FeaturedCollection />
      <RecentlyViewed />
      <FeaturesSection />
    </div>
  )
}

export default Home
