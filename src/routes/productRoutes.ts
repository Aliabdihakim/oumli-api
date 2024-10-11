import { Router } from "express";
import {
  getAllProducts,
  getSingleProduct,
} from "../controllers/productControllers";

const router = Router();

router.get("/products", getAllProducts);
router.get("/products/:id", getSingleProduct);

export default router;
