import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

let calculationHistory = []; // In-memory (use Mongo for production)

export const calculateCarbon = asyncHandler(async (req, res) => {
    const {
        weight,
        materialType,
        transportDistance,
        transportMethod,
        packagingWeight
    } = req.body;


    // Emission factors (kg CO2 per kg)
    const materialFactors = {
        plastic: 3.4,
        paper: 1.3,
        glass: 0.85,
        metal: 5.2,
        organic: 0.2,
        textile: 8.1
    };

    // Transport factors (kg CO2 per kg per km)
    const transportFactors = {
        air: 0.0015,
        sea: 0.00003,
        road: 0.0001,
        rail: 0.00005
    };


    const manufacturing = weight * (materialFactors[materialType] || 1);
    const transport = weight * transportDistance * (transportFactors[transportMethod] || 0.0001);
    const packaging = packagingWeight * 1.5; // Average packaging factor
    const total = manufacturing + transport + packaging;

    const result = {
        totalCarbon: parseFloat(total.toFixed(2)),
        breakdown: {
            manufacturing: parseFloat(manufacturing.toFixed(2)),
            transport: parseFloat(transport.toFixed(2)),
            packaging: parseFloat(packaging.toFixed(2))
        }
    };

    calculationHistory.push({ date: new Date(), ...result });

    res.json(new ApiResponse(200, result, "Carbon calculation successful."));
});

export const getCalculationHistory = asyncHandler(async (req, res) => {
    res.json(new ApiResponse(200, calculationHistory));
});

export const clearHistory = asyncHandler(async (req, res) => {
    calculationHistory = [];
    res.json(new ApiResponse(200, [], "Calculation history cleared."));
});
