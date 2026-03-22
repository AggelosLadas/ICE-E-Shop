import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../services/api';

const ProductCard = ({ product, onProductDeleted }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Θέλετε να διαγράψετε το "${product.productName}";`)) return;
    setDeleting(true);
    try {
      await productAPI.delete(product.productCode);
      onProductDeleted?.();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Αποτυχία διαγραφής.');
    } finally {
      setDeleting(false);
    }
  };

  const handleAddToCart = () => {
    navigate(`/product/${product.productCode}`);
  };

  return (
    <div className="bg-white rounded-lg p-4 hover:shadow-2xl transition-all duration-300 group relative">
      {/* Admin Delete Button */}
      {user?.role === 'ADMIN' && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="absolute top-2 right-2 z-10 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-80 hover:opacity-100 transition shadow-lg"
          title="Διαγραφή προϊόντος"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
      {/* Product Image - Clickable */}
      <Link to={`/product/${product.productCode}`} className="block">
        <div className="h-56 mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-300 cursor-pointer">
          {product.productImage ? (
            <img
              src={product.productImage}
              alt={product.productName}
              className="w-full h-full object-contain p-4"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl transform group-hover:scale-110 transition-transform">
              👟
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="space-y-2">
        <Link to={`/product/${product.productCode}`}>
          <h3 className="text-lg font-bold text-gray-800 truncate group-hover:text-primary transition cursor-pointer">
            {product.productName}
          </h3>
        </Link>
        <div className="flex items-center justify-between pt-3">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${product.productPrice?.toFixed(2)}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.productQuantity === 0}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              product.productQuantity === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-secondary'
            }`}
          >
            {product.productQuantity === 0 ? 'Out of Stock' : 'Select & Buy'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

