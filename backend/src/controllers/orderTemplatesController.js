import orderTemplatesRepository from "../repositories/orderTemplatesRepository.js";

async function getOrderTemplate(req, res) {
  const userId = res.locals.token.id;
  const id = req.params.id;
  const orderTemplate = await orderTemplatesRepository.getOrderTemplate(
    userId,
    id
  );
  if (!orderTemplate) return res.sendStatus(404);
  if (orderTemplate.userId !== userId) return res.sendStatus(403);
  return res.json(orderTemplate);
}

async function getOrderTemplates(req, res) {
  const userId = res.locals.token.id;
  const page = parseInt(req.query.page || 1);

  const orderTemplates = await orderTemplatesRepository.getOrderTemplates(
    userId,
    page
  );
  return res.json(orderTemplates);
}

async function insertOrderTemplate(req, res) {
  const userId = res.locals.token.id;
  const newOrderTemplate = req.body;
  newOrderTemplate.userId = userId;

  //validar order template

  const orderTemplate = await orderTemplatesRepository.insertOrderTemplate(
    newOrderTemplate
  );
  res.status(201).json(orderTemplate.get({ plain: true }));
}

async function updateOrderTemplate(req, res) {
  const userId = res.locals.token.id;
  const id = req.params.id;
  const newOrderTemplate = req.body;
  newOrderTemplate.userId = userId;

  const currentOrderTemplate = await orderTemplatesRepository.getOrderTemplate(
    userId,
    id
  );
  if (!currentOrderTemplate) return res.sendStatus(404);
  if (currentOrderTemplate.userId !== userId) return res.sendStatus(403);

  const orderTemplate = await orderTemplatesRepository.updateOrderTemplate(
    userId,
    id,
    newOrderTemplate
  );

  //atualizar no cérebro do beholder

  res.json(orderTemplate.get({ plain: true }));
}

async function deleteOrderTemplate(req, res) {
  const userId = res.locals.token.id;
  const id = req.params.id;

  const currentOrderTemplate = await orderTemplatesRepository.getOrderTemplate(
    userId, id
  );
  if (!currentOrderTemplate) return res.sendStatus(404);
  if (currentOrderTemplate.userId !== userId) return res.sendStatus(403);

  //validação

  await orderTemplatesRepository.deleteOrderTemplate(userId, id);
  res.sendStatus(204);
}

async function getAllOrderTemplates(req, res) {
  const userId = res.locals.token.id;
  const symbol = req.params.symbol;
  const orderTemplates = await orderTemplatesRepository.getAllOrderTemplates(
    userId,
    symbol
  );
  res.json(orderTemplates);
}

export default {
  getOrderTemplate,
  getOrderTemplates,
  insertOrderTemplate,
  updateOrderTemplate,
  deleteOrderTemplate,
  getAllOrderTemplates,
};
