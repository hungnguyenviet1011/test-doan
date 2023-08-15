import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import { createError } from "../utils/error.js";
export const getOrders = async (req, res, next) => {
  try {
    // const orderList = await Order.find()
    //   .populate({
    //     path: "orderItems",
    //     populate: { path: "product" },
    //   })
    //   .populate("user");
    const orderList = await Order.find();

    res.status(200).json(orderList);
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  const orderId = req.params.id;
  try {
    const order = await Order.findById(orderId)
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
        },
      })
      .populate("user");

    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  const orderId = req.params.id;
  const status = req.body.status;

  if (!status) {
    res.status(200).json("Only change the field status");
  }
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { $set: { status: status } },
      { new: true }
    );

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  const orderId = req.params.id;
  console.log("🚀 ~ file: order.js:105 ~ deleteOrder ~ orderId:", orderId);
  try {
    await Order.findByIdAndRemove(orderId).then(async (order) => {
      console.log("🚀 ~ file: order.js:108 ~ or ~ order:", order);
      if (order) {
        await order.orderItems.map(async (item) => {
          await OrderItem.findByIdAndDelete(item);
        });
        return res.status(200).json("Delete Success");
      } else {
        next(createError(401, "Order Failed"));
      }
    });
  } catch (error) {
    next(error);
  }
};

export const userOrder = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await Order.find({
      user: userId,
    })
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
        },
      })
      .populate("user");

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// GET MONTHLY IMCOME
export const monthlyIncome = async (req, res, next) => {
  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth - 1));
};
