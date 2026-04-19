import express from "express";
import { 
    createProduct,
    deleteProduct,
    getProduct, 
    getProducts,
    updateProduct
    } from "../controllers/productController.js";

 
const router = express.Router();

router.get("/",getProducts);
router.get("/:id",getProduct);
router.get("/",createProduct);
router.get("/:id",updateProduct);
router.get("/:id",deleteProduct);

export default router;