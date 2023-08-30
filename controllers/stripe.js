import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripe = Stripe(process.env.STRIPE_KEY);

export const checkoutPayment = async (req, res) => {
  console.log("🚀 ~ file: stripe.js:8 ~ checkoutPayment ~ req:", req.body);
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
      cart: JSON.stringify(
        req.body.cartItems.map((item) => ({
          cartId: item.cartItem._id,
          size: item.selectSize,
          quantity: item.quantity,
          color: item.color,
        }))
      ),
    },
  });

  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "vnd",
        product_data: {
          name: item.cartItem.title,
          images: [item.cartItem.thumbnail],
          metadata: {
            id: item.uuid,
          },
        },
        unit_amount: Math.round(item.cartItem.price),
      },
      quantity: item.quantity,
    };
  });
  const session = await stripe.checkout.sessions.create({
    shipping_address_collection: {
      allowed_countries: ["VN"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "vnd",
          },
          display_name: "Free shipping",
          // Delivers between 5-7 business days
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: Math.round(20 * 1000),
            currency: "vnd",
          },
          display_name: "Next day air",
          // Delivers in exactly 1 business day
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    customer: customer.id,
    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });
  res.send({ url: session.url });
};
