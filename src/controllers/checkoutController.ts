import { Request, Response } from "express";
import Stripe from "stripe";

const clientUrl =
  process.env.NODE_ENV === "production"
    ? "https://www.oumli.com"
    : "http://localhost:5173";

export const createCheckoutSession = async (req: Request, res: Response) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-09-30.acacia",
  });
  const { cartItems } = req.body;

  try {
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: "sek",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: item.price * 100, // Convert to cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${clientUrl}/success`,
      cancel_url: `${clientUrl}/cart`,
      locale: "sv",
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).send("Internal Server Error");
  }
};
