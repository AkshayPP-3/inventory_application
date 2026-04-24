import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { signToken } from "../utils/jwt";

export const register = async (req: { body: { email: any; password: any; }; }, res: { json: (arg0: { token: string; }) => void; }) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashed },
  });

  res.json({ token: signToken(user.id) });
};

export const login = async (req: { body: { email: any; password: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; json: (arg0: { token: string; }) => void; }) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password)
    return res.status(400).json({ message: "Invalid" });

  const ok = await bcrypt.compare(password, user.password);

  if (!ok)
    return res.status(400).json({ message: "Invalid" });

  res.json({ token: signToken(user.id) });
};