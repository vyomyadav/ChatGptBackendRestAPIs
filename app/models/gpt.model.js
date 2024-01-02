// GPT.model.js
import sql from "./db.js";
import chatGPTRequest from "../chatGptIntegration.js";

const GPT = () => {};

GPT.createQuestionsBatch = async () => {
  try {
    await callUpdateGptTables();

    const fetchQuery = `SELECT id, text FROM gpt_text limit ${process.env.LIMIT}`;
    const [answersData] = await sql.query(fetchQuery);

    if (!answersData || answersData.length === 0) {
      throw new Error("No questions found");
    }

    const responsesPromises = answersData.map(async ({ id, text }) => {
      const id_text = id;
      const modifiedText = `quelles questions peuvent être générées à partir du texte suivant :\n ${text} `;
      const gptResponse = await chatGPTRequest(modifiedText);

      const questions = gptResponse
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => {
          const match = line.match(/^\d+\.\s*(.*)\?$/);
          return match ? { id_text, question: match[1].trim() } : null;
        })
        .filter(question => question !== null)
        .slice(0, process.env.NUMBER_QUESTIONS);

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

// Define the stored procedure function
const callUpdateGptTables = () => {
  return new Promise((resolve, reject) => {
    const storedProcedureQuery = "CALL gpt_update_tables()";
    sql.query(storedProcedureQuery)
      .then(result => {
        // console.log("Stored procedure called successfully");
        resolve(result);
      })
      .catch(err => {
        console.error("Error calling stored procedure:", err);
        reject(err);
      });
  });
};

export default GPT;
