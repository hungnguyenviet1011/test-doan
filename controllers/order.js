import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import { createError } from "../utils/error.js";
export const getOrders = async (req, res, next) => {
  try {
    const orderList = await Order.find()
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
        },
      })
      .populate("user");
    // const orderList = await Order.find();

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

    res.status(200).json({ status: 200, order });
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
          console.log(
            "🚀 ~ file: order.js:66 ~ awaitorder.orderItems.map ~ item:",
            item
          );
          const order = await OrderItem.findByIdAndRemove({
            _id: item,
          });
          console.log(
            "🚀 ~ file: order.js:73 ~ awaitorder.orderItems.map ~ order:",
            order
          );
          if (order) {
            return res
              .status(200)
              .json({ status: 200, message: "Delete order successfully" });
          }
        });
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
// ** So sanh thu nhap thang nay vs thang truoc
export const monthlyIncome = async (req, res, next) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  console.log(
    "🚀 ~ file: order.js:119 ~ monthlyIncome ~ lastMonth:",
    lastMonth
  );
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  console.log(
    "🚀 ~ file: order.js:121 ~ monthlyIncome ~ previousMonth:",
    previousMonth
  );

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          // ...(productId && {
          //   orderItems: { $elemMatch: { productId } },
          // }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$total",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    return res.status(200).json(income);
  } catch (error) {
    next(error);
  }
};

// ** Get Total Months
export const getTotalMonth = async (req, res, next) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  console.log(
    "🚀 ~ file: order.js:162 ~ getTotalMonth ~ lastMonth:",
    lastMonth
  );

  try {
    const data = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonth },
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$total",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    console.log("🚀 ~ file: order.js:193 ~ getTotalMonth ~ data:", data);
    return res.status(200).json({ data: data[0] });
  } catch (error) {
    next(error);
  }
};

// ** getTotalQuantityMonth
export const getQuantityOrderTotalMonth = async (req, res, next) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  console.log(
    "🚀 ~ file: order.js:200 ~ getQuantityOrderTotalMonth ~ lastMonth:",
    lastMonth
  );
  const previousMonth = new Date(date.setMonth(lastMonth.getMonth() - 1));
  console.log(
    "🚀 ~ file: order.js:202 ~ getQuantityOrderTotalMonth ~ previousMonth:",
    previousMonth
  );

  console.log(
    "🚀 ~ file: order.js:162 ~ getTotalMonth ~ lastMonth:",
    lastMonth
  );

  try {
    const data = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    return res.status(200).json({ data: data });
  } catch (error) {
    next(error);
  }
};
