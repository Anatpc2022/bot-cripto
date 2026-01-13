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

export async function saveAutomation(id, newAutomation) {
  let response;
  if (id)
    response = await axios.patch(`${AUTOMATIONS_URL}/${id}`, newAutomation);
  else response = await axios.post(AUTOMATIONS_URL, newAutomation);

  return response.data;
}

export async function saveGrid(id, newGridAutomation) {
  let response;
  if (id)
    response = await axios.patch(
      `${AUTOMATIONS_URL}/grid/${id}`,
      newGridAutomation
    );
  else
    response = await axios.post(`${AUTOMATIONS_URL}/grid/`, newGridAutomation);

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
