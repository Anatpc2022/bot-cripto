import GridModel from "../models/gridModel.js";

function insertGrids(grids, transaction) {
  return GridModel.bulkCreate(grids, { transaction });
}

function deleteGrids(automationId, transaction) {
  return GridModel.destroy({
    where: { automationId },
    transaction,
  });
}

function getByAutomation(automationId) {
  return GridModel.findAll({ where: { automationId } });
}

async function updateGrid(id, newGrid) {
  const currentGrid = await GridModel.findByPk(id);

  if (newGrid.condition && newGrid.condition !== currentGrid.condition)
    currentGrid.condition = newGrid.condition;

  await currentGrid.save();
  return currentGrid;
}

export default {
  insertGrids,
  deleteGrids,
  getByAutomation,
  updateGrid,
};
