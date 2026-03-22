import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';
import { mockProducts } from '../data/mockProducts';

const ProductsPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState('');

  // Fetch products from API (or fallback to mock)
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let response;
      if (sortBy === 'name') response = await productAPI.showAllByNamesAsc();
      else if (sortBy === 'price-low') response = await productAPI.showAllByPriceAsc();
      else if (sortBy === 'price-high') response = await productAPI.showAllByPriceDesc();
      else response = await productAPI.showAll();
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching products, using mock data:', err);
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [sortBy, location.key]);

  // Load search query from URL params
  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  // Extract unique brands
  const brands = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Converse'];

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.productDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.productPrice >= priceRange[0] && product.productPrice <= priceRange[1];
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.some(brand =>
      product.productName.toLowerCase().includes(brand.toLowerCase())
    );
    return matchesSearch && matchesPrice && matchesBrand;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-3">Shoes Collection</h1>
          <p className="text-xl text-gray-600">
            Discover the perfect shoes for your style
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search for shoes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-lg"
            />
            <svg className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border-2 border-gray-200 px-6 py-4 rounded-xl hover:border-primary transition font-semibold outline-none cursor-pointer"
          >
            <option value="">Sort By</option>
            <option value="name">Name (A-Z)</option>
            <option value="price-low">Price (Low to High)</option>
            <option value="price-high">Price (High to Low)</option>
          </select>

          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`bg-white border-2 px-6 py-4 rounded-xl transition font-semibold ${showFilters ? 'border-primary bg-primary text-white' : 'border-gray-200 hover:border-primary'}`}
          >
            <span className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filters</span>
              {(selectedBrands.length > 0 || priceRange[0] !== 0 || priceRange[1] !== 500) && (
                <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">
                  {selectedBrands.length + ((priceRange[0] !== 0 || priceRange[1] !== 500) ? 1 : 0)}
                </span>
              )}
            </span>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-8 bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Price Range */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <span className="text-2xl mr-2">💰</span>
                  Price Range
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-24 px-3 py-2 border-2 border-gray-200 rounded-lg outline-none focus:border-primary"
                      placeholder="Min"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-24 px-3 py-2 border-2 border-gray-200 rounded-lg outline-none focus:border-primary"
                      placeholder="Max"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Brands */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <span className="text-2xl mr-2">👟</span>
                  Brands
                </h3>
                <div className="space-y-3">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                      />
                      <span className="text-gray-700 group-hover:text-primary transition font-medium">
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedBrands.length > 0 || priceRange[0] !== 0 || priceRange[1] !== 500) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setPriceRange([0, 500]);
                  }}
                  className="text-red-500 hover:text-red-700 font-semibold flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Clear All Filters</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 font-medium">
            {loading ? 'Loading...' : <>Showing <span className="text-primary font-bold">{filteredProducts.length}</span> results</>}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👟</div>
            <p className="text-xl text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.productCode} product={product} onProductDeleted={fetchProducts} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;

