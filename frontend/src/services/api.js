import axios from 'axios';

// Απευθείας σύνδεση στο backend (το CORS είναι ρυθμισμένο)
const API_BASE_URL = 'http://172.201.113.207:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Προσθήκη JWT token σε κάθε request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token.trim()}`;
  } else if (config.url?.includes('checkout')) {
    console.warn('[API] Checkout request without token - user may need to re-login');
  }
  return config;
});

// Χειρισμός 401 (unauthorized) - ΔΕΝ κάνουμε auto-logout εδώ.
// Αφήνουμε τον κάθε caller (π.χ. handleCheckout) να αποφασίσει αν θα κάνει logout ή θα δείξει μήνυμα.
// Αυτό αποτρέπει ακούσιο logout λόγω transient 401 errors.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('[API] 401 on', error.config?.url, '- caller should handle re-auth');
    }
    return Promise.reject(error);
  }
);

// User API
export const userAPI = {
  register: (userData) => api.post('/users/add', userData),
  login: (credentials) => api.post('/users/login', credentials),
  addToCart: (cartData) => api.post('/users/add/cart', cartData),
  getCart: () => api.get('/users/cart'),
  removeFromCart: (productCode) => api.delete(`/users/cart/${productCode}`),
  updateCartItem: (productCode, quantity) => api.put('/users/cart', { productCode, quantity }),
  clearCart: () => api.delete('/users/cart/clear'),
  checkout: (checkoutData) => api.post('/users/checkout', checkoutData),
  getOrders: (username) => api.get(`/users/orders?username=${encodeURIComponent(username)}`),
  getAllOrders: () => api.get('/users/orders/all'),
};

// Product API
export const productAPI = {
  add: (productData) => api.post('/products/add', productData),
  delete: (productCode) => api.delete(`/products/${productCode}`),
  findByCode: (code) => api.post(`/products/find?code=${code}`),
  showAll: () => api.get('/products/showAll'),
  showAllByNamesAsc: () => api.get('/products/showAllByNamesAsc'),
  showAllByPriceAsc: () => api.get('/products/showAllByPriceAsc'),
  showAllByPriceDesc: () => api.get('/products/showAllByPriceDesc'),
};

export default api;

