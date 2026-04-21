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
export const getProduct = async (_: Request, res: Response) => {};
export const createProduct = async (_: Request, res: Response) => {};
export const updateProduct = async (_: Request, res: Response) => {};
export const deleteProduct = async (_: Request, res: Response) => {};