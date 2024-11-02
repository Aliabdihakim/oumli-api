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
exports.loginUser = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const prisma = new client_1.PrismaClient();
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }
    try {
        const existingUser = yield prisma.user.findUnique({
            where: { email: email },
        });
        if (existingUser) {
            res.status(400).json({ message: "User already exists." });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const createUser = yield prisma.user.create({
            data: { name: name, email: email, password: hashedPassword },
        });
        res
            .status(201)
            .json({ message: "User registered successfully", userId: createUser.id });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const user = yield prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user || !user.password) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        const token = (0, jwt_1.generateToken)({ userId: user.id, email: user.email });
        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user.id, name: user.name, email: email },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.error(error);
    }
});
exports.loginUser = loginUser;
