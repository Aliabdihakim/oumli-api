import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Stripe from "stripe";

const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-09-30.acacia",
});

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Verify the event came from Stripe
    event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    // Handle the completed checkout session
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Retrieve line items and additional data
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      // Prepare order data to save in the database
      const orderData = {
        userid: parseInt(session.metadata?.userId ?? "0"), // Ensure you pass userId as metadata
        totalamount: (session.amount_total ?? 0) / 100, // Convert from cents
        currency: session.currency ?? "sek",
        status: "completed",
        order_items: {
          create: lineItems.data.map((item) => ({
            productid: parseInt(item.price?.product as string, 10), // Ensure product ID is valid
            quantity: item.quantity ?? 1,
            price: (item.amount_total ?? 0) / 100,
          })),
        },
      };

      // Save order in the database
      await prisma.orders.create({ data: orderData });

      console.log("Order saved successfully!");
    }

    // Send a response to acknowledge receipt
    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).send(`Webhook Error: ${error}`);
  }
};
