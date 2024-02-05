import express from "express";
import { createQuestionsBatch, getUniqueGPTIndex, getSummaryInvite, getDistinctDoc, getSummaryDoc } from "../controllers/gpt.controller.js";

const router = express.Router();

// Create Chat Gpt Questions
router.post("/createQuestionsBatch", createQuestionsBatch);
router.get("/getUniqueGPTIndex", getUniqueGPTIndex);
router.get("/getDistinctDoc", getDistinctDoc);
router.post("/getSummaryInvite", getSummaryInvite );
router.post("/getSummaryDoc", getSummaryDoc );

export default router;
