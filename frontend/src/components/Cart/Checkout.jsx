import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { createCheckout } from '../../redux/slices/checkoutSlice'; // adjust path

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!cart || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    console.log("Submit clicked!");
    if (cart && cart.products.length > 0) {
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress,
          paymentMethod: "Paypal",
          totalPrice: cart.totalPrice,
        })
      );
      console.log("👉 dispatch result:", res);
      if (res.payload && res.payload._id) {
        setCheckoutId(res.payload._id);
      }
    }
  };

  const handlePaymentSuccess = async (details) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        { paymentStatus: "paid", paymentDetails: details },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      await handleFinalizedCheckout(checkoutId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFinalizedCheckout = async (checkoutId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalise`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      navigate("/order-confirmation");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Loading cart ...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
      {/* Left Section */}
      <div className='bg-white rounded-lg p-6'>
        <h2 className='text-2xl uppercase mb-6'>Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className='text-lg mb-4'>Contact Details</h3>
          <div className='mb-4'>
            <label className='block text-gray-700'>Email</label>
            <input
              type='email'
              value={user ? user.email : ""}
              className='w-full p-2 border rounded'
              disabled
            />
          </div>

          <h3 className='text-lg mb-4'>Delivery</h3>
          <div className='mb-4 grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-gray-700'>First Name</label>
              <input
                type='text'
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, firstName: e.target.value })
                }
                className='w-full p-2 border rounded'
                required
              />
            </div>
            <div>
              <label className='block text-gray-700'>Last Name</label>
              <input
                type='text'
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, lastName: e.target.value })
                }
                className='w-full p-2 border rounded'
                required
              />
            </div>
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700'>Address</label>
            <input
              type='text'
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, address: e.target.value })
              }
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <div className='mb-4 grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-gray-700'>City</label>
              <input
                type='text'
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, city: e.target.value })
                }
                className='w-full p-2 border rounded'
                required
              />
            </div>
            <div>
              <label className='block text-gray-700'>Postal Code</label>
              <input
                type='text'
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                }
                className='w-full p-2 border rounded'
                required
              />
            </div>
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700'>Country</label>
            <input
              type='text'
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, country: e.target.value })
              }
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700'>Phone</label>
            <input
              type='tel'
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, phone: e.target.value })
              }
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <div className='mt-6'>
            {!checkoutId ? (
              <button
                type="submit"
                className="w-full bg-paddy text-white py-3 rounded"
              >
                Continue to Payment
              </button>
            ) : (
              <div>
                <h3 className='text-lg mb-4'>Pay with PayPal</h3>
                <PayPalButtons
                  amount={cart.totalPrice}
                  onSuccess={handlePaymentSuccess}
                  onError={() => alert("Payment failed")}
                />

                {/* ✅ NEW BUTTON */}
                <button
                  type="button"
                  onClick={() =>
                    handlePaymentSuccess({
                      id: "manual-payment-id",
                      status: "COMPLETED",
                      payer: { email_address: user?.email }
                    })
                  }
                  className="w-full bg-green-600 text-white py-3 rounded mt-4"
                >
                  Directly Complete Order (Mark as Paid)
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* ✅ ORDER SUMMARY */}
      <div className='bg-gray-300 text-black rounded-lg p-6'>
        <h2 className='text-2xl uppercase mb-6 border-b border-gray-700 pb-2'>Order Summary</h2>
        <ul className='divide-y divide-gray-700'>
          {cart.products.map((item) => (
            <li key={item._id} className='flex py-4 space-x-4'>
              <img
                src={item.image}
                alt={item.name}
                className='w-16 h-16 object-cover rounded-md flex-shrink-0'
              />
              <div className='flex-1'>
                <p className='font-semibold text-lg'>{item.name}</p>
                <p className='text-sm text-gray-300 line-clamp-2'>{item.description}</p>
                <p className='text-sm mt-1'>Qty: {item.quantity}</p>
              </div>
              <div className='flex items-center'>
                <p className='font-semibold text-lg'>₹{item.price * item.quantity}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className='border-t border-gray-700 pt-4 mt-4 flex justify-between text-xl font-bold'>
          <span>Total:</span>
          <span>₹{cart.totalPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
