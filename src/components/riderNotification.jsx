import { useState, useEffect } from "react";
import { useRiderNotification } from "../hooks/useRiderNotification";

const RiderNotification = ({ order, onAccept, onReject }) => {
  const { startNotification, stopNotification } = useRiderNotification();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (order) {
      setShow(true);
      startNotification();
    }
    return () => {
      stopNotification();
    };
  }, [order]);

  const handleAccept = () => {
    stopNotification();
    setShow(false);
    onAccept(order);
  };

  const handleReject = () => {
    stopNotification();
    setShow(false);
    onReject(order);
  };

  if (!show || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">New Order!</h2>
        <p className="text-center text-gray-600 mb-6">You have a new delivery request</p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Order ID:</span>
            <span className="text-sm font-semibold text-gray-900">#{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Customer:</span>
            <span className="text-sm font-semibold text-gray-900">{order.customer?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Store:</span>
            <span className="text-sm font-semibold text-gray-900">{order.partner?.store_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="text-sm font-semibold text-gray-900">₹{parseFloat(order.total_amount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Address:</span>
            <span className="text-sm font-semibold text-gray-900 text-right">{order.address}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleReject}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiderNotification;
