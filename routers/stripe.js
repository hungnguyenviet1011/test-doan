import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { checkoutPayment } from "../controllers/stripe.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/Product.js";

dotenv.config();
const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

router.post("/payment", checkoutPayment);

const createOrder = async (customer, data) => {
  console.log("🚀 ~ file: stripe.js:16 ~ createOrder ~ customer:", customer);
  const item = JSON.parse(customer.metadata.cart);
  console.log("🚀 ~ file: stripe.js:18 ~ createOrder ~ item:", item);
  return new Promise(async (resolve, reject) => {
    try {
      console.log("1111");
      const promies = item.map(async (order) => {
        const productData = await Product.findByIdAndUpdate(
          {
            _id: order.cartId,
            quantity: order.quantity,
          },
          {
            $inc: {
              quantity: -order.quantity,
              selled: +order.quantity,
            },
          },
          { new: true }
        );
        if (productData) {
          return {
            status: "OK",
            message: "SUCCESS",
          };
        } else {
          return {
            status: "OK",
            message: "FAILURE",
            id: order.cartId,
          };
        }
      });
      console.log("2222");
      const result = await Promise.all(promies);
      const dataRes = result && result.filter((item) => item.id);
      console.log("🚀 ~ file: stripe.js:54 ~ returnnewPromise ~ data:", data)
      if (dataRes.length) {
        console.log("33331111")
        return {
          status: "OK",
          message: `San phẩm với id ${data.join(", ")} không đủ hàng`,
        };
      } else {
        console.log("3333")
        const orderItem = Promise.all(
          item.map(async (order) => {
            console.log("🚀 ~ file: stripe.js:65 ~ item.map ~ order:", order)
            let orderItemNew = new OrderItem({
              quantity: order.quantity,
              product: order.cartId,
              size: order.size,
              color: order.color,
            });

            orderItemNew = await orderItemNew.save();
            console.log("🚀 ~ file: stripe.js:74 ~ item.map ~ orderItemNew:", orderItemNew)

            return orderItemNew._id;
          })
        );
        const orderItemDB = await orderItem;
        console.log("🚀 ~ file: stripe.js:79 ~ returnnewPromise ~ e:", orderItem)

        const orderList = new Order({
          orderItems: orderItemDB,
          subTotal: data.amount_subtotal,
          total: data.amount_total,
          shipping: data.customer_details,
          user: customer.metadata.userId,
        });

        const saveDB = await orderList.save();

        console.log("success", saveDB);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

let endpointSecret;
// endpointSecret = process.env.WEBHOOK_SECRET_KEY;
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  (req, res) => {
    let event = req.body;
    let data;
    let eventType;
    if (endpointSecret) {
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
      const payload = async () => {
        const balance = await stripe.balance.retrieve({
          stripeAccount: 'acct_1NFT25IGQxX8cRSA',
        });  
        console.log("🚀 ~ file: stripe.js:136 ~ balance:", balance)
        
        return balance
      }
      console.log("🚀 ~ file: stripe.js:132 ~ payload ~ payload:", payload)
      
      // stripe.customers
      // .retrieve(data.customer)
      //   .then((customer) => {
      //     console.log(
      //       "🚀 ~ file: stripe.js:53 ~ stripe.customers.retrieve ~ customer:",
      //       customer
      //     );
      //     console.log("data", data);

      //     createOrder(customer, data);
      //   })
      //   .catch((err) => console.log(err));
    }

    // Return a 200 res to acknowledge receipt of the event
    res.send();
  }
);






export default router;
