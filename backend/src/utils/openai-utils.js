import OpenAI from "openai";
import fs from "fs";
import logger from "./logger.js";

const LOGS = process.env.AI_LOGS === "true";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function uploadFileToOpenAI(filePath) {
  const response = await openai.files.create({
    file: fs.createReadStream(filePath),
    purpose: "vision",
  });

  if (LOGS) logger("RiberBotAI", `uploadFileToOpenAI: ${response.id}`);
  return response.id;
}

export async function queryOpenAI(text, filePaths = [], thread = []) {
  const fileInputs = [];
  if (filePaths && filePaths.length) {
    for (const file of filePaths) {
      const fileId = await uploadFileToOpenAI(file);
      fileInputs.push({ type: "input_image", file_id: fileId });
    }

    thread.push({
      role: "user",
      content: [
        {
          type: "input_text",
          text: `Os arquivos anexados são imagens. Analise-os cuidadosamente.\n\n${text}`,
        },
        ...fileInputs,
      ],
    });
  } else thread.push({ role: "user", content: text });

  if (LOGS)
    logger(
      "RiberBotAI",
      `queryOpenAI: ${text}, ${fileInputs.length} files, ${thread.length} previous messages`,
    );

  const response = await openai.responses.create({
    model: process.env.AI_MODEL,
    input: thread,
  });

  thread.push({ role: "system", content: response.output_text });
  return response.output_text;
}
