import axios from "./BaseService";

const AUTOMATIONS_URL = import.meta.env.VITE_API_URL + "/automations";

export async function getAutomations(page = 1) {
  const response = await axios.get(`${AUTOMATIONS_URL}?page=${page}`);
  return response.data; //{ rows: [], count: x }
}

export async function getAutomation(id) {
  const response = await axios.get(`${AUTOMATIONS_URL}/${id}`);
  return response.data;
}

export async function deleteAutomation(id) {
  const response = await axios.delete(`${AUTOMATIONS_URL}/${id}`);
  return response.data;
}

export async function saveAutomation(id, newMonitor) {
  let response;
  if (id) response = await axios.patch(`${AUTOMATIONS_URL}/${id}`, newMonitor);
  else response = await axios.post(AUTOMATIONS_URL, newMonitor);

  return response.data;
}

export async function startAutomation(id) {
  const response = await axios.post(`${AUTOMATIONS_URL}/${id}/start`);
  return response.data;
}

export async function stopAutomation(id) {
  const response = await axios.post(`${AUTOMATIONS_URL}/${id}/stop`);
  return response.data;
}
