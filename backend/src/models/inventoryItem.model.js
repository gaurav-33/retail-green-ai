import mongoose from "mongoose";
import {storeOptions} from '../constants/storeOptions.js'
const inventoryItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  store: {
    type: String,
    required: true,
    enum: storeOptions 
  },
  quantity: { 
    type: Number,
    required: true,
    min: 0
  },
  expiryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["fresh", "expired", "near expiry"],
    default: "fresh"
  },
  wastePrediction: {
    type: Number, // percentage (0 to 100)
    default: 0
  },
  recommendation: {
    type: String,
    enum: ["monitor", "price reduction", "urgent action", "none"],
    default: "monitor"
  }
}, { timestamps: true });

export const InventoryItem = mongoose.model("InventoryItem", inventoryItemSchema);
