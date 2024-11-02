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
    event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const customerEmail = session.customer_details?.email!;
      const customerName = session.customer_details?.name!;
      const amountTotal = session.amount_total;

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      let user = await prisma.user.findUnique({
        where: { email: customerEmail },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: customerName,
            email: customerEmail,
            password: "",
          },
        });
      }

      const order = await prisma.orders.create({
        data: {
          userid: user.id,
          totalamount: amountTotal! / 100,
          currency: session.currency,
          status: "completed",
        },
      });

      const orderItemsData = await Promise.all(
        lineItems.data.map(async (item) => {
          const stripeProduct = await stripe.products.retrieve(
            item.price?.product as string
          );
          const productid = Number(stripeProduct.metadata.productid);

          return {
            orderid: order.id,
            productid,
            quantity: item.quantity || 1,
            price: item.amount_total / 100,
          };
        })
      );

      const validOrderItems = orderItemsData.filter(
        (item) => !isNaN(item.productid)
      );

      if (validOrderItems.length > 0) {
        await prisma.order_items.createMany({
          data: validOrderItems,
        });
      }

      console.log(
        `Order for ${customerEmail} saved successfully with order items!`
      );
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.log(`Webhook error: ${err}`);
    res.status(400).send(`Webhook Error: ${err}`);
  }
};
