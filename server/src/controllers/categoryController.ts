import { prisma } from "../lib/prisma.js";
import { redis } from "../lib/redis.js";

export const getCategories = async (req: any, res: any) => {
  try {
    // Check cache first
    const cachedCategories = await redis.get("categories");
    if (cachedCategories) {
      return res.json(JSON.parse(cachedCategories));
    }

    const categories = await prisma.category.findMany({
      include: {
        products: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Store in cache for 60 seconds
    await redis.set(
      "categories",
      JSON.stringify(categories),
      "EX",
      60
    );

    res.json(categories);
  } catch (error: any) {
    console.error("[getCategories Error]", error.message || error);
    res.status(500).json({
      message: "Error fetching categories",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

export const getCategory = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    // Check cache first
    const cachedCategory = await redis.get(`category:${id}`);
    if (cachedCategory) {
      return res.json(JSON.parse(cachedCategory));
    }

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        products: true,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Store in cache for 60 seconds
    await redis.set(
      `category:${id}`,
      JSON.stringify(category),
      "EX",
      60
    );

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category" });
  }
};

export const createCategory = async (req: any, res: any) => {
  try {
    const { categoryName, labelColour } = req.body;

    if (!categoryName?.trim() || !labelColour?.trim()) {
      return res
        .status(400)
        .json({ message: "Category name and label colour are required" });
    }

    const existingCategory = await prisma.category.findUnique({
      where: { categoryName: categoryName.trim() },
    });

    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Category with this name already exists" });
    }

    const category = await prisma.category.create({
      data: {
        categoryName: categoryName.trim(),
        labelColour: labelColour.trim(),
      },
    });

    // Invalidate cache
    await redis.del("categories");

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error creating category" });
  }
};

export const updateCategory = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { categoryName, labelColour } = req.body;

    if (!categoryName?.trim() || !labelColour?.trim()) {
      return res
        .status(400)
        .json({ message: "Category name and label colour are required" });
    }

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        categoryName: categoryName.trim(),
        labelColour: labelColour.trim(),
      },
    });

    // Invalidate caches
    await redis.del(`category:${id}`);
    await redis.del("categories");

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Error updating category" });
  }
};

export const deleteCategory = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    // Invalidate caches
    await redis.del(`category:${id}`);
    await redis.del("categories");

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
};
