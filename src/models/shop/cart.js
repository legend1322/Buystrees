

import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },
  price: { type: Number },  // You might want to store the product's price in the cart for historical accuracy
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    anonymousCartId: {
      type: String, // From localStorage UUID
      default: null,
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,  // You can update this when items are added or removed
    },
    totalQuantity: {
      type: Number,
      default: 0,  // You can update this when items are added or removed
    },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 30 * 24 * 60 * 60 * 1000,  // Default expiration after 30 days
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;

