"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const verifyTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: "Authorization token missing" });
        return;
    }
    const token = authHeader.split(" ")[1];
    const decoded = (0, jwt_1.verifyToken)(token);
    if (!decoded) {
        res.status(401).json({ message: "Invalid or expired token" });
        return;
    }
    req.user = decoded;
    next();
};
exports.verifyTokenMiddleware = verifyTokenMiddleware;
