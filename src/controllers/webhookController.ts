import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Stripe from "stripe";

const prisma = new PrismaClient();

export const stripeWebhook = async (req: Request, res: Response) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-09-30.acacia",
  });

  const sig = req.headers["stripe-signature"];

  let event: Stripe.Event;

  try {
    // Use STRIPE_WEBHOOK_SECRET to validate the webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Extract customer details
      const customerEmail =
        session.customer_details?.email || "unknown@example.com";
      const customerName = session.customer_details?.name || "Guest";
      const amountTotal = session.amount_total;

      // Check if user exists, or create a new one
      let user = await prisma.user.findUnique({
        where: { email: customerEmail },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: customerName,
            email: customerEmail,
            password: "", // Placeholder password, handle securely in a real application
          },
        });
      }

      // Create the order linked to the user
      await prisma.orders.create({
        data: {
          userid: user.id, // Use existing or newly created user ID
          totalamount: amountTotal! / 100, // Convert from cents to dollars
          currency: session.currency,
          status: "completed",
        },
      });

      console.log(`Order for ${customerEmail} saved successfully!`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.log(`Webhook error: ${err}`);
    res.status(400).send(`Webhook Error: ${err}`);
  }
};
