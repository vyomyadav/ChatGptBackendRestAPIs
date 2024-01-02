import express from "express";
import { createQuestionsBatch } from "../controllers/gpt.controller.js";

const router = express.Router();

// Create Chat Gpt Questions
router.post("/createQuestionsBatch", createQuestionsBatch);

export default router;
