"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [updating, setUpdating] = useState({});
  const [error, setError] = useState("");

  // Fetch orders initially
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/seller/orders", {
          withCredentials: true,
        });
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch orders.");
      }
    };
    fetchOrders();
  }, []);

  // Handle updating order status with optimistic UI
  const updateStatus = async (orderId, newStatus) => {
    setUpdating((prev) => ({ ...prev, [orderId]: true }));

    // Optimistic update: instantly change the status in the frontend
    const updatedOrders = orders.map((order) =>
      order._id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);

    try {
      // Make the actual API call to update the status on the backend
      const { data } = await axios.put(
        `/api/seller/orders/${orderId}`,
        { status: newStatus },
        {
          withCredentials: true,
        }
      );

      // On success, update the order with the correct status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: data.order.status } : order
        )
      );
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update status.");
      
      // Revert back to the old status in case of failure
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: updatedOrders.find(o => o._id === orderId)?.status } : order
        )
      );
    } finally {
      setUpdating((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border p-4 rounded-md bg-white shadow-sm"
            >
              <p className="font-semibold">Order ID: {order._id}</p>
              <p>Buyer: {order.userId?.name} ({order.userId?.email})</p>
              <p>Total: ₹{order.totalPrice}</p>
              <p>Status: <span className="font-medium capitalize">{order.status}</span></p>

              <div className="mt-2">
                <label className="text-sm mr-2">Update Status:</label>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  disabled={updating[order._id]}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="mt-3">
                <p className="text-sm font-medium mb-1">Products:</p>
                <ul className="list-disc list-inside text-sm">
                  {order.orderItems.map((item, idx) => (
                    <li key={idx}>
                      {item.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
