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
import path from "path";

dotenv.config();

const app = express();
const PORT=process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({
    contentSecurityPolicy: false, // Required if you encounter issues with Vite dynamic assets
}));
app.use(morgan("dev"));
app.use(cors());
app.use(passport.initialize());

// Serve static files from the React app
const clientDistPath = path.join(__dirname, "../../client/dist");
app.use(express.static(clientDistPath));

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

// Catch-all: serve index.html for any request that doesn't match an API route
app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(clientDistPath, "index.html"));
    }
});

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})