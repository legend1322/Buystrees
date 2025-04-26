"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const router = useRouter();

  const fetchCart = async () => {
    setLoading(true);
    try {
      let uid = null;
      let anonymousCartId = null;

      const authRes = await fetch("/api/user/auth/me", {
        credentials: "include",
      });

      if (authRes.ok) {
        const { user } = await authRes.json();
        uid = user._id;
        setUserId(uid);
      } else {
        anonymousCartId = localStorage.getItem("anonymousCartId");
      }

      const queryParams = new URLSearchParams();
      if (uid) queryParams.set("userId", uid);
      else if (anonymousCartId) queryParams.set("anonymousCartId", anonymousCartId);

      const res = await fetch(`/api/shop/cart?${queryParams.toString()}`);
      const data = await res.json();
      setCart(data.cart);
    } catch (err) {
      console.error("Checkout: Fetch cart error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = async () => {
    const requiredFields = [
      "fullName",
      "phoneNumber",
      "address",
      "city",
      "state",
      "postalCode",
      "country",
    ];

    for (const field of requiredFields) {
      if (!shippingInfo[field]) {
        alert("Please fill all shipping fields.");
        return;
      }
    }

    const res = await fetch("/api/shop/cart/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        shippingAddress: shippingInfo,
      }),
    });

    if (res.ok) {
      router.push("/Shop");
      alert("Order placed successfully!");
    } else {
      alert("Order failed. Please try again.");
    }
  };

  const handleCancel = () => {
    router.push("/Shop/Products"); // Redirect to the products page
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <div className="p-6">Loading checkout...</div>;
  if (!cart || cart.items.length === 0) return <div className="p-6 text-gray-500">Your cart is empty.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {/* Shipping Info */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Shipping Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="fullName" onChange={handleChange} placeholder="Full Name" className="p-2 border rounded" />
          <input name="phoneNumber" onChange={handleChange} placeholder="Phone Number" className="p-2 border rounded" />
          <input name="address" onChange={handleChange} placeholder="Address" className="p-2 border rounded col-span-2" />
          <input name="city" onChange={handleChange} placeholder="City" className="p-2 border rounded" />
          <input name="state" onChange={handleChange} placeholder="State" className="p-2 border rounded" />
          <input name="postalCode" onChange={handleChange} placeholder="Postal Code" className="p-2 border rounded" />
          <input name="country" onChange={handleChange} placeholder="Country" className="p-2 border rounded" />
        </div>
      </div>

      {/* Order Summary */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        <div className="space-y-2">
          {cart.items.map((item) => {
            const product = item.productId;
            if (!product) return null;

            return (
              <div key={product._id} className="flex justify-between border-b py-2">
                <div>{product.name} × {item.quantity}</div>
                <div>₹{(product.price * item.quantity).toFixed(2)}</div>
              </div>
            );
          })}
        </div>
        <p className="text-lg font-semibold text-right">Total: ₹{cart.totalPrice.toFixed(2)}</p>
      </div>

      {/* Confirm & Cancel Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handleCancel}
          className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>

        <button
          onClick={handleConfirmOrder}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
}
