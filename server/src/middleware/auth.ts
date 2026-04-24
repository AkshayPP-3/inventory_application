import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export const protect = (req: { headers: { authorization: any; }; userId: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }, next: () => void) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ message: "No token" });

  if (!secret)
    return res.status(500).json({ message: "JWT secret not configured" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "string" || !("userId" in decoded))
      return res.status(401).json({ message: "Invalid token" });

    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};