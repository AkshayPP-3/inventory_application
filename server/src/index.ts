import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv"
import {aj} from "./lib/arcjet.js"
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import swaggerUi from "swagger-ui-express";
import { specs } from "./docs/swagger.js";
import passport from "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({
    contentSecurityPolicy: false, // Required if you encounter issues with Vite dynamic assets
}));
app.use(morgan("dev"));
app.use(cors());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);

app.use(async(req,res,next)=>{
    // ... logic for arcjet protection
    if (req.path.startsWith("/api")) {
        try{
            const decision = await aj.protect(req,{
                requested:1
            })
            if(decision.isDenied()){
                if(decision.reason.isRateLimit()){
                    res.status(429).json({error:"Too many requests"})
                }
                else if(decision.reason.isBot()){
                    res.status(403).json({error:"Bot access denied"})
                }
                else{
                    res.status(403).json({error:"forbidden"});
                }
                return
            }
            next()
        }catch(error){
            res.status(500).json({success: false, message: "Internal server error"});
        }
    } else {
        next();
    }
})

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

export default app;