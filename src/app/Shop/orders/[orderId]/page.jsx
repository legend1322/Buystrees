// /app/Shop/orders/[orderId]/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function OrderDetailPage() {
  const { orderId } = useParams(); // ✅ useParams instead of receiving from props
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!orderId) return;

    const checkAuth = async () => {
      try {
        const authRes = await fetch("/api/user/auth/me", {
          credentials: "include",
        });

        if (authRes.ok) {
          const { user } = await authRes.json();
          setUserId(user._id);
          fetchOrderDetails(user._id, orderId);
        } else {
          router.push(`/login?redirect=/Shop/orders/${orderId}`);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setLoading(false);
      }
    };

    checkAuth();
  }, [orderId, router]);

  const fetchOrderDetails = async (uid, oid) => {
    console.log("Fetching order with:", oid, uid);
    try {
      const res = await fetch(`/api/shop/orders/${oid}?userId=${uid}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      } else {
        const error = await res.json();
        console.error("Failed to fetch order:", error);
      }
    } catch (err) {
      console.error("Order details fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  if (loading) return <div className="p-6">Loading order details...</div>;
  if (!order) return <div className="p-6">Order not found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-4">
        <Link href="/Shop/orders" className="text-blue-600 hover:underline">
          ← Back to Orders
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">
        Order #{order._id.substring(0, 8)}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Order Status */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-lg font-semibold mb-3">Order Status</h2>
          <p>
            <span className="font-medium">Placed:</span> {formatDate(order.createdAt)}
          </p>
          <p>
            <span className="font-medium">Payment:</span>{" "}
            <span className={order.isPaid ? "text-green-600" : "text-yellow-600"}>
              {order.isPaid 
                ? `Paid on ${formatDate(order.paidAt)}` 
                : "Payment Pending"}
            </span>
          </p>
          <p>
            <span className="font-medium">Delivery:</span>{" "}
            <span className={order.isDelivered ? "text-green-600" : "text-blue-600"}>
              {order.isDelivered 
                ? `Delivered on ${formatDate(order.deliveredAt)}` 
                : "Processing"}
            </span>
          </p>
        </div>

        {/* Shipping Information */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Shipping Address</h2>
          <p className="font-medium">{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
          <p>{order.shippingAddress.country}</p>
          <p className="mt-2">
            <span className="font-medium">Phone:</span> {order.shippingAddress.phoneNumber}
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div className="border rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Order Items</h2>
        <div className="space-y-4">
          {order.orderItems.map((item, index) => (
            <div key={index} className="flex justify-between border-b pb-3">
              <div className="flex items-center">
                {item.image && (
                  <div className="w-16 h-16 mr-4 bg-gray-100 rounded overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-600">
                    {item.quantity} × ₹{item.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="font-medium">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Items:</span>
            <span>₹{order.itemsPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>₹{order.shippingPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>₹{order.taxPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
            <span>Total:</span>
            <span>₹{order.totalPrice.toFixed(2)}</span>
          </div>
          <div className="mt-4 pt-2 border-t">
            <span className="font-medium">Payment Method:</span> {order.paymentMethod}
          </div>
        </div>
      </div>
    </div>
  );
}