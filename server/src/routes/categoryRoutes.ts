import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoryController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: List all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", getCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get one category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/:id", getCategory);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryName:
 *                 type: string
 *               labelColour:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 */
router.post("/", protect, createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryName:
 *                 type: string
 *               labelColour:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated
 */
router.put("/:id", protect, updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Category deleted
 */
router.delete("/:id", protect, deleteCategory);

export default router;
