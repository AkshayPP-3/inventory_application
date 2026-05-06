import express from "express";
import { 
    createProduct,
    deleteProduct,
    getProduct, 
    getProducts,
    updateProduct
    } from "../controllers/productController.js";
import { protect } from "../middleware/auth.js";

 
const router = express.Router();


/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: List products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get one product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/:id", getProduct);



/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *             required: [name, price]
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/", protect, createProduct);



/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: OK
 */
router.put("/:id", protect, updateProduct);



/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: OK
 */
router.delete("/:id", protect, deleteProduct);



export default router;