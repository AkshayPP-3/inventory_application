import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { aj } from "./lib/arcjet.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import swaggerUi from "swagger-ui-express";
import { specs } from "./docs/swagger.js";
import passport from "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(passport.initialize());

app.use("/api/auth", authRoutes);

app.use(async (req, res, next) => {
  if (req.path.startsWith("/api")) {
    try {
      const decision = await aj.protect(req, {
        requested: 1,
      });

      if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
          res.status(429).json({ error: "Too many requests" });
        } else if (decision.reason.isBot()) {
          res.status(403).json({ error: "Bot access denied" });
        } else {
          res.status(403).json({ error: "forbidden" });
        }
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  } else {
    next();
  }
});

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Root route: redirect to frontend when available, otherwise show links
app.get("/", (req, res) => {
  const frontend = process.env.CLIENT_URL;
  if (frontend) {
    return res.redirect(frontend);
  }

  res.status(200).send(`
    <html>
      <head><title>Inventory API</title></head>
      <body style="font-family:system-ui,Arial,Helvetica,sans-serif;line-height:1.6;padding:24px;">
        <h1>Inventory Application API</h1>
        <p>The API is available under <a href="/api">/api</a>.</p>
        <ul>
          <li><a href="/api-docs">API Docs (Swagger)</a></li>
          <li><a href="/api/products">Products (GET /api/products)</a></li>
        </ul>
        <p>If you have a frontend deployed, set the <strong>CLIENT_URL</strong> env var to redirect visitors automatically.</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});