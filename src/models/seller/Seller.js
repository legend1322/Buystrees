
import mongoose from "mongoose";

const SellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String }, // Stores Base64 string or file path

    // New field for admin control
    status: {
      type: String,
      enum: ["not_verified", "verified", "banned"],
      default: "not_verified",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Seller || mongoose.model("Seller", SellerSchema);
