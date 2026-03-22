import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart, clearCartLocally, syncError } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [purchaseTotal, setPurchaseTotal] = useState(0);

  const handleCheckout = async () => {
    if (!user) {
      const msg = 'Παρακαλώ συνδεθείτε για να ολοκληρώσετε την αγορά.';
      setError(msg);
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Η σύνδεσή σας έληξε. Παρακαλώ συνδεθείτε ξανά.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const checkoutData = {
        username: user.username,
        items: cart.map(item => ({ productCode: item.productCode, quantity: item.quantity })),
      };
      await userAPI.checkout(checkoutData);
      setPurchaseTotal(getTotalPrice());
      setShowSuccessPopup(true);
    } catch (err) {
      const status = err.response?.status;
      let msg;
      if (status === 401) {
        msg = 'Η σύνδεσή σας έληξε. Παρακαλώ συνδεθείτε ξανά.';
      } else if (status === 500) {
        msg = 'Σφάλμα διακομιστή. Παρακαλώ δοκιμάστε ξανά.';
      } else {
        msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Σφάλμα κατά το checkout.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !showSuccessPopup) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-20">
          <div className="text-8xl mb-4">🛒</div>
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some awesome shoes to get started!</p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const closeSuccessPopup = (redirectTo = '/products') => {
    setShowSuccessPopup(false);
    clearCartLocally();
    navigate(redirectTo);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">Η αγορά ολοκληρώθηκε!</h3>
            <p className="text-gray-600 mb-4">
              Ευχαριστούμε για την παραγγελία σας. Συνολικό ποσό: <span className="font-bold text-primary">${purchaseTotal.toFixed(2)}</span>
            </p>
            <button
              onClick={() => closeSuccessPopup('/orders')}
              className="w-full btn-primary py-3 mb-2"
            >
              Δείτε τις παραγγελίες σας
            </button>
            <button
              onClick={() => closeSuccessPopup('/products')}
              className="w-full py-2 text-gray-600 hover:text-gray-800 font-semibold"
            >
              Συνέχεια αγορών
            </button>
          </div>
        </div>
      )}
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      {syncError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {syncError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.productCode} className="card p-6 flex items-center space-x-4">
              {/* Image */}
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                {item.productImage ? (
                  <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  '👟'
                )}
              </div>

              {/* Info */}
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">{item.productName}</h3>
                <p className="text-gray-600 text-sm">{item.productDescription}</p>
                <p className="text-primary font-bold mt-2">${item.productPrice.toFixed(2)}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.productCode, item.quantity - 1)}
                  className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productCode, item.quantity + 1)}
                  className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold"
                >
                  +
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item.productCode)}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 font-semibold"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {error}
                {error.includes('συνδεθείτε') && (
                  <Link to="/login" state={{ from: '/cart' }} className="block mt-2 font-semibold text-primary hover:underline">
                    Σύνδεση
                  </Link>
                )}
              </div>
            )}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full btn-primary mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Επεξεργασία...' : 'Proceed to Checkout'}
            </button>

            <Link to="/products" className="block text-center text-primary hover:text-secondary font-semibold">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

