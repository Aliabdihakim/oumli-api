import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await prisma.user.create({
      data: { name: name, email: email, password: hashedPassword },
    });

    res
      .status(201)
      .json({ message: "User registered successfully", userId: createUser.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user || !user.password) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = generateToken({ userId: user.id, email: user.email });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: email },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};
