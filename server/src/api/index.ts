import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { aj } from "../lib/arcjet";
import productRoutes from "../routes/productRoutes";
import categoryRoutes from "../routes/categoryRoutes";
import passport from "../config/passport";
import authRoutes from "../routes/authRoutes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(morgan("dev"));
app.use(
    cors({
        origin: process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    }),
);
app.use(passport.initialize());

app.use(async (req, res, next) => {
    if (req.path.startsWith("/api")) {
        try {
            const decision = await aj.protect(req, { requested: 1 });
            if (decision.isDenied()) {
                if (decision.reason.isRateLimit()) {
                    return res.status(429).json({ error: "Too many requests" });
                } else if (decision.reason.isBot()) {
                    return res.status(403).json({ error: "Bot access denied" });
                } else {
                    return res.status(403).json({ error: "Forbidden" });
                }
            }
            next();
        } catch (error) {
            next(); // Fail open for Vercel functions if Arcjet times out
        }
    } else {
        next();
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

export default app;
