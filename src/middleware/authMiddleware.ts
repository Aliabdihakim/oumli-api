import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export const verifyTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Authorization token missing" });
    return;
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }

  req.user = decoded;

  next();
};
