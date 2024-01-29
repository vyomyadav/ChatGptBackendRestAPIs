import express from "express";
import { createQuestionsBatch, getUniqueGPTIndex, getSummaryInvite } from "../controllers/gpt.controller.js";

const router = express.Router();

// Create Chat Gpt Questions
router.post("/createQuestionsBatch", createQuestionsBatch);
router.get("/getUniqueGPTIndex", getUniqueGPTIndex);
router.post("/getSummaryInvite", getSummaryInvite );

export default router;
