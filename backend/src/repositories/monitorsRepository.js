import monitorModel from "../models/monitorModel.js";

const monitorTypes = {
  CANDLES: "CANDLES",
};

async function monitorExists(userId, type, symbol, interval) {
  const count = await monitorModel.count({
    where: { userId, type, symbol, interval },
  });
  return count > 0;
}

async function insertMonitor(newMonitor, transaction) {
  return monitorModel.create(newMonitor, { transaction });
}

function deleteMonitor(id) {
  return monitorModel.destroy({ where: { id } });
}

function getMonitor(id) {
  return monitorModel.findByPk(id);
}

function getMonitors(userId, page = 1) {
  return monitorModel.findAndCountAll({
    where: { userId },
    order: [
      ["isActive", "DESC"],
      ["symbol", "ASC"],
    ],
    limit: 10,
    offset: 10 * (page - 1),
  });
}

function getActiveUserMonitors(userId) {
  return monitorModel.findAll({
    where: { isActive: true, userId },
  });
}

async function updateMonitor(id, newMonitor) {
  const currentMonitor = await getMonitor(id);

  if (newMonitor.symbol && newMonitor.symbol !== currentMonitor.symbol)
    currentMonitor.symbol = newMonitor.symbol;

  if (newMonitor.type && newMonitor.type !== currentMonitor.type)
    currentMonitor.type = newMonitor.type;

  if (newMonitor.type === monitorTypes.CANDLES) {
    if (newMonitor.interval && newMonitor.interval !== currentMonitor.interval)
      currentMonitor.interval = newMonitor.interval;
  } else currentMonitor.interval = null;

  if (newMonitor.indexes !== currentMonitor.indexes)
    currentMonitor.indexes = newMonitor.indexes;

  if (
    newMonitor.isActive !== null &&
    newMonitor.isActive !== undefined &&
    newMonitor.isActive !== currentMonitor.isActive
  )
    currentMonitor.isActive = newMonitor.isActive;

  if (
    newMonitor.logs !== null &&
    newMonitor.logs !== undefined &&
    newMonitor.logs !== currentMonitor.logs
  )
    currentMonitor.logs = newMonitor.logs;

  await currentMonitor.save();
  return currentMonitor;
}

export default {
  monitorTypes,
  monitorExists,
  insertMonitor,
  deleteMonitor,
  getMonitor,
  updateMonitor,
  getMonitors,
  getActiveUserMonitors,
};
