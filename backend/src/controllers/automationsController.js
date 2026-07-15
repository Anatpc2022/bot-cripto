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

function buildGridAutomation(gridData, userId) {
  const { symbol, quantity, levels, lowerLimit, upperLimit } = gridData;

  if (!quantity || !levels || !symbol || !lowerLimit || !upperLimit)
    throw new Error(`Invalid grid params.`);

  const automation = {};
  automation.symbol = symbol;
  automation.type = "GRID";
  automation.userId = userId;
  automation.name = `GRID ${symbol} #${levels}`;
  automation.closeIndexes = automation.openIndexes = `${symbol}:TICKER`;
  automation.closeCondition =
    automation.openCondition = `MEMORY['${symbol}:TICKER'].current.close>${lowerLimit} && MEMORY['${symbol}:TICKER'].current.close<${upperLimit}`;
  automation.isOpened = false;
  automation.sendNotification = !!gridData.sendNotification;
  automation.isActive = !!gridData.isActive;
  automation.logs = !!gridData.logs;

  if (!validateConditions(automation.openCondition))
    throw new Error(`Invalid grid condition`);

  return automation;
}

async function insertGridAutomation(req, res) {
  const userId = res.locals.token.id;
  const newAutomation = buildGridAutomation(req.body, userId);

  const alreadyExists = await automationsRepository.automationExists(
    userId,
    newAutomation.symbol,
    newAutomation.name,
  );
  if (alreadyExists) return res.sendStatus(409);

  const transaction = await db.transaction();
  let savedAutomation;

  try {
    const quantity = parseFloat(req.body.quantity);
    const buyOrderTemplate = await orderTemplatesRepository.insertOrderTemplate(
      {
        name: newAutomation.name + " COMPRA",
        symbol: newAutomation.symbol,
        type: "MARKET",
        side: "BUY",
        userId,
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

    const sellOrderTemplate =
      await orderTemplatesRepository.insertOrderTemplate(
        {
          name: newAutomation.name + " VENDA",
          symbol: newAutomation.symbol,
          type: "MARKET",
          side: "SELL",
          userId,
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

    savedAutomation = await automationsRepository.insertAutomation(
      newAutomation,
      transaction,
    );
    savedAutomation.openTemplate = buyOrderTemplate;
    savedAutomation.closeTemplate = sellOrderTemplate;

    const levels = parseInt(req.body.levels);
    await RiberBot.getInstance().generateGrids(
      savedAutomation,
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

  if (savedAutomation.isActive) {
    savedAutomation = await automationsRepository.getAutomation(
      savedAutomation.id,
    );
    RiberBot.getInstance().updateBrain(savedAutomation.get({ plain: true }));
  }

  res.status(201).json(savedAutomation.get({ plain: true }));
}

async function insertAutomation(req, res) {
  const userId = res.locals.token.id;
  const newAutomation = req.body;
  newAutomation.userId = userId;
  newAutomation.type = "REGULAR";

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

  const transaction = await db.transaction();
  let savedAutomation;

  try {
    savedAutomation = await automationsRepository.insertAutomation(
      newAutomation,
      transaction,
    );
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    logger("system", err);
    return res.status(500).send(err.message);
  }

  if (savedAutomation.isActive) {
    savedAutomation = await automationsRepository.getAutomation(
      savedAutomation.id,
    );
    RiberBot.getInstance().updateBrain(savedAutomation.get({ plain: true }));
  }

  res.status(201).json(savedAutomation.get({ plain: true }));
}

async function updateGridAutomation(req, res) {
  const userId = res.locals.token.id;
  const id = req.params.id;
  const newAutomation = buildGridAutomation(req.body, userId);

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
    await RiberBot.getInstance().generateGrids(
      updatedAutomation,
      parseInt(req.body.levels),
      parseFloat(req.body.quantity),
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

async function updateAutomation(req, res) {
  const userId = res.locals.token.id;
  const id = req.params.id;
  const newAutomation = req.body;
  newAutomation.userId = userId;
  newAutomation.type = "REGULAR";

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
    logger(`A-${currentAutomation.id}`, err);
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
  insertGridAutomation,
  updateGridAutomation,
};
