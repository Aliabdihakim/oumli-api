"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkoutController_1 = require("../controllers/checkoutController");
const router = (0, express_1.Router)();
router.post("/create-checkout-session", checkoutController_1.createCheckoutSession);
exports.default = router;
