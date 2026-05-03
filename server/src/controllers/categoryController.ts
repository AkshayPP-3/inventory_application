import { prisma } from "../lib/prisma.js";

export const getCategories = async (req: any, res: any) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

export const getCategory = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        products: true,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

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

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
};
