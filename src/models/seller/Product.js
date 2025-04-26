

import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  images: { type: [String], default: [] },
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);


