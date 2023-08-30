import express from "express";
import {
  deleteOrder,
  getOrder,
  getOrders,
  getQuantityOrderTotalMonth,
  getTotalMonth,
  monthlyIncome,
  updateOrder,
  userOrder,
} from "../controllers/order.js";

const router = express.Router();

router.put("/:id", updateOrder);

router.delete("/:id", deleteOrder);

router.get("/userorder/:userId", userOrder);

router.get("/quantityorder", getQuantityOrderTotalMonth);

router.get("/totalmonth", getTotalMonth);

router.get("/income", monthlyIncome);

router.get("/:id", getOrder);

router.get("/", getOrders);

export default router;
