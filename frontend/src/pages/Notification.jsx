// pages/Notifications.jsx
import React, { useEffect, useState } from 'react';
import { actionAPI } from '../services/authAPI.js';
import {
  Bell,
  Heart,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await actionAPI.getUserNotifications();
      setNotifications(res?.notifications || []);
    } catch (err) {
      console.error(err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'product_favorited':
        return <Heart className="w-4 h-4 text-pink-500" />;
      case 'new_inquiry':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'product_approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'product_rejected':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'product_sold':
        return <ShoppingBag className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
      onClick={() => onClose()}
    >
      <div
        className="bg-white w-full max-w-xl h-[80vh] rounded-xl shadow-lg flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-500" />
            <h2 className="font-semibold">Notifications</h2>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading && (
            <div className="text-center text-gray-500">Loading...</div>
          )}

          {!loading && notifications.length === 0 && (
            <div className="text-center text-gray-500">No notifications</div>
          )}

          {notifications.map((n, i) => (
            <div
              key={n._id || i}
              className="flex gap-3 p-3 border rounded-lg hover:bg-gray-50"
            >
              {getIcon(n.type)}
              <div className="flex-1">
                <h4 className="text-sm font-medium">{n.title}</h4>
                <p className="text-xs text-gray-600 mb-1">{n.message}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-gray-400">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                  {n.data?.productId && (
                    <button
                      onClick={() => {
                        navigate(`/product/${n.data.productId}`);
                        onClose();
                      }}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View Product
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
