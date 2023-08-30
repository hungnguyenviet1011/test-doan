import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
// ** Router
import authRoute from "./routers/auth.js";
import categoryRoute from "./routers/categories.js";
import orderRoute from "./routers/orders.js";
import productRoute from "./routers/products.js";
import userRoute from "./routers/users.js";
import stripeRouter from "./routers/stripe.js";
import newRouter from "./routers/news.js";

const app = express();
dotenv.config();
app.use(cors());

const connect = () => {
  try {
    mongoose.connect(process.env.MONGODB);
    console.log("Connect success DB");
  } catch (error) {
    console.log(error);
  }
};

mongoose.connection.on("disconnect", () => {
  console.log("Disconect DB");
});

//middleware
app.use(express.json());
app.use("/api/checkout", stripeRouter);

app.use("/api/auth", authRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/news", newRouter);

//handle middleware error
app.use((err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMessage = err.message || "Something went wrong somewhere";
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMessage,
    stack: err?.stack,
  });
});

app.listen(8800, () => {
  connect();
  console.log("Connect to backend");
});
