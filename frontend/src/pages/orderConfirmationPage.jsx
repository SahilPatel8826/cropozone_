import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";
import { useSelector} from "react-redux";
import { useEffect } from "react";


const OrderConfirmationPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {checkout} = useSelector((state)=>state.checkout);
  
  //CLear the cart when order is confirmed
  useEffect (()=>{
    if(checkout && checkout._id){
      dispatch(clearCart());
      localStorage.removeItem("cart");
    }else{
      navigate("/my-order")
    }

  },[checkout,dispatch,navigate]);
 

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank You For Your Order!
      </h1>

      {checkout && (
        <div className="p-6 rounded-lg border">
          {/* Order ID & Date */}
          <div className="flex justify-between mb-20">
            <div>
              <h2 className="text-xl font-semibold">Order ID: {checkout._id}</h2>
              <p className="text-gray-500">
                Order date: {new Date(checkout.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-emerald-700 text-sm">
                Estimated Delivery: {calculateEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="mb-20">
            {checkout.checkoutItems.map((item) => (
              <div key={item.productId} className="flex items-center mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div>
                  <h4 className="text-md font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    {item.color} | {item.size}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-md">${item.price}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment & Delivery Info */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-2">Payment</h4>
              <p className="text-gray-600">PayPal</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Delivery</h4>
              <p className="text-gray-600">{checkout.shippingAddress.address}</p>
              <p className="text-gray-600">
                {checkout.shippingAddress.city}, {checkout.shippingAddress.country}
              </p>
            </div>
          </div>

          {/* View Order Details Link */}
          <Link
            to={`/admin/order/${checkout._id}`}
            className="inline-block mt-8 text-blue-600 hover:underline"
          >
            View Full Order Details
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
