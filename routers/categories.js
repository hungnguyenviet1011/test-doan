import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
} from "../controllers/categories.js";

const router = express.Router();

router.post("/", createCategory);

router.put("/:id", updateCategory);

router.get("/:slug", getCategoryBySlug);

router.get("/", getCategories);

export default router;
