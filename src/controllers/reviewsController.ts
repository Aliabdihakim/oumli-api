import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await prisma.reviews.findMany({
      orderBy: { createdAt: "desc" },
    });
    res
      .status(200)
      .json({
        status: "success",
        message: "Successfully fetched reviews",
        data: reviews,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch reviews. Please try again later.",
    });
  } finally {
    await prisma.$disconnect();
  }
};
