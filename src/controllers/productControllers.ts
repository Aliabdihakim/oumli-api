import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json({
      status: "success",
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to retrieve products",
      error: error,
    });
  }
};

export const getSingleProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      res.status(400).json({
        status: "error",
        message: "Invalid productId",
      });
      return;
    }

    const product = await prisma.product.findUnique({
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
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve product",
      error: error,
    });
  }
};
