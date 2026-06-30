import automationsRepository from "../repositories/automationsRepository.js";
import ordersRepository from "../repositories/ordersRepository.js";
import orderTemplatesRepository from "../repositories/orderTemplatesRepository.js";
import db from "../db.js";
import logger from "../utils/logger.js";
import RiberBot from "../riberBot.js";
import gridsRepository from "../repositories/gridsRepository.js";

function validateConditions(conditions) {
  return /^(MEMORY\[\'.+?\'\](\..+)?[><=!]+\(?([0-9\.\-]+|(\'.+?\')|true|false|MEMORY\[\'.+?\'\](\..+)?)\)?( && )?)+$/g.test(
    conditions,
  );
}

async function getAutomation(req, res) {
  const userId = res.locals.token.id;
  const id = req.params.id;
  const automation = await automationsRepository.getAutomation(id);
  if (!automation) return res.sendStatus(404);
  if (automation.userId !== userId) return res.sendStatus(403);
  return res.json(automation);
}

async function getAutomations(req, res) {
  const userId = res.locals.token.id;
  const page = parseInt(req.query.page || 1);

  const automations = await automationsRepository.getAutomations(userId, page);
  return res.json(automations);
}

async function insertAutomation(req, res) {
  const userId = res.locals.token.id;
  const newAutomation = req.body;
  newAutomation.userId = userId;

  const { quantity, levels } = req.query;

  const alreadyExists = await automationsRepository.automationExists(
    userId,
    newAutomation.symbol,
    newAutomation.name,
  );
  if (alreadyExists) return res.sendStatus(409);

  if (
    !validateConditions(newAutomation.openCondition) &&
    !validateConditions(newAutomation.closeCondition)
  )
    return res.sendStatus(422);

  const isGrid = newAutomation.type === "GRID";
  if (isGrid && (!quantity || !levels))
    return res.status(422).send(`Invalid grid params.`);

  const transaction = await db.transaction();
  let savedAutomation;

  try {
    let buyOrderTemplate, sellOrderTemplate;
    if (isGrid) {
      buyOrderTemplate = await orderTemplatesRepository.insertOrderTemplate(
        {
          name: newAutomation.name + " COMPRA",
          symbol: newAutomation.symbol,
          type: "MARKET",
          side: "BUY",
          userId: newAutomation.userId,
          limitPrice: null,
          limitPriceMultiplier: 1,
          stopPrice: null,
          stopPriceMultiplier: 1,
          quantity: "QUOTE_QTY",
          quantityMultiplier: quantity,
        },
        transaction,
      );
      newAutomation.openTemplateId = buyOrderTemplate.id;

      sellOrderTemplate = await orderTemplatesRepository.insertOrderTemplate(
        {
          name: newAutomation.name + " VENDA",
          symbol: newAutomation.symbol,
          type: "MARKET",
          side: "SELL",
          userId: newAutomation.userId,
          limitPrice: null,
          limitPriceMultiplier: 1,
          stopPrice: null,
          stopPriceMultiplier: 1,
          quantity: "QUOTE_QTY",
          quantityMultiplier: quantity,
        },
        transaction,
      );
      newAutomation.closeTemplateId = sellOrderTemplate.id;
    }

    savedAutomation = await automationsRepository.insertAutomation(
      newAutomation,
      transaction,
    );

    if (isGrid) {
      savedAutomation.openTemplate = buyOrderTemplate;
      savedAutomation.closeTemplate = sellOrderTemplate;
      await RiberBot.getInstance().generateGrids(
        savedAutomation,
        levels,
        quantity,
        transaction,
      );
    }

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    logger("system", err);
    return res.status(500).send(err.message);
  }

  if (savedAutomation.isActive) {
    RiberBot.getInstance().updateBrain(savedAutomation.get({ plain: true }));
  }

  res.status(201).json(savedAutomation.get({ plain: true }));
}

async function updateAutomation(req, res) {
  const userId = res.locals.token.id;
  const id = req.params.id;
  const newAutomation = req.body;
  newAutomation.userId = userId;

  const { quantity, levels } = req.query;

  const isGrid = newAutomation.type === "GRID";
  if (isGrid && (!quantity || !levels))
    return res.status(422).send(`Invalid grid params.`);

  if (
    !validateConditions(newAutomation.openCondition) &&
    !validateConditions(newAutomation.closeCondition)
  )
    return res.sendStatus(422);

  const currentAutomation = await automationsRepository.getAutomation(id);
  if (!currentAutomation) return res.sendStatus(404);
  if (currentAutomation.userId !== userId) return res.sendStatus(403);

  RiberBot.getInstance().deleteBrain(currentAutomation);

  const transaction = await db.transaction();
  let updatedAutomation;

  try {
    updatedAutomation = await automationsRepository.updateAutomation(
      id,
      newAutomation,
      transaction,
    );

    if (isGrid)
      await RiberBot.getInstance().generateGrids(
        updatedAutomation,
        levels,
        quantity,
        transaction,
      );

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    logger("system", err);
    return res.status(500).send(err.message);
  }

  updatedAutomation = await automationsRepository.getAutomation(
    updatedAutomation.id,
  );
  if (updatedAutomation.isActive) {
    RiberBot.getInstance().updateBrain(updatedAutomation.get({ plain: true }));
  }

  res.json(updatedAutomation.get({ plain: true }));
}

async function deleteAutomation(req, res) {
  const userId = res.locals.token.id;
  const id = req.params.id;

  const currentAutomation = await automationsRepository.getAutomation(id);
  if (!currentAutomation) return res.sendStatus(404);
  if (currentAutomation.userId !== userId) return res.sendStatus(403);

  if (currentAutomation.isActive) {
    RiberBot.getInstance().deleteBrain(currentAutomation);
  }

  const transaction = await db.transaction();

  try {
    await ordersRepository.removeAutomationFromOrders(id, transaction);

    if (currentAutomation.type === "GRID")
      await gridsRepository.deleteGrids(id, transaction);

    await automationsRepository.deleteAutomation(id, transaction);

    if (currentAutomation.type === "GRID")
      await orderTemplatesRepository.deleteOrderTemplatesByIds(
        userId,
        [currentAutomation.openTemplateId, currentAutomation.closeTemplateId],
        transaction,
      );

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    logger("A-" + currentAutomation.id, err);
    return res.status(500).json(err.message);
  }

  res.sendStatus(204);
}

async function startAutomation(req, res) {
  const userId = res.locals.token.id;
  const id = req.params.id;

  const currentAutomation = await automationsRepository.getAutomation(id);
  if (!currentAutomation) return res.sendStatus(404);
  if (currentAutomation.isActive) return res.sendStatus(204);
  if (currentAutomation.userId !== userId) return res.sendStatus(403);

  currentAutomation.isActive = true;
  await currentAutomation.save();

  RiberBot.getInstance().updateBrain(currentAutomation.get({ plain: true }));

  res.json(currentAutomation.get({ plain: true }));
}

async function stopAutomation(req, res) {
  const userId = res.locals.token.id;
  const id = req.params.id;

  const currentAutomation = await automationsRepository.getAutomation(id);
  if (!currentAutomation) return res.sendStatus(404);
  if (!currentAutomation.isActive) return res.sendStatus(204);
  if (currentAutomation.userId !== userId) return res.sendStatus(403);

  RiberBot.getInstance().deleteBrain(currentAutomation);

  currentAutomation.isActive = false;
  await currentAutomation.save();

  res.json(currentAutomation.get({ plain: true }));
}

export default {
  getAutomation,
  getAutomations,
  insertAutomation,
  updateAutomation,
  deleteAutomation,
  startAutomation,
  stopAutomation,
};
