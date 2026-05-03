import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv"
import {aj} from "./lib/arcjet"
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import swaggerUi from "swagger-ui-express";
import { specs } from "./docs/swagger";
import passport from "./config/passport";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT=process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(passport.initialize());
app.use("/api/auth", authRoutes);

app.use(async(req,res,next)=>{
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
})

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})