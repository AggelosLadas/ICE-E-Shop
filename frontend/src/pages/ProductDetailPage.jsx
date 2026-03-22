import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../services/api';
import { mockProducts } from '../data/mockProducts';

const ProductDetailPage = () => {
  const { productCode } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // First try to fetch from backend
        const response = await productAPI.findByCode(productCode);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching from backend, using mock data:', error);
        // If backend fails, use mock products
        const mockProduct = mockProducts.find(
          p => p.productCode === parseInt(productCode)
        );
        if (mockProduct) {
          setProduct(mockProduct);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productCode]);

  const handleDelete = async () => {
    if (!window.confirm(`Θέλετε να διαγράψετε το "${product.productName}";`)) return;
    try {
      await productAPI.delete(product.productCode);
      navigate('/products');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Αποτυχία διαγραφής.');
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    setSizeError(false);
    await addToCart(product, quantity);

    alert(`${quantity} x ${selectedSize} added to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
          <Link to="/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const sizes = ['EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'];

  // Only show thumbnails when we have more than one image (e.g. product.images from API)
  const imageList = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : (product.productImage ? [product.productImage] : []);
  const hasMultipleImages = imageList.length > 1;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button - top left */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-primary font-semibold transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm">
          <Link to="/" className="text-gray-500 hover:text-primary">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/products" className="text-gray-500 hover:text-primary">Products</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">{product.productName}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-12 aspect-square flex items-center justify-center shadow-lg">
              {product.productImage ? (
                <img
                  src={product.productImage}
                  alt={product.productName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-9xl">👟</div>
              )}
            </div>

            {/* Thumbnail gallery: only when there are other available photos */}
            {hasMultipleImages && (
              <div className="grid grid-cols-4 gap-4">
                {imageList.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    className="bg-white rounded-lg p-2 aspect-square flex items-center justify-center overflow-hidden cursor-pointer hover:border-2 hover:border-primary transition border-2 border-transparent"
                  >
                    {img ? (
                      <img src={img} alt={`${product.productName} ${i + 1}`} className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-4xl">👟</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-3">
                {product.productName}
              </h1>
              
              {/* Price */}
              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-5xl font-black text-primary">
                  ${product.productPrice?.toFixed(2)}
                </span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2 mb-6">
                {product.productQuantity > 0 ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600 font-semibold">
                      In Stock ({product.productQuantity} available)
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-red-600 font-semibold">Out of Stock</span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-b border-gray-200 py-6">
              <h3 className="text-lg font-bold mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.productDescription || 'Experience ultimate comfort and style with these premium shoes. Crafted with high-quality materials and designed for everyday wear.'}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-bold mb-3">Select Size</h3>
              <div className="grid grid-cols-4 gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`py-3 px-4 rounded-lg border-2 font-semibold transition ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-white'
                        : sizeError
                          ? 'border-red-400 hover:border-primary'
                          : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {sizeError && (
                <p className="text-red-500 font-semibold mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Please select a size before adding to cart
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-bold mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl"
                >
                  -
                </button>
                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.productQuantity, quantity + 1))}
                  className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={product.productQuantity === 0}
                className={`flex-1 py-4 rounded-xl font-bold text-lg transition ${
                  product.productQuantity === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-secondary shadow-lg'
                }`}
              >
                Add to Cart
              </button>
              {user?.role === 'ADMIN' && (
                <button
                  onClick={handleDelete}
                  className="px-6 py-4 rounded-xl font-bold text-lg bg-red-500 hover:bg-red-600 text-white transition shadow-lg"
                >
                  Διαγραφή
                </button>
              )}
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-xl p-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Product Code:</span>
                <span className="font-semibold">{product.productCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-semibold">Sneakers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Brand:</span>
                <span className="font-semibold">Premium</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🚚</div>
            <h4 className="font-bold mb-2">Free Shipping</h4>
            <p className="text-sm text-gray-600">On orders over $50</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">↩️</div>
            <h4 className="font-bold mb-2">Easy Returns</h4>
            <p className="text-sm text-gray-600">30-day return policy</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h4 className="font-bold mb-2">Authentic</h4>
            <p className="text-sm text-gray-600">100% genuine products</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h4 className="font-bold mb-2">Secure Payment</h4>
            <p className="text-sm text-gray-600">Safe transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

