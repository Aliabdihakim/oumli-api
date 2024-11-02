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
exports.stripeWebhook = void 0;
const client_1 = require("@prisma/client");
const stripe_1 = __importDefault(require("stripe"));
const prisma = new client_1.PrismaClient();
const stripeWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2024-09-30.acacia",
    });
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const customerEmail = (_a = session.customer_details) === null || _a === void 0 ? void 0 : _a.email;
            const customerName = (_b = session.customer_details) === null || _b === void 0 ? void 0 : _b.name;
            const amountTotal = session.amount_total;
            const lineItems = yield stripe.checkout.sessions.listLineItems(session.id);
            let user = yield prisma.user.findUnique({
                where: { email: customerEmail },
            });
            if (!user) {
                user = yield prisma.user.create({
                    data: {
                        name: customerName,
                        email: customerEmail,
                        password: "",
                    },
                });
            }
            const order = yield prisma.orders.create({
                data: {
                    userid: user.id,
                    totalamount: amountTotal / 100,
                    currency: session.currency,
                    status: "completed",
                },
            });
            const orderItemsData = yield Promise.all(lineItems.data.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                const stripeProduct = yield stripe.products.retrieve((_a = item.price) === null || _a === void 0 ? void 0 : _a.product);
                const productid = Number(stripeProduct.metadata.productid);
                return {
                    orderid: order.id,
                    productid,
                    quantity: item.quantity || 1,
                    price: item.amount_total / 100,
                };
            })));
            const validOrderItems = orderItemsData.filter((item) => !isNaN(item.productid));
            if (validOrderItems.length > 0) {
                yield prisma.order_items.createMany({
                    data: validOrderItems,
                });
            }
            console.log(`Order for ${customerEmail} saved successfully with order items!`);
        }
        res.status(200).json({ received: true });
    }
    catch (err) {
        console.log(`Webhook error: ${err}`);
        res.status(400).send(`Webhook Error: ${err}`);
    }
});
exports.stripeWebhook = stripeWebhook;
