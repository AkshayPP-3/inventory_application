import { prisma } from "../lib/prisma.js";
import type { Request, Response } from "express";


export const getProducts = async(_:Request, res:Response)=>{
    try{
        const products = await prisma.product.findMany({
            include: {
                category: true,
            },
            orderBy:{id: "asc"}
        });
        res.status(200).json(products)
    }
    catch{
        res.status(500).json({message:"Internal server error"})
    }
}
export const createProduct = async (req: Request, res: Response) => {
    const { name, price, image, categoryId } = req.body ?? {};

    const parsedName = typeof name === "string" ? name.trim() : "";
    const parsedImage = typeof image === "string" ? image.trim() : "";
    const parsedPrice = typeof price === "number" || typeof price === "string"
        ? Number(price)
        : Number.NaN;
    const parsedCategoryId = categoryId ? Number(categoryId) : null;

    if (!parsedName || !parsedImage || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
        res.status(400).json({ message: "name, price, and image are required" });
        return;
    }

    try {
        const product = await prisma.product.create({
            data: {
                name: parsedName,
                price: parsedPrice,
                image: parsedImage,
                ...(parsedCategoryId ? { categoryId: parsedCategoryId } : {}),
            },
            include: {
                category: true,
            },
        });

        res.status(201).json(product);
    } catch {
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getProduct = async (req: Request, res: Response) => {
    const id = Number.parseInt(String(req.params.id ?? ""), 10);

    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ message: "Invalid product id" });
        return;
    }

    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });

        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        res.status(200).json(product);
    } catch {
        res.status(500).json({ message: "Internal server error" });
    }
};
export const updateProduct = async (req: Request, res: Response) => {
    const id = Number.parseInt(String(req.params.id ?? ""), 10);

    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ message: "Invalid product id" });
        return;
    }

    const { name, price, image, categoryId } = req.body ?? {};

    const parsedName = typeof name === "string" ? name.trim() : undefined;
    const parsedImage = typeof image === "string" ? image.trim() : undefined;
    const parsedPrice = typeof price === "number" || typeof price === "string"
        ? Number(price)
        : undefined;
    const parsedCategoryId = categoryId ? Number(categoryId) : undefined;

    const hasName = parsedName !== undefined;
    const hasImage = parsedImage !== undefined;
    const hasPrice = parsedPrice !== undefined;
    const hasCategory = parsedCategoryId !== undefined;

    if (!hasName && !hasImage && !hasPrice && !hasCategory) {
        res.status(400).json({ message: "Provide at least one field: name, price, image, or categoryId" });
        return;
    }

    if ((hasName && !parsedName) || (hasImage && !parsedImage) || (hasPrice && (!Number.isFinite(parsedPrice) || parsedPrice < 0))) {
        res.status(400).json({ message: "Invalid name, image, or price" });
        return;
    }

    try {
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                ...(hasName ? { name: parsedName } : {}),
                ...(hasImage ? { image: parsedImage } : {}),
                ...(hasPrice ? { price: parsedPrice } : {}),
                ...(hasCategory ? { categoryId: parsedCategoryId } : {}),
            },
            include: {
                category: true,
            },
        });

        res.status(200).json(updatedProduct);
    } catch {
        res.status(404).json({ message: "Product not found" });
    }
};
export const deleteProduct = async (req: Request, res: Response) => {
    const id = Number.parseInt(String(req.params.id ?? ""), 10);

    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ message: "Invalid product id" });
        return;
    }

    try {
        await prisma.product.delete({
            where: { id },
        });

        res.status(204).send();
    } catch {
        res.status(404).json({ message: "Product not found" });
    }
};