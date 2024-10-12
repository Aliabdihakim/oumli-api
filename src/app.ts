import express from "express";
import productRoutes from "./routes/productRoutes";
import "dotenv/config";

const app = express();

app.use("/api", productRoutes);

export default app;
