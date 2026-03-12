import { useState } from "react";
import RiderNotification from "../components/riderNotification";

const RiderDemo = () => {
  const [currentOrder, setCurrentOrder] = useState(null);

  const mockOrder = {
    id: 123,
    customer: { name: "John Doe", phone: "+919876543210" },
    partner: { store_name: "Pizza Palace" },
    total_amount: "450.00",
    address: "123 Main Street, Hyderabad"
  };

  const handleNewOrder = () => {
    setCurrentOrder(mockOrder);
  };

  const handleAccept = (order) => {
    console.log("Order accepted:", order);
    setCurrentOrder(null);
  };

  const handleReject = (order) => {
    console.log("Order rejected:", order);
    setCurrentOrder(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Rider Notification Demo</h1>
        <p className="text-gray-600 mb-8">Click the button to simulate a new order notification</p>
        <button
          onClick={handleNewOrder}
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-lg transition shadow-lg"
        >
          Simulate New Order
        </button>
      </div>

      <RiderNotification
        order={currentOrder}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </div>
  );
};

export default RiderDemo;
