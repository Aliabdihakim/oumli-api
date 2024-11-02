"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productControllers_1 = require("../controllers/productControllers");
const router = (0, express_1.Router)();
router.get("/", productControllers_1.getAllProducts);
router.get("/:id", productControllers_1.getSingleProduct);
exports.default = router;
