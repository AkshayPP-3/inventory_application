import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv"

import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();
const PORT=process.env.PORT || 3000;

console.log(PORT);

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());


app.get("/api/products",productRoutes);

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})