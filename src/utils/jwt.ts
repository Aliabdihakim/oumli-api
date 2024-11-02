import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET as string;
export type UserPayload = {
  userId: number;
  email: string;
};

const generateToken = (payload: UserPayload): string => {
  const token = jwt.sign(payload, secret, { expiresIn: "2 days" });
  return token;
};

const verifyToken = (token: string): UserPayload | null => {
  try {
    const decodedToken = jwt.verify(token, secret) as UserPayload;
    return decodedToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { generateToken, verifyToken };
