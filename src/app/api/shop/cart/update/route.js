
// app/api/shop/cart/update/route.js
import Cart from "@/models/shop/cart";
import mongoose from "mongoose";

export async function PUT(req) {
  const { userId, anonymousCartId, productId, quantity } = await req.json();

  try {
    // Validate the productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return new Response("Invalid product ID", { status: 400 });
    }

    let cart;

    // Fetch the cart based on userId or anonymousCartId
    if (userId) {
      cart = await Cart.findOne({ userId }).populate("items.productId");
    } else if (anonymousCartId) {
      cart = await Cart.findOne({ anonymousCartId }).populate("items.productId");
    } else {
      return new Response("User ID or Anonymous Cart ID is required", { status: 400 });
    }

    // If cart is not found
    if (!cart) {
      return new Response("Cart not found", { status: 404 });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId._id.toString() === productId
    );

    // If the item is found, update its quantity
    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      return new Response("Item not found in the cart", { status: 404 });
    }

    // Recalculate total price and quantity
    let totalPrice = 0;
    let totalQuantity = 0;

    // Efficiently calculate price and quantity for all items
    cart.items.forEach(item => {
      const product = item.productId;
      if (product) {
        totalPrice += product.price * item.quantity;
        totalQuantity += item.quantity;
      }
    });

    // Update total price and quantity
    cart.totalPrice = totalPrice;
    cart.totalQuantity = totalQuantity;

    // Save the updated cart
    await cart.save();
    return new Response(JSON.stringify(cart), { status: 200 });
  } catch (error) {
    console.error("Cart Update Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}


