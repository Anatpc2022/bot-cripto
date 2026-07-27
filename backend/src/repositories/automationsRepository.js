import { Op } from "sequelize";
import automationModel from "../models/automationModel.js";

export const automationTypes = {
  REGULAR: "REGULAR",
  GRID: "GRID",
};

async function automationExists(userId, symbol, name) {
  const count = await automationModel.count({
    where: { userId, symbol, name },
  });
  return count > 0;
}

async function insertAutomation(newAutomation, transaction) {
  return automationModel.create(newAutomation, { transaction });
}

function deleteAutomation(id, transaction) {
  return automationModel.destroy({ where: { id }, transaction });
}

function getAutomation(id) {
  return automationModel.findByPk(id, {
    include: [{ all: true, nested: true }],
  });
}

function getAutomations(userId, page = 1) {
  return automationModel.findAndCountAll({
    where: { userId },
    order: [
      ["isActive", "DESC"],
      ["symbol", "ASC"],
      ["name", "ASC"],
    ],
    limit: 10,
    offset: 10 * (page - 1),
    distinct: true,
    include: [{ all: true, nested: true }],
  });
}

function getActiveAutomations(userId) {
  return automationModel.findAll({
    where: { isActive: true, userId },
    distinct: true,
    include: [{ all: true, nested: true }],
  });
}

async function updateAutomation(id, newAutomation, transaction) {
  const currentAutomation = await getAutomation(id);

  if (newAutomation.symbol && newAutomation.symbol !== currentAutomation.symbol)
    currentAutomation.symbol = newAutomation.symbol;

  if (newAutomation.name && newAutomation.name !== currentAutomation.name)
    currentAutomation.name = newAutomation.name;

  if (newAutomation.openIndexes !== currentAutomation.openIndexes)
    currentAutomation.openIndexes = newAutomation.openIndexes;

  if (newAutomation.openCondition !== currentAutomation.openCondition)
    currentAutomation.openCondition = newAutomation.openCondition;

  if (newAutomation.openTemplateId !== undefined) {
    if (parseInt(newAutomation.openTemplateId) > 0) {
      if (newAutomation.openTemplateId !== currentAutomation.openTemplateId)
        currentAutomation.openTemplateId = newAutomation.openTemplateId;
    } else currentAutomation.openTemplateId = null;
  }

  if (newAutomation.closeIndexes !== currentAutomation.closeIndexes)
    currentAutomation.closeIndexes = newAutomation.closeIndexes;

  if (newAutomation.closeCondition !== currentAutomation.closeCondition)
    currentAutomation.closeCondition = newAutomation.closeCondition;

  if (newAutomation.closeTemplateId !== undefined) {
    if (parseInt(newAutomation.closeTemplateId) > 0) {
      if (newAutomation.closeTemplateId !== currentAutomation.closeTemplateId)
        currentAutomation.closeTemplateId = newAutomation.closeTemplateId;
    } else currentAutomation.closeTemplateId = null;
  }

  if (
    newAutomation.isActive !== null &&
    newAutomation.isActive !== undefined &&
    newAutomation.isActive !== currentAutomation.isActive
  )
    currentAutomation.isActive = newAutomation.isActive;

  if (
    newAutomation.sendNotification !== null &&
    newAutomation.sendNotification !== undefined &&
    newAutomation.sendNotification !== currentAutomation.sendNotification
  )
    currentAutomation.sendNotification = newAutomation.sendNotification;

  if (
    newAutomation.isOpened !== null &&
    newAutomation.isOpened !== undefined &&
    newAutomation.isOpened !== currentAutomation.isOpened
  )
    currentAutomation.isOpened = newAutomation.isOpened;

  if (
    newAutomation.logs !== null &&
    newAutomation.logs !== undefined &&
    newAutomation.logs !== currentAutomation.logs
  )
    currentAutomation.logs = newAutomation.logs;

  await currentAutomation.save({ transaction });
  return currentAutomation;
}

async function getActiveAutomationsByOrderTemplateId(orderTemplateId) {
  return automationModel.findAll({
    where: {
      isActive: true,
      [Op.or]: [
        {
          openTemplateId: orderTemplateId,
        },
        {
          closeTemplateId: orderTemplateId,
        },
      ],
    },
    include: [{ all: true, nested: true }],
  });
}

async function getAutomationsByOrderTemplateId(orderTemplateId) {
  return automationModel.findAll({
    where: {
      [Op.or]: [
        {
          openTemplateId: orderTemplateId,
        },
        {
          closeTemplateId: orderTemplateId,
        },
      ],
    },
    include: [{ all: true, nested: true }],
  });
}

export default {
  automationTypes,
  automationExists,
  insertAutomation,
  deleteAutomation,
  getAutomation,
  updateAutomation,
  getAutomations,
  getActiveAutomations,
  getActiveAutomationsByOrderTemplateId,
  getAutomationsByOrderTemplateId,
};
