// GPT.controller.js
import GPT from "../models/gpt.model.js";

const createQuestionsBatch = async (req, res) => {
  try {
    const data = await GPT.createQuestionsBatch();
    res.status(201).send({
      message: "Insertion completed successfully"
    });
  } catch (error) {
    console.error("Error in createQuestionsBatch controller:", error.message);
    res.status(500).send({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getUniqueGPTIndex = async (req, res) => {
  try {
    const data = await GPT.getUniqueGPTIndex();
    if (!data || data.length == 0) {
      res.status(400).send({
        error: "Data not found"
      });
    } else {
      res.status(200).send(data);
    }
  } catch (error) {
    console.error("Error in getUniqueGPTIndex controller:", error.message);
    res.status(500).send({
      message: "Something went wrong.",
      error: error.message,
    });
  }
};

const getSummaryInvite = async (req, res) => {
  try {
    if (!req.query.data) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    const data = await GPT.getSummaryInvite(req.query.data);
    if (!data || data.length == 0) {
      res.status(400).send({
        error: "Data not found"
      });
    } else {
      res.status(200).send(data);
    }
  } catch (error) {
    console.error("Error in getSummaryInvite controller:", error.message);
    res.status(500).send({
      message: "Something went wrong.",
      error: error.message,
    });
  }
};

export { createQuestionsBatch, getUniqueGPTIndex, getSummaryInvite };
