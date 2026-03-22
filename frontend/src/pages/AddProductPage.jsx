import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AddProductPage = () => {
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    productPrice: '',
    productImage: '',
    productQuantity: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-3xl font-bold text-red-600">Access Denied</h2>
        <p className="mt-4">You must be an admin to access this page.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await productAPI.add({
        productName: formData.productName,
        productDescription: formData.productDescription,
        productPrice: parseFloat(formData.productPrice),
        productImage: formData.productImage,
        productQuantity: parseInt(formData.productQuantity)
      });
      
      alert('Product added successfully!');
      navigate('/products');
    } catch (err) {
      setError('Failed to add product. Please try again.');
      console.error('Add product error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Add New Product</h1>

      <form onSubmit={handleSubmit} className="card p-8 space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            id="productName"
            name="productName"
            type="text"
            required
            value={formData.productName}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., Nike Air Max 270"
          />
        </div>

        <div>
          <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="productDescription"
            name="productDescription"
            required
            value={formData.productDescription}
            onChange={handleChange}
            className="input-field"
            rows="3"
            placeholder="Describe the product..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Price ($) *
            </label>
            <input
              id="productPrice"
              name="productPrice"
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.productPrice}
              onChange={handleChange}
              className="input-field"
              placeholder="99.99"
            />
          </div>

          <div>
            <label htmlFor="productQuantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity *
            </label>
            <input
              id="productQuantity"
              name="productQuantity"
              type="number"
              min="0"
              required
              value={formData.productQuantity}
              onChange={handleChange}
              className="input-field"
              placeholder="10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="productImage" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL (optional)
          </label>
          <input
            id="productImage"
            name="productImage"
            type="url"
            value={formData.productImage}
            onChange={handleChange}
            className="input-field"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary"
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="flex-1 btn-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;

