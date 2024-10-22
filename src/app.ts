import express from "express";
import cors from "cors";

import productRoutes from "./routes/productRoutes";
import checkoutRoutes from "./routes/checkoutRoutes";
import reviewsRoutes from "./routes/reviewsRoutes";
import webhookRouter from "./routes/webhookRoutes";

import "dotenv/config";

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://oumli.com",
    "http://35.173.238.141",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use("/api/webhook", webhookRouter);
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/reviews", reviewsRoutes);

export default app;
