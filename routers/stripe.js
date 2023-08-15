import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { checkoutPayment } from "../controllers/stripe.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";

dotenv.config();
const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

router.post("/payment", checkoutPayment);

const createOrder = async (customer, data) => {
  console.log("🚀 ~ file: stripe.js:16 ~ createOrder ~ customer:", customer);
  const item = JSON.parse(customer.metadata.cart);
  console.log("🚀 ~ file: stripe.js:18 ~ createOrder ~ item:", item);

  try {
    const orderItem = Promise.all(
      item.map(async (order) => {
        let orderItemNew = new OrderItem({
          quantity: order.quantity,
          product: order.cartId,
          size: order.size,
          color: order.color,
        });

        orderItemNew = await orderItemNew.save();

        return orderItemNew._id;
      })
    );

    const orderItemDB = await orderItem;

    const orderList = new Order({
      orderItems: orderItemDB,
      subTotal: data.amount_subtotal,
      total: data.amount_total,
      shipping: data.customer_details,
      user: customer.metadata.userId,
    });

    const saveDB = await orderList.save();

    console.log("success", saveDB);
  } catch (error) {
    console.log(error);
  }
};

let endpointSecret;
// endpointSecret =
//   "whsec_3cc6fd5066ad7342a54701348dbe61c647aef39c54c799f3763c36cfb6fd9da3";

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  (req, res) => {
    let event = req.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse

    let data;
    let eventType;
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = req.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          endpointSecret
        );
        console.log("🚀 ~ file: stripe.js:28 ~ event:", event);
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
      }

      data = event.data.object;
      event = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the event
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then((customer) => {
          console.log(
            "🚀 ~ file: stripe.js:53 ~ stripe.customers.retrieve ~ customer:",
            customer
          );
          console.log("data", data);

          createOrder(customer, data);
        })
        .catch((err) => console.log(err));
    }

    // Return a 200 res to acknowledge receipt of the event
    res.send();
  }
);
export default router;
