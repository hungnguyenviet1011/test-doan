import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  searchProduct,
  updateProduct,
} from "../controllers/products.js";
import { verifyAdmin, verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", createProduct);

//put
router.put("/:slug", updateProduct);

//delete
router.delete("/:id", deleteProduct);

//get
router.get("/search", searchProduct);

router.get("/:slug", getProduct);
router.get("/", getProducts);

export default router;
