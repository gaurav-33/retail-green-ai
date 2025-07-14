import mongoose from "mongoose";
import { packagingOptions } from '../constants/packagingOptions.js';
import { categoryOptions } from '../constants/categoryOptions.js';
import { regionOptions } from '../constants/regionOptions.js';
import { countryOptions } from '../constants/countryOptions.js';
import { unitOptions } from '../constants/unitOptions.js';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: categoryOptions,
        default: 'other'
    },
    packaging: {
        type: String,
        enum: packagingOptions,
        default: 'unknown'
    },
    unit: {
        type: String,
        enum: unitOptions,
        default: 'other'
    },
    country: {
        type: String,
        enum: countryOptions,
        default: 'other'
    },
    region: {
        type: String,
        enum: regionOptions,
        default: 'other'
    },
    shelfLife: { type: Number, default: 0 }, // in days
    price: { type: Number, required: true },
    inventoryLevel: { type: Number, default: 0 },
    unitsSold: { type: Number, default: 0 },
    demandForecast: { type: Number, default: 0 },
    carbonFootprint: { type: Number, default: 0 },
    wasteRisk: { type: Boolean, default: false },
    wasteProbability: { type: Number, default: 0 }
}, { timestamps: true });

// Normalize enum fields
productSchema.pre('save', function (next) {
    ['packaging', 'category', 'region', 'country', 'unit'].forEach((field) => {
        if (this[field]) this[field] = this[field].toLowerCase();
    });
    next();
});

export const Product = mongoose.model('Product', productSchema);