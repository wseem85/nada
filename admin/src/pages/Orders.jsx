import React, { useState, useMemo, useEffect, useContext } from 'react';

// import { artworks } from '../assets/artworks';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getErrorMessage } from '../utils/errorHandler';
import { AppContext } from '../contexts/contexts';
import FullScreenSpinner from '../components/FullScreenSpinner';
// Mock customer data - in real app, this would come from API
const mockCustomers = {
  '507f1f77bcf86cd799439011': {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
  },
  '507f1f77bcf86cd799439012': {
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 234-5678',
  },
  '507f1f77bcf86cd799439013': {
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+1 (555) 345-6789',
  },
  '507f1f77bcf86cd799439014': {
    name: 'David Thompson',
    email: 'david.thompson@email.com',
    phone: '+1 (555) 456-7890',
  },
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paid' },
    delivered: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Delivered' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

const OrderCard = ({ order, customer, orderArtworks, onStatusUpdate }) => {
  const { backendUrl } = useContext(AppContext);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleMarkDelivered = async () => {
    setIsUpdating(true);
    try {
      // TODO: API call to update order status
      const response = await axios.patch(
        backendUrl + `/api/orders/${order._id}`,
        {
          ...order,
          status: 'delivered',
        }
      );
      console.log(response);
      onStatusUpdate(order._id, 'delivered');
      toast.success('Order marked as delivered');
    } catch (error) {
      console.log(error);
      toast.error('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    setIsUpdating(true);
    try {
      // TODO: API call to cancel order
      await axios.patch(backendUrl + `/api/orders/${order._id}`, {
        ...order,
        status: 'cancelled',
      });
      onStatusUpdate(order._id, 'cancelled');
      toast.success('Order cancelled');
    } catch (error) {
      toast.error('Failed to cancel order');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  console.log(order);
  return (
    <div className="bg-white/80 border border-beige rounded-2xl p-6 mb-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <p className="text-lg font-semibold text-brand">
            Order #{order._id.slice(-8)}
          </p>
          <p className="text-sm text-text/60">{formatDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="space-y-3">
          <p className="font-medium text-text">Customer Details</p>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="text-text/60">Name:</span> {customer.name}
            </p>
            <p className="text-sm">
              <span className="text-text/60">Email:</span> {customer.email}
            </p>
            <p className="text-sm">
              <span className="text-text/60">Phone:</span> {customer.phone}
            </p>
          </div>
        </div>

        {/* Artwork Information */}
        <div className="space-y-3">
          <p className="font-medium text-text">Artwork Details</p>
          <div className="space-y-3">
            {orderArtworks.map((artwork, index) => (
              <div key={artwork._id || index} className="flex gap-3">
                <img
                  src={artwork.images[0]}
                  alt={artwork.title}
                  className="w-16 h-16 object-cover rounded-lg border border-beige"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-text">
                    {artwork.title}
                  </p>
                  <p className="text-xs text-text/60">
                    {artwork.width}" × {artwork.height}"
                  </p>
                  <p className="text-xs text-text/60">
                    $
                    {artwork.discount
                      ? (
                          artwork.price -
                          (artwork.price * artwork.discount) / 100
                        ).toFixed(2)
                      : artwork.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary & Actions */}
        <div className="space-y-3">
          <p className="font-medium text-text">Order Summary</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text/60">Subtotal:</span>
              <span>
                $
                {(
                  order.totalPrice -
                  order.taxAmount -
                  order.shippingAmount
                ).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/60">Tax:</span>
              <span>${order.taxAmount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/60">Shipping:</span>
              <span>${order.shippingAmount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-brand border-t border-beige pt-2">
              <span>Total:</span>
              <span>${order.totalPrice}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-3">
            {order.status === 'paid' && (
              <button
                onClick={handleMarkDelivered}
                disabled={isUpdating}
                className="w-full px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Updating...' : 'Mark as Delivered'}
              </button>
            )}

            {['pending', 'paid'].includes(order.status) && (
              <button
                onClick={handleCancelOrder}
                disabled={isUpdating}
                className="w-full px-4 py-2 border border-red-400 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}

            {order.status === 'delivered' && (
              <p className="text-sm text-green-600 font-medium text-center">
                ✓ Order Delivered
              </p>
            )}

            {order.status === 'cancelled' && (
              <p className="text-sm text-red-600 font-medium text-center">
                ✗ Order Cancelled
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Orders = () => {
  const { artworks } = useContext(AppContext);
  const { backendUrl } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorLoadingOrders, setErrorLoadingOrders] = useState('');
  // const [ordersData, setOrdersData] = useState(orders1);
  const [filter, setFilter] = useState('all');

  // Combine order data with customer and artwork information
  const enrichedOrders = useMemo(() => {
    return orders.map((order) => {
      const customer = mockCustomers[order.user] || {
        name: 'Unknown Customer',
        email: 'unknown@email.com',
        phone: 'N/A',
      };

      const orderArtworks = order.artworks
        .map((artworkId) =>
          artworks.find((artwork) => artwork._id === artworkId)
        )
        .filter(Boolean);

      return {
        ...order,
        customer,
        orderArtworks,
      };
    });
  }, [orders, artworks]);

  // Filter orders by status
  const filteredOrders = useMemo(() => {
    if (filter === 'all') return enrichedOrders;
    return enrichedOrders.filter((order) => order.status === filter);
  }, [enrichedOrders, filter]);

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const statusCounts = useMemo(() => {
    return enrichedOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
  }, [enrichedOrders]);
  useEffect(
    function () {
      async function fetchOrders() {
        try {
          const response = await axios.get(backendUrl + '/api/orders/');
          if (response.data.status === 'success') {
            setOrders(response.data.data.data);
          }
        } catch (err) {
          setErrorLoadingOrders(getErrorMessage(err));
        } finally {
          setLoadingOrders(false);
        }
      }
      fetchOrders();
    },
    [backendUrl]
  );
  z;
  if (loadingOrders) {
    return <FullScreenSpinner />;
  }
  if (errorLoadingOrders) {
    return (
      <div className="flex flex-col relative top-20 gap-8 justify-center items-center">
        <p className="text-2xl tracking-wider text-gray-500">
          Somehing Went Wrong
        </p>
        <p className="text-sm text-red-400">{errorLoadingOrders}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold font-caveat text-brand">
          Orders Management
        </h2>

        {/* Status Filter */}
        <div className="flex gap-2 mt-4 sm:mt-0">
          {[
            { key: 'all', label: 'All', count: enrichedOrders.length },
            { key: 'paid', label: 'Paid', count: statusCounts.paid || 0 },
            {
              key: 'delivered',
              label: 'Delivered',
              count: statusCounts.delivered || 0,
            },
            {
              key: 'pending',
              label: 'pending',
              count: statusCounts.pending || 0,
            },
            {
              key: 'cancelled',
              label: 'Cancelled',
              count: statusCounts.cancelled || 0,
            },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-brand text-white'
                  : 'bg-white/80 text-text/70 border border-beige hover:bg-beige-light'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text/60">
              No orders found for the selected filter.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              customer={order.customer}
              orderArtworks={order.orderArtworks}
              onStatusUpdate={handleStatusUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
