import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { packagingOptions } from '../constants/packagingOptions.js';
import { categoryOptions } from '../constants/categoryOptions.js';
import { regionOptions } from '../constants/regionOptions.js';
import { countryOptions } from '../constants/countryOptions.js';
import { unitOptions } from '../constants/unitOptions.js';

const createProduct = asyncHandler(async (req, res) => {
    const {
        name, category, packaging, unit,
        country, region,
        shelfLife,
        price, inventoryLevel, unitsSold, demandForecast
    } = req.body;

    if (
        [name, category, packaging, unit, country, region, price]
            .some(field => field?.toString().trim() === "")
    ) {
        throw new ApiError(400, "All required fields must be provided.");
    }

    const product = await Product.create({
        name,
        category,
        packaging,
        unit,
        country,
        region,
        price,
        inventoryLevel,
        unitsSold,
        demandForecast,
        shelfLife: shelfLife || 0
    });

    return res.status(201).json(
        new ApiResponse(201, product, "Product created successfully.")
    );
});

const getAllProducts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, category, search } = req.query;
    const query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    return res.status(200).json(
        new ApiResponse(200, {
            products,
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / parseInt(limit))
        }, "Fetched all products.")
    );
});

const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, "Product not found.");
    }

    return res.status(200).json(
        new ApiResponse(200, product, "Product fetched successfully.")
    );
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });

    if (!product) {
        throw new ApiError(404, "Product not found.");
    }

    return res.status(200).json(
        new ApiResponse(200, product, "Product updated successfully.")
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
        throw new ApiError(404, "Product not found.");
    }

    return res.status(200).json(
        new ApiResponse(200, product, "Product deleted successfully.")
    );
});

const getAllCategory = asyncHandler(async (_, res) => {
    return res.status(200).json(
        new ApiResponse(200, { categories: categoryOptions }, "Fetched all categories."))
})

const getAllPackagingOption = asyncHandler(async (_, res) => {
    return res.status(200).json(
        new ApiResponse(200, { packagings: packagingOptions }, "Fetched all packagings."))
})
const getAllRegionOPtion = asyncHandler(async (_, res) => {
    return res.status(200).json(
        new ApiResponse(200, { regions: regionOptions }, "Fetched all regions."))
})
const getAllCountry = asyncHandler(async (_, res) => {
    return res.status(200).json(
        new ApiResponse(200, { countries: countryOptions }, "Fetched all countrie."))
})
const getAllUnit = asyncHandler(async (_, res) => {
    return res.status(200).json(
        new ApiResponse(200, { units: unitOptions }, "Fetched all units."))
})


export {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getAllCategory,
    getAllPackagingOption,
    getAllRegionOPtion,
    getAllCountry,
    getAllUnit
}