// GPT.model.js
import sql from "./db.js";
import chatGPTRequest from "../chatGptIntegration.js";

const GPT = () => {};

GPT.createQuestionsBatch = async () => {
  try {
    const fetchQuery = "SELECT id, text FROM gpt_text limit 2";
    const [answersData] = await sql.query(fetchQuery);

    if (!answersData || answersData.length === 0) {
      throw new Error("No questions found");
    }

    const responsesPromises = answersData.map(async ({ id, text }) => {
      const id_text = id;
      const modifiedText = `What questions can be generated from the following text:\n ${text} `;
      const gptResponse = await chatGPTRequest(modifiedText);

      const questions = gptResponse
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => {
          const match = line.match(/^\d+\.\s*(.*)\?$/);
          return match ? { id_text, question: match[1].trim() } : null;
        })
        .filter(question => question !== null)
        .slice(0, 10);

      const insertPromises = questions.map(({ id_text, question }) => {
        const insertQuery = "INSERT INTO gpt_invite (id_text, invite) VALUES (?, ?)";
        const insertValues = [id_text, question];

        return new Promise((resolve, reject) => {
          sql.query(insertQuery, insertValues, (err) => {
            if (err) {
              console.log("Error inserting question: ", err);
              reject(err);
            } else {
              console.log(`Inserted question with id_text ${id_text}`);
              resolve({ id_text, question });
            }
          });
        });
      });

      return Promise.all(insertPromises);
    });
    return true;
  } catch (error) {
    console.error("Error in createQuestionsBatch:", error.message);
    throw error;
  }
};

export default GPT;
