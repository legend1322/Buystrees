"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authRes = await fetch("/api/user/auth/me", {
          credentials: "include",
        });

        if (authRes.ok) {
          const { user } = await authRes.json();
          if (user?._id) {
            setUserId(user._id);
            fetchOrders(user._id);
          } else {
            setLoading(false);
          }
        } else {
          router.push("/login?redirect=/Shop/orders");
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const fetchOrders = async (uid) => {
    try {
      const res = await fetch(`/api/shop/orders?userId=${uid}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (err) {
      console.error("Orders fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return "Invalid date";
    }
  };

  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link href="/Shop" className="text-blue-600 hover:underline">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg shadow-sm p-4">
              <div className="flex justify-between mb-2">
                <div>
                  <span className="font-semibold">Order #:</span>{" "}
                  <span className="text-gray-700">{order._id?.substring(0, 8)}</span>
                </div>
                <div className="text-gray-600">
                  {formatDate(order.createdAt)}
                </div>
              </div>
              
              <div className="border-t border-b py-3 my-2">
                <p className="font-semibold mb-1">Items:</p>
                {order.orderItems.map((item, index) => (
                  <div key={`${item.product}-${index}`} className="flex justify-between text-sm py-1">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between mt-2">
                <div>
                  <span className="font-semibold">Status:</span>{" "}
                  <span className={order.isPaid ? "text-green-600" : "text-yellow-600"}>
                    {order.isPaid ? "Paid" : "Payment Pending"}
                  </span>
                  {" • "}
                  <span className={order.isDelivered ? "text-green-600" : "text-blue-600"}>
                    {order.isDelivered ? "Delivered" : "Processing"}
                  </span>
                </div>
                <div className="font-semibold">
                  Total: ₹{order.totalPrice?.toFixed(2)}
                </div>
              </div>
              
              <div className="mt-3 text-right">
                <Link 
                  href={`/Shop/orders/${order._id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
