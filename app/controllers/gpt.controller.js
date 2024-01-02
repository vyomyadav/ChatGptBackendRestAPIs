// GPT.controller.js
import GPT from "../models/gpt.model.js";

const createQuestionsBatch = async (req, res) => {
  try {
    const data = await GPT.createQuestionsBatch();
    res.status(200).send({
      message: "Insertion completed successfully"
    });
  } catch (error) {
    console.error("Error in createQuestionsBatch controller:", error.message);
    res.status(500).send({
      message: "Some error occurred while creating questions batch.",
      error: error.message,
    });
  }
};

export { createQuestionsBatch };
