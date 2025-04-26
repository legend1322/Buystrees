"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCart = async () => {
    setLoading(true);
    try {
      let uid = null;
      let anonymousCartId = null;

      const authRes = await fetch("/api/user/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (authRes.ok) {
        const { user } = await authRes.json();
        uid = user._id;
        setUserId(uid);

        const anonId = localStorage.getItem("anonymousCartId");
        if (anonId) {
          await fetch("/api/shop/cart/merge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ anonymousCartId: anonId, userId: uid }),
          });
          localStorage.removeItem("anonymousCartId");
        }
      } else {
        if (typeof window !== "undefined") {
          anonymousCartId = localStorage.getItem("anonymousCartId");
        }
      }

      const queryParams = new URLSearchParams();
      if (uid) queryParams.set("userId", uid);
      else if (anonymousCartId) queryParams.set("anonymousCartId", anonymousCartId);

      const res = await fetch(`/api/shop/cart?${queryParams.toString()}`);
      const data = await res.json();
      setCart(data.cart);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    const res = await fetch("/api/shop/cart/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        quantity,
        userId: cart?.userId,
        anonymousCartId: cart?.anonymousCartId,
      }),
    });

    if (res.ok) fetchCart();
  };

  const removeItem = async (productId) => {
    const res = await fetch("/api/shop/cart/remove", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        userId: cart?.userId,
        anonymousCartId: cart?.anonymousCartId,
      }),
    });

    if (res.ok) fetchCart();
  };

  const clearCart = async () => {
    const res = await fetch("/api/shop/cart/clear", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: cart?.userId,
        anonymousCartId: cart?.anonymousCartId,
      }),
    });

    if (res.ok) fetchCart();
  };

  const handleCheckout = () => {
    if (!userId) {
      router.push("/Shop/User/Login?redirect=/cart");
    } else {
      router.push("/Shop/checkout");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <div className="p-6">Loading cart...</div>;

  if (!cart || cart.items.length === 0)
    return <div className="p-6 text-gray-500">Your cart is empty.</div>;

  return (
    <div className=" p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold">Your Cart</h1>

      <div className="space-y-4">
        {cart.items.map((item) => {
          const product = item.productId;
          if (!product || typeof product !== "object" || !product._id) return null;

          return (
            <div key={product._id} className="border rounded-lg p-4 flex gap-4 items-center">
              <img
                src={product.images?.[0] || "/placeholder.jpg"}
                alt={product.name || "Product"}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="font-semibold">{product.name || "Unnamed Product"}</h2>
                <p className="text-sm text-gray-500">₹{(product.price || 0).toFixed(2)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(product._id, item.quantity - 1)}
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(product._id, item.quantity + 1)}
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeItem(product._id)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      <div className="text-right space-y-2">
        <p className="text-lg font-semibold">
          Total: ₹{(cart.totalPrice || 0).toFixed(2)}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={clearCart}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Clear Cart
          </button>
          <button
            onClick={handleCheckout}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
