import OpenAI from "openai";

export const openAiApiKey = process.env.OPENAI_API_KEY;

export const openai = new OpenAI({
  apiKey: openAiApiKey,
});
