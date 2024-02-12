// GPT.model.js
import sql from "./db.js";
import {chatGPTRequest, chatGPTRequestWithParentId} from "../chatGptIntegration.js";
import splitParagraph from "../utils/utils.js";

const GPT = () => { };

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

GPT.getUniqueGPTIndex = async () => {
  try {
    const fetchQuery = `SELECT id, key_metadata FROM gpt_index WHERE id IN (SELECT MIN(id) AS id FROM gpt_index GROUP BY key_metadata);`;
    const [answersData] = await sql.query(fetchQuery);
    return answersData;
  } catch (error) {
    console.error("Error in getUniqueGPTIndex: ", error.message)
    throw error
  }
}

GPT.getDistinctDoc = async () => {
  try {
    const fetchQuery = `Select distinct typ_de_doc from gpt_index;`;
    const [answersData] = await sql.query(fetchQuery);
    return answersData;
  } catch (error) {
    console.error("Error in getUniqueGPTIndex: ", error.message)
    throw error
  }
}

GPT.getSummaryInvite = async (data) => {
  try {
    const fetchQuery = `Select distinct id_text from gpt_index where key_metadata = "${data.key}";`
    const [answersData] = await sql.query(fetchQuery);
    const idTextValues = answersData.map(item => item.id_text).join(',');
    const fetchSecondQuery = `Select text from gpt_text where id IN (${idTextValues});`
    const [secondQueryAnswerData] = await sql.query(fetchSecondQuery);
    const invitesSummary = secondQueryAnswerData.map(item => item.text).join("\n");
    const modifiedText = `${invitesSummary} \n \n Question: \n ${data.question}  `;
    const gptResponse = await chatGPTRequest(modifiedText);
    return gptResponse
  } catch (error) {
    console.error("Error in getSummaryInvite: ", error.message)
    throw error
  }
}

GPT.getSummaryDoc = async (data) => {
  try {
    const fetchQuery = `Select distinct id_text from gpt_index where typ_de_doc = "${data.key}";`
    const [answersData] = await sql.query(fetchQuery);
    const idTextValues = answersData.map(item => item.id_text).join(',');
    const fetchSecondQuery = `Select text from gpt_text where id IN (${idTextValues});`
    const [secondQueryAnswerData] = await sql.query(fetchSecondQuery);
    const invitesSummary = secondQueryAnswerData.map(item => item.text).join("\n");
    const wordCount = process.env.DOC_WORD_COUNT;
    let modifiedText = splitParagraph(invitesSummary, wordCount)
    let parentId = null;
    let gptResponse = [];
    gptResponse[0] = await chatGPTRequestWithParentId(`Summarise the below conversation: \n ${modifiedText.firstPart}`, parentId);
    parentId = gptResponse[0].id
    modifiedText = splitParagraph(modifiedText.secondPart, wordCount)
    let c = 1;
    do {
      gptResponse[c] = await chatGPTRequestWithParentId(`Summarise the below text and the previous summary: \n ${modifiedText.firstPart}`, parentId);
      parentId = gptResponse[c].id
      modifiedText = modifiedText.secondPart
      modifiedText =  splitParagraph(modifiedText, wordCount)
      c++;
    } while(modifiedText.secondPart !== "")
    const summaryText = modifiedText.firstPart + "\n" + `Question : \n ${data.question}`
    gptResponse[c] = await chatGPTRequestWithParentId(summaryText, parentId);
    return gptResponse[c].text
  } catch (error) {
    console.error("Error in getSummaryDoc: ", error.message)
    throw error
  }
}

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
