
// api/shop/cart/add/route.js
import Cart from "@/models/shop/cart";
import Product from "@/models/seller/Product";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, anonymousCartId, productId, quantity } = body;

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return new Response("Invalid product ID", { status: 400 });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return new Response("Product not found", { status: 404 });
    }

    let cart;

    // 🧠 Prioritize userId if available, fallback to anonymousCartId
    if (userId) {
      cart = await Cart.findOne({ userId });
    }

    if (!cart && anonymousCartId) {
      cart = await Cart.findOne({ anonymousCartId });
    }

    // ✅ Create new cart if not found
    if (!cart) {
      cart = new Cart({
        userId: userId || undefined,
        anonymousCartId: anonymousCartId || undefined,
        items: [{ productId, quantity }],
        totalPrice: product.price * quantity,
        totalQuantity: quantity,
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (existingItemIndex >= 0) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      // Efficient recalculation
      const productIds = cart.items.map((item) => item.productId);
      const products = await Product.find({ _id: { $in: productIds } });

      let totalPrice = 0;
      let totalQuantity = 0;

      cart.items.forEach((item) => {
        const matchedProduct = products.find(
          (p) => p._id.toString() === item.productId.toString()
        );
        if (matchedProduct) {
          totalPrice += matchedProduct.price * item.quantity;
          totalQuantity += item.quantity;
        }
      });

      cart.totalPrice = totalPrice;
      cart.totalQuantity = totalQuantity;
    }

    await cart.save();
    return new Response(JSON.stringify(cart), { status: 200 });
  } catch (error) {
    console.error("Cart Add Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

