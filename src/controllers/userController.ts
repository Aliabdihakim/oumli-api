import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getUserDetails = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        orders: {
          include: {
            order_items: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ message: "Could not find user" });
      return;
    }

    res
      .status(200)
      .json({ message: "User found", status: "success", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }

  return;
};
