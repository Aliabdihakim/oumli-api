"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSession = void 0;
const stripe_1 = __importDefault(require("stripe"));
const clientUrl = process.env.NODE_ENV === "production"
    ? "https://www.oumli.com"
    : "http://localhost:5173";
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2024-09-30.acacia",
    });
    const { cartItems } = req.body;
    try {
        const lineItems = cartItems.map((item) => ({
            price_data: {
                currency: "sek",
                product_data: {
                    name: item.name,
                    images: [item.image],
                    metadata: {
                        productid: item.id,
                    },
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${clientUrl}/success`,
            cancel_url: `${clientUrl}/cart`,
            locale: "sv",
        });
        res.status(200).json({ id: session.id });
    }
    catch (error) {
        console.error("Error creating Stripe session:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.createCheckoutSession = createCheckoutSession;
