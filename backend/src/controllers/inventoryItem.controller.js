import { asyncHandler } from "../utils/asyncHandler.js";
import { InventoryItem } from "../models/inventoryItem.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { storeOptions } from '../constants/storeOptions.js';

// ⏺ Create or Update Inventory Item
export const upsertInventoryItem = asyncHandler(async (req, res) => {
  const { product, store, quantity, expiryDate } = req.body;

  if (!product || !store || !quantity || !expiryDate) {
    throw new ApiError(400, "Missing required fields");
  }

  const item = await InventoryItem.findOneAndUpdate(
    { product, store },
    {
      quantity,
      expiryDate,
      status: new Date(expiryDate) < new Date() ? "expired" : "fresh"
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return res.status(200).json(new ApiResponse(200, item, "Inventory item saved"));
});

// ⏺ Get All Inventory Items (optionally filter by store/status)
export const getInventoryItems = asyncHandler(async (req, res) => {
  const { store, status, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (store) filter.store = store;
  if (status) filter.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await InventoryItem.countDocuments(filter);

  const items = await InventoryItem.find(filter)
    .populate("product")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return res.status(200).json(
    new ApiResponse(200, {
      items,
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / parseInt(limit))
    }, "Inventory fetched")
  );
});


// ⏺ Delete an Inventory Item
export const deleteInventoryItem = asyncHandler(async (req, res) => {
  const { id } = req.params; // product id
  const item = await InventoryItem.findOneAndDelete({product: id});
  if (!item) throw new ApiError(404, "Inventory item not found");

  return res.status(200).json(new ApiResponse(200, item, "Item deleted"));
});

// ⏺ Update ML prediction fields
export const updateWastePrediction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { wastePrediction, recommendation } = req.body;

  const item = await InventoryItem.findById(id);
  if (!item) throw new ApiError(404, "Item not found");

  item.wastePrediction = wastePrediction;
  item.recommendation = recommendation;
  await item.save();

  return res.status(200).json(new ApiResponse(200, item, "Prediction updated"));
});

// ⏺ Bulk Expiry Status Update (run daily or manually)
export const refreshExpiryStatus = asyncHandler(async (req, res) => {
  const items = await InventoryItem.find();

  const now = new Date();

  for (let item of items) {
    if (item.expiryDate < now) {
      item.status = "expired";
    } else {
      item.status = "fresh";
    }
    await item.save();
  }

  return res.status(200).json(new ApiResponse(200, items, "Status refreshed"));
});

export const getAllStores = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, { stores: storeOptions }, "Fetched all stores.")
  )
})