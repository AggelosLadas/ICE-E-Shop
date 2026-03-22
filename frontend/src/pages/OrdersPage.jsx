import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('el-GR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const OrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = user?.role === 'ADMIN'
          ? await userAPI.getAllOrders()
          : await userAPI.getOrders(user.username);
        setOrders(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Σφάλμα κατά τη φόρτωση των παραγγελιών.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  if (!user) return null;

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">
        {isAdmin ? 'Όλες οι Παραγγελίες' : 'Οι Παραγγελίες μου'}
      </h1>

      {loading && (
        <div className="text-center py-16">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600">Φόρτωση παραγγελιών...</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-20 card p-12">
          <div className="text-8xl mb-4">📦</div>
          <h2 className="text-2xl font-bold mb-2">
            {isAdmin ? 'Δεν υπάρχουν παραγγελίες ακόμα' : 'Δεν έχετε παραγγελίες ακόμα'}
          </h2>
          <p className="text-gray-600 mb-6">
            {isAdmin ? 'Οι παραγγελίες των πελατών θα εμφανίζονται εδώ.' : 'Όταν ολοκληρώσετε μια αγορά, οι παραγγελίες σας θα εμφανίζονται εδώ.'}
          </p>
          <Link to="/products" className="btn-primary inline-block">
            Αναζήτηση Προϊόντων
          </Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.orderId} className="card p-6">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Παραγγελία #{String(order.orderId).slice(0, 8)}</p>
                  <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                  {isAdmin && order.username && (
                    <p className="text-sm font-semibold text-amber-700 mt-1">👤 {order.username}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    order.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status === 'COMPLETED' ? 'Ολοκληρώθηκε' : order.status}
                  </span>
                  <span className="text-xl font-bold text-primary">${order.totalPrice?.toFixed(2) || '0.00'}</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                {order.orderItems?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-2">
                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.product?.productImage ? (
                        <img src={item.product.productImage} alt={item.product.productName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">👟</span>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-semibold truncate">{item.product?.productName || 'Προϊόν'}</p>
                      <p className="text-sm text-gray-500">Ποσότητα: {item.quantity} × ${item.priceAtPurchase?.toFixed(2) || '0.00'}</p>
                    </div>
                    <p className="font-semibold text-primary">${((item.quantity || 0) * (item.priceAtPurchase || 0)).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
