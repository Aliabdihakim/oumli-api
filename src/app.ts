import express from "express";
import cors from "cors";

import productRoutes from "./routes/productRoutes";
import checkoutRoutes from "./routes/checkoutRoutes";
import reviewsRoutes from "./routes/reviewsRoutes";
import webhookRoutes from "./routes/webhookRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

import "dotenv/config";

const app = express();

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use("/api/webhook", webhookRoutes);

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/me", userRoutes);

export default app;
