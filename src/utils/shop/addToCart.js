// utils/shop/addToCart.js
export const addToCart = async ({ productId, quantity = 1 }) => {
  try {
    let userId = null;
    let anonymousCartId = null;

    // 1. Check if user is logged in
    const authRes = await fetch("/api/user/auth/me", {
      method: "GET",
      credentials: "include",
    });

    if (authRes.ok) {
      const { user } = await authRes.json();
      userId = user._id;
    } else {
      // 2. Use or generate anonymousCartId
      if (typeof window !== "undefined") {
        anonymousCartId = localStorage.getItem("anonymousCartId");
        if (!anonymousCartId) {
          anonymousCartId = crypto.randomUUID(); // or a nanoid
          localStorage.setItem("anonymousCartId", anonymousCartId);
        }
      }
    }

    // 3. Send add-to-cart request
    const res = await fetch("/api/shop/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        anonymousCartId,
        productId,
        quantity,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to add to cart.");
    }

    const updatedCart = await res.json();
    return updatedCart;
  } catch (err) {
    console.error("Add to cart error:", err);
    throw err;
  }
};
