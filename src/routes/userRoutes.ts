import { Router } from "express";
import { getUserDetails } from "../controllers/userController";
import { verifyTokenMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", verifyTokenMiddleware, getUserDetails);

export default router;
