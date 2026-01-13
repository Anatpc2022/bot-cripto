import axios from "./BaseService";

const ORDER_TEMPLATES_URL = import.meta.env.VITE_API_URL + "/ordertemplates";

export async function getOrderTemplates(page = 1) {
  const response = await axios.get(`${ORDER_TEMPLATES_URL}?page=${page}`);
  return response.data; //{ rows: [], count: x }
}

export async function getAllOrderTemplates(symbol) {
  const response = await axios.get(`${ORDER_TEMPLATES_URL}/all/${symbol}`);
  return response.data;
}

export async function getOrderTemplate(id) {
  const response = await axios.get(`${ORDER_TEMPLATES_URL}/${id}`);
  return response.data;
}

export async function deleteOrderTemplate(id) {
  const response = await axios.delete(`${ORDER_TEMPLATES_URL}/${id}`);
  return response.data;
}

export async function saveOrderTemplate(id, newOrderTemplate) {
  let response;
  if (id)
    response = await axios.patch(
      `${ORDER_TEMPLATES_URL}/${id}`,
      newOrderTemplate
    );
  else response = await axios.post(ORDER_TEMPLATES_URL, newOrderTemplate);

  return response.data;
}
