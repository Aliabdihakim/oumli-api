"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET;
const generateToken = (payload) => {
    const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: "2 days" });
    return token;
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, secret);
        return decodedToken;
    }
    catch (error) {
        console.error(error);
        return null;
    }
};
exports.verifyToken = verifyToken;
