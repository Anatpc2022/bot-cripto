import OrderTemplateModel from "../models/orderTemplateModel.js";

function insertOrderTemplate(newOrderTemplate, transaction) {
  return OrderTemplateModel.create(newOrderTemplate, { transaction });
}

function deleteOrderTemplate(userId, id) {
  return OrderTemplateModel.destroy({ where: { id, userId } });
}

function deleteOrderTemplatesByIds(userId, ids, transaction) {
  return OrderTemplateModel.destroy({
    where: { id: ids, userId },
    transaction,
  });
}

function getOrderTemplates(userId, page = 1) {
  const options = {
    where: { userId },
    order: [
      ["symbol", "ASC"],
      ["name", "ASC"],
    ],
    limit: 10,
    offset: 10 * (page - 1),
    distinct: true,
  };

  return OrderTemplateModel.findAndCountAll(options);
}

async function getOrderTemplate(userId, id) {
  return OrderTemplateModel.findOne({ where: { id, userId } });
}

async function updateOrderTemplate(userId, id, newOrderTemplate, transaction) {
  const currentOrderTemplate = await getOrderTemplate(userId, id);
  if (!currentOrderTemplate)
    throw new Error(
      `There is no order template with userId: ${userId} and id: ${id}`,
    );

  if (
    newOrderTemplate.name &&
    newOrderTemplate.name !== currentOrderTemplate.name
  )
    currentOrderTemplate.name = newOrderTemplate.name;

  if (
    newOrderTemplate.type &&
    newOrderTemplate.type !== currentOrderTemplate.type
  )
    currentOrderTemplate.type = newOrderTemplate.type;

  if (
    newOrderTemplate.side &&
    newOrderTemplate.side !== currentOrderTemplate.side
  )
    currentOrderTemplate.side = newOrderTemplate.side;

  if (
    newOrderTemplate.limitPrice !== null &&
    newOrderTemplate.limitPrice !== undefined &&
    newOrderTemplate.limitPrice !== currentOrderTemplate.limitPrice
  )
    currentOrderTemplate.limitPrice = newOrderTemplate.limitPrice;

  if (
    newOrderTemplate.trailingDelta !== null &&
    newOrderTemplate.trailingDelta !== undefined &&
    newOrderTemplate.trailingDelta !== currentOrderTemplate.trailingDelta
  )
    currentOrderTemplate.trailingDelta = newOrderTemplate.trailingDelta;

  if (!newOrderTemplate.limitPriceMultiplier)
    currentOrderTemplate.limitPriceMultiplier = 1;
  else
    currentOrderTemplate.limitPriceMultiplier =
      newOrderTemplate.limitPriceMultiplier;

  if (
    newOrderTemplate.stopPrice !== null &&
    newOrderTemplate.stopPrice !== undefined &&
    newOrderTemplate.stopPrice !== currentOrderTemplate.stopPrice
  )
    currentOrderTemplate.stopPrice = newOrderTemplate.stopPrice;

  if (!newOrderTemplate.stopPriceMultiplier)
    currentOrderTemplate.stopPriceMultiplier = 1;
  else
    currentOrderTemplate.stopPriceMultiplier =
      newOrderTemplate.stopPriceMultiplier;

  if (
    newOrderTemplate.quantity &&
    newOrderTemplate.quantity !== currentOrderTemplate.quantity
  )
    currentOrderTemplate.quantity = newOrderTemplate.quantity;

  if (!newOrderTemplate.quantityMultiplier)
    currentOrderTemplate.quantityMultiplier = 1;
  else
    currentOrderTemplate.quantityMultiplier =
      newOrderTemplate.quantityMultiplier;

  await currentOrderTemplate.save({ transaction });
  return currentOrderTemplate;
}

function getAllOrderTemplates(userId, symbol) {
  const options = { where: { userId, symbol } };
  return OrderTemplateModel.findAll(options);
}

async function orderTemplateExists(userId, name, symbol) {
  const count = await OrderTemplateModel.count({
    where: { userId, name, symbol },
  });
  return count > 0;
}

export default {
  getAllOrderTemplates,
  getOrderTemplate,
  getOrderTemplates,
  updateOrderTemplate,
  deleteOrderTemplate,
  insertOrderTemplate,
  orderTemplateExists,
  deleteOrderTemplatesByIds,
};
