import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import { mockProducts } from '../data/mockProducts';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState(mockProducts);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.showAll();
        if (Array.isArray(response.data) && response.data.length > 0) {
          setFeaturedProducts(response.data);
        }
      } catch (err) {
        console.error('Error fetching products for homepage, using mock:', err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white overflow-hidden">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Neutral dark overlay for text readability - no green tint */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Subtle blobs */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[400px] sm:min-h-[500px]">
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight">
                  DESIGN
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                    &
                  </span>
                  <br />
                  HIGH QUALITY
                </h1>
              </div>
              
              <Link 
                to="/products" 
                className="inline-flex items-center space-x-3 bg-white text-primary hover:bg-gray-100 font-bold py-4 px-10 rounded-full text-lg transition shadow-2xl group"
              >
                <span>View Products</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            
            <div className="relative hidden lg:block">
              {/* Empty space for visual balance - no blur */}
            </div>
          </div>
        </div>
      </div>

      {/* Refine Your Style Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">Refine Your Style</h2>
              <p className="text-gray-600 mt-2">With Our New Arrivals!</p>
            </div>
            <Link to="/products" className="flex items-center space-x-2 text-primary hover:text-secondary font-semibold">
              <span>Explore More</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <Link 
                key={product.productCode} 
                to={`/product/${product.productCode}`}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition group cursor-pointer"
              >
                {product.productImage ? (
                  <img
                    src={product.productImage}
                    alt={product.productName}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                ) : (
                  <div className="p-8 flex items-center justify-center">
                    <div className="text-7xl transform group-hover:scale-110 transition">👟</div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Our Popular Products */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Our Popular Products</h2>
            <Link to="/products" className="flex items-center space-x-2 text-primary hover:text-secondary font-semibold">
              <span>Explore More</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.slice(0, 3).map((product) => {
              return (
                <Link key={product.productCode} to={`/product/${product.productCode}`} className="bg-white rounded-lg p-6 hover:shadow-2xl transition group">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden mb-4 group-hover:scale-105 transition cursor-pointer">
                      {product.productImage ? (
                        <img
                          src={product.productImage}
                          alt={product.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">👟</div>
                      )}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition">{product.productName}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xl font-bold">${product.productPrice.toFixed(2)}</span>
                    <span className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition font-semibold">
                      View Details
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Elegance Craft Section */}
      <div className="bg-gradient-to-br from-primary to-secondary py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-48 h-48 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-48 h-48 bg-accent opacity-20 rounded-full filter blur-3xl"></div>
              <div className="relative z-10 transform hover:scale-105 transition duration-500 rounded-xl overflow-hidden shadow-xl max-w-sm mx-auto md:mx-0">
                <img
                  src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=90"
                  alt="Premium footwear collection"
                  className="w-full aspect-square object-cover"
                />
              </div>
            </div>
            
            <div className="text-white space-y-4">
              <h2 className="text-4xl font-bold leading-tight">
                Elegance Craft<br />
                Accent <span className="text-accent">Shoes</span>
              </h2>
              <p className="text-gray-200 text-base">
                Discover our exclusive collection of handcrafted premium footwear
              </p>
              <Link
                to="/products"
                className="inline-block bg-accent hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full text-sm transition transform hover:scale-105 shadow-xl"
              >
                Start Shopping →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

