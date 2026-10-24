import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { HiHeart, HiOutlineHeart } from 'react-icons/hi2'
import { toast } from 'sonner'
import { toggleWishlist } from '../../redux/slices/wishlistSlice'
import { imgUrl } from '../../utils/img'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const saved = useSelector((s) => s.wishlist.items.some((x) => x._id === product._id))
  const [first, second] = product.images || []
  const outOfStock = product.countInStock === 0
  const hasDeal = product.discountPrice > product.price
  const off = hasDeal ? Math.round((1 - product.price / product.discountPrice) * 100) : 0

  const onHeart = () => {
    dispatch(toggleWishlist(product))
    toast(saved ? 'Removed from wishlist' : 'Saved to wishlist', { duration: 1200 })
  }

  return (
    <article className='group relative'>
      <Link to={`/products/${product._id}`} className='block'>
        <div className='relative aspect-[4/5] overflow-hidden rounded-2xl bg-white'>
          {first && (
            <img
              src={imgUrl(first.src)}
              alt={first.altText || product.name}
              loading='lazy'
              className={`absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105 ${second ? 'group-hover:opacity-0' : ''} ${outOfStock ? 'grayscale' : ''}`}
            />
          )}
          {second && (
            <img src={imgUrl(second.src)} alt='' loading='lazy' className='absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100' />
          )}
          <div className='absolute left-3 top-3 flex flex-col items-start gap-1.5'>
            {outOfStock && <span className='rounded-full bg-soil px-2.5 py-1 text-xs font-semibold text-white'>Out of stock</span>}
            {off > 0 && !outOfStock && <span className='rounded-full bg-chilli px-2.5 py-1 text-xs font-semibold text-white'>{off}% off</span>}
          </div>
        </div>
        <div className='mt-3 flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <h3 className='truncate font-display text-base font-semibold'>{product.name}</h3>
            <p className='truncate text-sm text-soil-soft'>{[product.category, product.region].filter(Boolean).join(', ')}</p>
          </div>
          <div className='shrink-0 text-right'>
            <p className='font-semibold tabular-nums'>${product.price}</p>
            {hasDeal && <p className='text-xs text-soil-soft line-through tabular-nums'>${product.discountPrice}</p>}
          </div>
        </div>
      </Link>
      <button
        onClick={onHeart}
        aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={saved}
        className='absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-110'
      >
        {saved ? <HiHeart className='pop h-5 w-5 text-chilli' /> : <HiOutlineHeart className='h-5 w-5' />}
      </button>
    </article>
  )
}

export default ProductCard
