import express from "express";
import {
  createNew,
  deleteNew,
  getNews,
  getNew,
  updateNew,
} from "../controllers/new.js";

const router = express.Router();

router.post("/", createNew);

router.put("/:id", updateNew);

router.delete("/:id", deleteNew);

router.get("/:id", getNew);

router.get("/", getNews);

export default router;
