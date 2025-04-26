"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/admin/orders", {
          withCredentials: true,
        });

        if (data.success) {
          setOrders(data.orders || []);
        } else {
          setError("Failed to load orders.");
        }
      } catch (err) {
        console.error("Admin Orders Error:", err);
        setError("An error occurred while fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Manage Orders</h1>
      <p className="text-gray-600 mb-6">Track orders and update their statuses.</p>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="grid gap-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h2>
                <span className="text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-1">
                <strong>User:</strong>{" "}
                {order.userId?.name || "N/A"} ({order.userId?.email || "No email"})
              </p>

              <div className="mt-2 space-y-2">
                {order.orderItems?.map((item, idx) => {
                  const product = item.productId;
                  const seller = product?.seller;

                  return (
                    <div
                      key={idx}
                      className="border border-gray-100 rounded p-2 text-sm bg-gray-50"
                    >
                      <p>
                        <strong>Product:</strong> {product?.name || "N/A"}
                      </p>
                      <p>
                        <strong>Price:</strong> ₹
                        {product?.price ?? item.price}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
                      {seller && (
                        <p className="text-gray-500">
                          <strong>Seller:</strong> {seller.name} ({seller.email})
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex justify-between items-center">
                <p className="font-semibold">
                  Total: ₹{order.totalPrice?.toFixed(2) || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  <span
                    className={
                      order.status?.toLowerCase() === "delivered"
                        ? "text-green-600"
                        : order.status?.toLowerCase() === "cancelled"
                        ? "text-red-600"
                        : "text-blue-600"
                    }
                  >
                    {order.status || "Pending"}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
