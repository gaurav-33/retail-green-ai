import express from "express";
import {
    calculateCarbon,
    clearHistory,
    getCalculationHistory
} from "../controllers/carbonCalculator.controller.js";

const router = express.Router();

router.route("/").post(calculateCarbon);
router.route("/history").get(getCalculationHistory);
router.route("/history-clear").get(clearHistory);

export default router;
