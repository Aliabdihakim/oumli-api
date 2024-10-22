import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Stripe from "stripe";

const prisma = new PrismaClient();

export const stripeWebhook = async (req: Request, res: Response) => {
  const stripe = new Stripe(process.env.STRIPE_WEBHOOK_SECRET as string, {
    apiVersion: "2024-09-30.acacia",
  });

  const sig = req.headers["stripe-signature"];

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Assuming the customer email and other details are part of the session
      const customerEmail = session.customer_email;
      const paymentIntentId = session.payment_intent;
      const amountTotal = session.amount_total;

      // Create an order in your database
      await prisma.orders.create({
        data: {
          userid: 1, // Replace this with the appropriate user ID or lookup based on session/customer
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
