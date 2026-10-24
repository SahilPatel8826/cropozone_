import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ProductGrid from './ProductGrid';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchProductDetails, fetchSimilarProducts } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { imgUrl } from '../../utils/img';
import { pushRecent } from '../../utils/recentlyViewed';
import RecentlyViewed from './RecentlyViewed';

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { userId, guestId } = useSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      const firstImage = getFullImageUrl(selectedProduct.images[0].src);
      setMainImage(firstImage);
    }
  }, [selectedProduct]);

  const getFullImageUrl = imgUrl;

  useEffect(() => {
    if (!productId && selectedProduct) pushRecent(selectedProduct);
  }, [selectedProduct, productId]);

  const handleQuantityChange = (action) => {
    if (action === 'plus') setQuantity((prev) => prev + 1);
    if (action === 'minus' && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please select a size and color before adding to cart', {
        duration: 1000,
      });
      return;
    }

    setIsButtonDisabled(true);
    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId,
      })
    )
      .then(() => {
        toast.success('Product added to the cart!', {
          duration: 1000,
        });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      {selectedProduct && (
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
          <div className="flex flex-col md:flex-row">
            {/* Desktop Thumbnails */}
            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectedProduct.images.map((image, index) => {
                const fullImage = getFullImageUrl(image.src);
                return (
                  <img
                    key={index}
                    src={fullImage}
                    alt={image.altText || `Thumbnail ${index}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                      mainImage === fullImage ? 'border-black' : 'border-gray-300'
                    }`}
                    onClick={() => setMainImage(fullImage)}
                  />
                );
              })}
            </div>

            {/* Main Image */}
            <div className="md:w-1/2">
              <div className="mb-4">
                <img
                  src={mainImage}
                  alt="Main Product"
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Mobile Thumbnails */}
            <div className="md:hidden flex overflow-x-scroll space-x-4 mb-4">
              {selectedProduct.images.map((image, index) => {
                const fullImage = getFullImageUrl(image.src);
                return (
                  <img
                    key={index}
                    src={fullImage}
                    alt={image.altText || `Thumbnail ${index}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                      mainImage === fullImage ? 'border-black' : 'border-gray-300'
                    }`}
                    onClick={() => setMainImage(fullImage)}
                  />
                );
              })}
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 md:ml-10">
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                {selectedProduct.name}
              </h1>
              <p className="text-lg text-gray-600 mb-1 line-through">
                {selectedProduct.originalPrice && `$${selectedProduct.originalPrice}`}
              </p>
              <p className="text-xl text-gray-500 mb-2">${selectedProduct.price}</p>
              <p className="text-gray-600 mb-4">{selectedProduct.description}</p>

              {/* Color Selection */}
              <div className="mb-4">
                <p className="text-gray-700">Color:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border ${
                        selectedColor === color
                          ? 'border-4 border-black'
                          : 'border-gray-300'
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase(),
                        filter: 'brightness(0.5)',
                      }}
                    ></button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-4">
                <p className="text-gray-700">Size:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded border ${
                        selectedSize === size ? 'text-white bg-paddy' : ''
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <p className="text-gray-700">Quantity:</p>
                <div className="flex items-center space-x-4 mt-2">
                  <button
                    onClick={() => handleQuantityChange('minus')}
                    className="px-2 py-1 bg-gray-200 rounded text-lg"
                  >
                    -
                  </button>
                  <span className="text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange('plus')}
                    className="px-2 py-1 bg-gray-200 rounded text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className={`bg-paddy text-white py-2 px-6 rounded w-full mb-4 ${
                  isButtonDisabled
                    ? 'cursor-not-allowed opacity-50'
                    : 'hover:bg-paddy-dark'
                }`}
              >
                {isButtonDisabled ? 'Adding...' : 'ADD TO CART'}
              </button>

              {/* Product Characteristics */}
              <div className="mt-10 text-gray-700">
                <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
                <table className="w-full text-left text-sm text-gray-600">
                  <tbody>
                    <tr>
                      <td className="py-1">Brand</td>
                      <td className="py-1">{selectedProduct.brand}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Material</td>
                      <td className="py-1">{selectedProduct.material || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-6">You may also like</h2>
            <ProductGrid products={similarProducts} loading={loading} error={error} />
          </div>
        </div>
      )}
      {!productId && selectedProduct && <RecentlyViewed excludeId={selectedProduct._id} />}
    </div>
  );
};

export default ProductDetails;
