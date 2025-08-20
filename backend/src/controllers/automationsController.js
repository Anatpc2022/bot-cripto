import automationsRepository from "../repositories/automationsRepository.js";
import ordersRepository from "../repositories/ordersRepository.js";
import db from "../db.js";
import logger from "../utils/logger.js";
import RiberBot from "../riberBot.js";

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

  const alreadyExists = await automationsRepository.automationExists(
    userId,
    newAutomation.symbol,
    newAutomation.name
  );
  if (alreadyExists) return res.sendStatus(409);

  //validar as condições da automação

  const automation = await automationsRepository.insertAutomation(
    newAutomation
  );

  if (automation.isActive) {
    RiberBot.getInstance().updateBrain(automation.get({ plain: true }));
  }

  res.status(201).json(automation.get({ plain: true }));
}

async function updateAutomation(req, res) {
  const userId = res.locals.token.id;
  const id = req.params.id;
  const newAutomation = req.body;
  newAutomation.userId = userId;

  //validar as condições atualizadas

  const currentAutomation = await automationsRepository.getAutomation(id);
  if (!currentAutomation) return res.sendStatus(404);
  if (currentAutomation.userId !== userId) return res.sendStatus(403);

  const automation = await automationsRepository.updateAutomation(
    id,
    newAutomation
  );
  RiberBot.getInstance().deleteBrain(automation);

  if (automation.isActive) {
    RiberBot.getInstance().updateBrain(automation.get({ plain: true }));
  }

  res.json(automation.get({ plain: true }));
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

    await automationsRepository.deleteAutomation(id, transaction);

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
