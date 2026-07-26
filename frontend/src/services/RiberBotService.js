import axios from "./BaseService";

const RIBERBOT_URL = `${import.meta.env.VITE_API_URL}/riberBot`;

export async function getMemory() {
  const response = await axios.get(`${RIBERBOT_URL}/memory`);
  return response.data;
}

export async function getIndexes() {
  const response = await axios.get(`${RIBERBOT_URL}/memory/indexes`);
  return response.data;
}

export function getAutoOrderIndexes(automationId, symbol) {
  return [
    {
      symbol,
      variable: `AUTO_ORDER_${automationId || "X"}.avgPrice`,
      eval: `MEMORY['${symbol}:AUTO_ORDER_${automationId || "X"}'].avgPrice`,
      example: 1000,
    },
    {
      symbol,
      variable: `AUTO_ORDER_${automationId || "X"}.limitPrice`,
      eval: `MEMORY['${symbol}:AUTO_ORDER_${automationId || "X"}'].limitPrice`,
      example: 1000,
    },
    {
      symbol,
      variable: `AUTO_ORDER_${automationId || "X"}.net`,
      eval: `MEMORY['${symbol}:AUTO_ORDER_${automationId || "X"}'].net`,
      example: 1000,
    },
    {
      symbol,
      variable: `AUTO_ORDER_${automationId || "X"}.quantity`,
      eval: `MEMORY['${symbol}:AUTO_ORDER_${automationId || "X"}'].quantity`,
      example: 1,
    },
    {
      symbol,
      variable: `AUTO_ORDER_${automationId || "X"}.stopPrice`,
      eval: `MEMORY['${symbol}:AUTO_ORDER_${automationId || "X"}'].stopPrice`,
      example: 1000,
    },
    {
      symbol,
      variable: `AUTO_ORDER_${automationId || "X"}.trailingDelta`,
      eval: `MEMORY['${symbol}:AUTO_ORDER_${automationId || "X"}'].trailingDelta`,
      example: 50,
    },
    {
      symbol,
      variable: `AUTO_ORDER_${automationId || "X"}.side`,
      eval: `MEMORY['${symbol}:AUTO_ORDER_${automationId || "X"}'].side`,
      example: "BUY",
    },
    {
      symbol,
      variable: `AUTO_ORDER_${automationId || "X"}.status`,
      eval: `MEMORY['${symbol}:AUTO_ORDER_${automationId || "X"}'].status`,
      example: "FILLED",
    },
    {
      symbol,
      variable: `AUTO_ORDER_${automationId || "X"}.type`,
      eval: `MEMORY['${symbol}:AUTO_ORDER_${automationId || "X"}'].type`,
      example: "MARKET",
    },
  ];
}

export function getLastOrderIndexes(symbol) {
  const userId = localStorage.getItem("id");

  return [
    {
      symbol,
      variable: `LAST_ORDER_${userId}.avgPrice`,
      eval: `MEMORY['${symbol}:LAST_ORDER_${userId}'].avgPrice`,
      example: 1000,
    },
    {
      symbol,
      variable: `LAST_ORDER_${userId}.limitPrice`,
      eval: `MEMORY['${symbol}:LAST_ORDER_${userId}'].limitPrice`,
      example: 1000,
    },
    {
      symbol,
      variable: `LAST_ORDER_${userId}.net`,
      eval: `MEMORY['${symbol}:LAST_ORDER_${userId}'].net`,
      example: 1000,
    },
    {
      symbol,
      variable: `LAST_ORDER_${userId}.quantity`,
      eval: `MEMORY['${symbol}:LAST_ORDER_${userId}'].quantity`,
      example: 1,
    },
    {
      symbol,
      variable: `LAST_ORDER_${userId}.stopPrice`,
      eval: `MEMORY['${symbol}:LAST_ORDER_${userId}'].stopPrice`,
      example: 1000,
    },
    {
      symbol,
      variable: `LAST_ORDER_${userId}.trailingDelta`,
      eval: `MEMORY['${symbol}:LAST_ORDER_${userId}'].trailingDelta`,
      example: 50,
    },
    {
      symbol,
      variable: `LAST_ORDER_${userId}.side`,
      eval: `MEMORY['${symbol}:LAST_ORDER_${userId}'].side`,
      example: "BUY",
    },
    {
      symbol,
      variable: `LAST_ORDER_${userId}.status`,
      eval: `MEMORY['${symbol}:LAST_ORDER_${userId}'].status`,
      example: "FILLED",
    },
    {
      symbol,
      variable: `LAST_ORDER_${userId}.type`,
      eval: `MEMORY['${symbol}:LAST_ORDER_${userId}'].type`,
      example: "MARKET",
    },
  ];
}

export async function getBrain() {
  const response = await axios.get(`${RIBERBOT_URL}/brain`);
  return response.data;
}

export async function updateMemory(index, value) {
  const url = `${RIBERBOT_URL}/memory/${index}`;
  const response = await axios.patch(url, { data: value });
  return response.data;
}

export async function getAnalysisIndexes() {
  const response = await axios.get(`${RIBERBOT_URL}/analysis`);
  return response.data;
}

export async function cleanChat() {
  const response = await axios.delete(`${RIBERBOT_URL}/chat`);
  return response.data;
}

export async function sendChat(question, files) {
  console.log(question, files);

  const formData = new FormData();
  formData.append("question", question);

  if (files && files.length)
    files.map((file) => formData.append("files[]", file));

  const response = await axios.post(`${RIBERBOT_URL}/chat`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}
