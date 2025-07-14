import { Router } from "express"
import {
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
} from "../controllers/product.controller.js";

const router = Router()

router.route("/categories").get(getAllCategory);
router.route("/regions").get(getAllRegionOPtion);
router.route("/packings").get(getAllPackagingOption);
router.route("/countries").get(getAllCountry);
router.route("/units").get(getAllUnit);


router.route("/").post(createProduct);
router.route("/").get(getAllProducts);
router.route("/:id").get(getProductById);
router.route("/:id").put(updateProduct);
router.route("/:id").delete(deleteProduct);

export default router;