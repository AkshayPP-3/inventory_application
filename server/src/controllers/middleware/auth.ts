import jwt from "jsonwebtoken";

export const protect = (req: { headers: { authorization: any; }; userId: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }, next: () => void) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ message: "No token" });

  const token = header.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) return res.status(500).json({ message: "JWT secret not configured" });

  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};