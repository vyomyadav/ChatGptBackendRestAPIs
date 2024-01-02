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

async function chatGPTRequest(prompt) {
  try {
    const res = await api.sendMessage(prompt)
    return res.text
  } catch (error) {
    console.error('ChatGPT API Request Error:', error.message);
    throw error;
  }
}

export default chatGPTRequest;
