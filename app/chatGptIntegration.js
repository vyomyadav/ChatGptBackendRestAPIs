import { ChatGPTAPI } from 'chatgpt'
import nodeFetch from "node-fetch";

const api = new ChatGPTAPI({
	apiKey: process.env.BACKEND_APP_OPENAI_API_KEY,
	fetch: (url, options = {}) => {
		const mergedOptions = {
			...options,
		};

		return nodeFetch(url, mergedOptions);
	},
});

export async function chatGPTRequest(prompt) {
  try {
    const res = await api.sendMessage(prompt)
    return res.text
  } catch (error) {
    console.error('ChatGPT API Request Error:', error.message);
    throw error;
  }
}

export async function chatGPTRequestWithParentId(prompt, parentId) {
  try {
    let res;
    if(parentId) {
      res = await api.sendMessage(prompt, {
        parentMessageId: parentId
      });
    } else {
      res = await api.sendMessage(prompt);
    }
    return res
  } catch (error) {
    console.error('ChatGPT API Request Error:', error.message);
    throw error;
  }
}

// export default {chatGPTRequest, chatGPTRequestWithParentId};
