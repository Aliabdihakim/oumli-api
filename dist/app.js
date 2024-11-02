"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const checkoutRoutes_1 = __importDefault(require("./routes/checkoutRoutes"));
const reviewsRoutes_1 = __importDefault(require("./routes/reviewsRoutes"));
const webhookRoutes_1 = __importDefault(require("./routes/webhookRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
require("dotenv/config");
const app = (0, express_1.default)();
const corsOptions = {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use("/api/webhook", webhookRoutes_1.default);
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use("/api/products", productRoutes_1.default);
app.use("/api/checkout", checkoutRoutes_1.default);
app.use("/api/reviews", reviewsRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
app.use("/api/me", userRoutes_1.default);
exports.default = app;
