import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
} from "../controllers/categories.js";

const router = express.Router();

router.post("/", createCategory);

router.put("/:id", updateCategory);

router.delete("/:id", deleteCategory);

router.get("/:slug", getCategoryBySlug);

router.get("/", getCategories);

export default router;
