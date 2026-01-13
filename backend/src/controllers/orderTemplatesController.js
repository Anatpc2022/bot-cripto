import orderTemplatesRepository from "../repositories/orderTemplatesRepository.js";
import automationsRepository from "../repositories/automationsRepository.js";
import RiberBot from "../riberBot.js";

function validatePrice(price) {
  if (!price) return true;
  if (parseFloat(price)) return true;
  return /^((TICKER|AUTO_ORDER|LAST_ORDER|LAST_CANDLE)_.+)$/.test(price);
}

function validateQuantity(quantity) {
  if (parseFloat(quantity)) return true;
  return [
    "AUTO_ORDER_QTY",
    "QUOTE_QTY",
    "LAST_ORDER_QTY",
    "MIN_NOTIONAL",
    "MAX_WALLET",
  ].includes(quantity);
}

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

  const alreadyExists = await orderTemplatesRepository.orderTemplateExists(
    userId,
    newOrderTemplate.name,
    newOrderTemplate.symbol
  );
  if (alreadyExists)
    return res
      .status(409)
      .send(`Já existe um modelo de pedido com esses parâmetros.`);

  newOrderTemplate.limitPrice = newOrderTemplate.limitPrice
    ? newOrderTemplate.limitPrice.replace(",", ".")
    : newOrderTemplate.limitPrice;
  newOrderTemplate.stopPrice = newOrderTemplate.stopPrice
    ? newOrderTemplate.stopPrice.replace(",", ".")
    : newOrderTemplate.stopPrice;
  newOrderTemplate.quantity = newOrderTemplate.quantity
    ? newOrderTemplate.quantity.replace(",", ".")
    : newOrderTemplate.quantity;

  if (
    !validatePrice(newOrderTemplate.limitPrice) ||
    !validatePrice(newOrderTemplate.stopPrice) ||
    !validateQuantity(newOrderTemplate.quantity)
  )
    return res.status(422).send(`Preço e/ou quantidade inválidos`);

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

  newOrderTemplate.limitPrice = newOrderTemplate.limitPrice
    ? newOrderTemplate.limitPrice.replace(",", ".")
    : newOrderTemplate.limitPrice;
  newOrderTemplate.stopPrice = newOrderTemplate.stopPrice
    ? newOrderTemplate.stopPrice.replace(",", ".")
    : newOrderTemplate.stopPrice;
  newOrderTemplate.quantity = newOrderTemplate.quantity
    ? newOrderTemplate.quantity.replace(",", ".")
    : newOrderTemplate.quantity;

  if (
    !validatePrice(newOrderTemplate.limitPrice) ||
    !validatePrice(newOrderTemplate.stopPrice) ||
    (newOrderTemplate.quantity && !validateQuantity(newOrderTemplate.quantity))
  )
    return res.status(422).send(`Preço e/ou quantidade inválidos`);

  const orderTemplate = await orderTemplatesRepository.updateOrderTemplate(
    userId,
    id,
    newOrderTemplate
  );

  const automations =
    await automationsRepository.getActiveAutomationsByOrderTemplateId(id);
  if (automations && automations.length) {
    const riberBot = RiberBot.getInstance();
    automations.map((a) => riberBot.updateBrain(a.get({ plain: true })));
  }

  res.json(orderTemplate.get({ plain: true }));
}

async function deleteOrderTemplate(req, res) {
  const userId = res.locals.token.id;
  const id = req.params.id;

  const currentOrderTemplate = await orderTemplatesRepository.getOrderTemplate(
    userId,
    id
  );
  if (!currentOrderTemplate) return res.sendStatus(404);
  if (currentOrderTemplate.userId !== userId) return res.sendStatus(403);

  const automations =
    await automationsRepository.getAutomationsByOrderTemplateId(id);
  if (automations && automations.length)
    return res
      .status(409)
      .send(`Existem automações que utilizam este modelo de pedido.`);

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
