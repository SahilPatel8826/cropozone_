import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from 'react-icons/fa6'
import { useParams, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import FilterSidebar from '../components/Products/FilterSidebar'
import SortOptions from '../components/Products/SortOptions'
import ProductGrid from '../components/Products/ProductGrid'
import ActiveFilters from '../components/Products/ActiveFilters'
import { fetchProductsByFilters } from '../redux/slices/productSlice'
import grain from '../assets/oat-opt.webp'

const CollectionPage = () => {
  const { collection } = useParams()
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const { products, loading, error } = useSelector((state) => state.products)
  const sidebarRef = useRef(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const search = searchParams.get('search')

  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...Object.fromEntries([...searchParams]) }))
  }, [dispatch, collection, searchParams])

  useEffect(() => {
    const onDown = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) setIsSidebarOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const title = search ? `Results for “${search}”` : collection === 'all' ? 'All crops' : collection

  return (
    <div>
      <div className='relative isolate overflow-hidden bg-soil py-14 text-white'>
        <img src={grain} alt='' className='absolute inset-0 -z-20 h-full w-full object-cover' />
        <div className='absolute inset-0 -z-10 bg-soil/75' />
        <div className='container mx-auto px-6'>
          <h1 className='text-4xl font-bold capitalize md:text-5xl'>{title}</h1>
          <p className='mt-2 text-white/80'>{loading ? 'Loading crops…' : `${products.length} ${products.length === 1 ? 'crop' : 'crops'} found`}</p>
        </div>
      </div>

      <div className='container mx-auto flex flex-col gap-8 px-6 py-10 lg:flex-row'>
        <button onClick={() => setIsSidebarOpen(true)} className='btn-dark self-start lg:hidden'><FaFilter /> Filters</button>

        {isSidebarOpen && <div className='fixed inset-0 z-40 bg-soil/50 lg:hidden' />}
        <aside
          ref={sidebarRef}
          className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-mist transition-transform duration-300 lg:static lg:z-auto lg:w-64 lg:shrink-0 lg:translate-x-0`}
        >
          <FilterSidebar />
        </aside>

        <div className='min-w-0 flex-grow'>
          <div className='mb-6 flex justify-end'><SortOptions /></div>
          <ActiveFilters />
          <ProductGrid products={products} loading={loading} error={error} />
        </div>
      </div>
    </div>
  )
}

export default CollectionPage
