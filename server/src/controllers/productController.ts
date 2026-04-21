import { prisma } from "../lib/prisma.js";
import type { Request, Response } from "express";


export const getProducts = async(_:Request, res:Response)=>{
    try{
        const products = await prisma.product.findMany({
            orderBy:{id: "asc"}
        });
        res.status(200).json(products)
    }
    catch{
        res.status(500).json({message:"Internal server error"})
    }
}
export const createProduct = async (req: Request, res: Response) => {
    const { name, price, image } = req.body ?? {};

    const parsedName = typeof name === "string" ? name.trim() : "";
    const parsedImage = typeof image === "string" ? image.trim() : "";
    const parsedPrice = typeof price === "number" || typeof price === "string"
        ? Number(price)
        : Number.NaN;

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
            },
        });

        res.status(201).json(product);
    } catch {
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getProduct = async (_: Request, res: Response) => {};
export const updateProduct = async (_: Request, res: Response) => {};
export const deleteProduct = async (_: Request, res: Response) => {};