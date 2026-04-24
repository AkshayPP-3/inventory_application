import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const secret = process.env.JWT_SECRET;

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ message: "No token" });

  if (!secret)
    return res.status(500).json({ message: "JWT secret not configured" });

  const jwtSecret = secret;

  const token = header.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Invalid token" });

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (typeof decoded === "string" || !("userId" in decoded))
      return res.status(401).json({ message: "Invalid token" });

    (req as Request & { userId?: string | number }).userId = decoded.userId as string | number;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};