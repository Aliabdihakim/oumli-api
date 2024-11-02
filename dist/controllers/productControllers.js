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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleProduct = exports.getAllProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma.product.findMany();
        res.status(200).json({
            status: "success",
            message: "Products fetched successfully",
            data: products,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to retrieve products",
            error: error,
        });
    }
});
exports.getAllProducts = getAllProducts;
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = Number(req.params.id);
        if (isNaN(productId)) {
            res.status(400).json({
                status: "error",
                message: "Invalid productId",
            });
            return;
        }
        const product = yield prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            res.status(404).json({
                status: "error",
                message: `Product with ID ${productId} doesn't exist`,
            });
            return;
        }
        res.status(200).json({
            status: "success",
            message: `Fetched product ${productId}`,
            data: product,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to retrieve product",
            error: error,
        });
    }
});
exports.getSingleProduct = getSingleProduct;
