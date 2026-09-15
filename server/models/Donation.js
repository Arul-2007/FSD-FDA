import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    foodName: { type: String, required: true, trim: true, maxlength: 80 },
    category: {
      type: String,
      enum: ["cooked", "produce", "baked", "packed", "other"],
      default: "other",
    },
    servings: { type: Number, required: true, min: 1, max: 500 },
    donorName: { type: String, required: true, trim: true, maxlength: 60 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    pickupUntil: { type: String, required: true },
    notes: { type: String, trim: true, maxlength: 240, default: "" },
    status: { type: String, enum: ["available", "claimed"], default: "available" },
    claimedBy: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

donationSchema.index({ status: 1, createdAt: -1 });

export const Donation = mongoose.model("Donation", donationSchema);
