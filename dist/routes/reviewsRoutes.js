"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewsController_1 = require("../controllers/reviewsController");
const router = (0, express_1.Router)();
router.get("/", reviewsController_1.getReviews);
exports.default = router;
