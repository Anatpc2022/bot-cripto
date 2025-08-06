import axios from "./BaseService";

const RIBERBOT_URL = `${import.meta.env.VITE_API_URL}/riberBot`;

export async function getMemory() {
  const url = RIBERBOT_URL + "/memory";
  const response = await axios.get(url);
  return response.data;
}

export async function getBrain() {
  const url = RIBERBOT_URL + "/brain";
  const response = await axios.get(url);
  return response.data;
}

export async function updateMemory(index, value) {
  const url = RIBERBOT_URL + "/memory/" + index;
  const response = await axios.patch(url, { data: value });
  return response.data;
}

export async function getAnalysisIndexes() {
  const url = RIBERBOT_URL + "/analysis";
  const response = await axios.get(url);
  return response.data;
}
