import monitorsRepository from "../repositories/monitorsRepository.js";

async function getMonitor(req, res) {
  const userId = res.locals.token.id;
  const id = req.params.id;
  const monitor = await monitorsRepository.getMonitor(id);
  if (!monitor) return res.sendStatus(404);
  if (monitor.userId !== userId) return res.sendStatus(403);
  return res.json(monitor);
}

async function getMonitors(req, res) {
  const userId = res.locals.token.id;
  const page = parseInt(req.query.page || 1);

  const monitors = await monitorsRepository.getMonitors(userId, page);
  return res.json(monitors);
}

async function insertMonitor(req, res) {
  const userId = res.locals.token.id;
  const newMonitor = req.body;
  newMonitor.userId = userId;

  const alreadyExists = await monitorsRepository.monitorExists(
    userId,
    newMonitor.type,
    newMonitor.symbol,
    newMonitor.interval
  );
  if (alreadyExists) return res.sendStatus(409);

  const monitor = await monitorsRepository.insertMonitor(newMonitor);

  //se ativo, inicializa no exchange monitor

  res.status(201).json(monitor.get({ plain: true }));
}

async function updateMonitor(req, res) {
  const userId = res.locals.token.id;
  const id = req.params.id;
  const newMonitor = req.body;
  newMonitor.userId = userId;

  const currentMonitor = await monitorsRepository.getMonitor(id);
  if (!currentMonitor) return res.sendStatus(404);
  if (currentMonitor.userId !== userId) return res.sendStatus(403);

  const monitor = await monitorsRepository.updateMonitor(id, newMonitor);
  //desativa o monitor

  //se ativo, inicializa no exchange monitor

  res.json(monitor.get({ plain: true }));
}

async function deleteMonitor(req, res) {
  const userId = res.locals.token.id;
  const id = req.params.id;

  const currentMonitor = await monitorsRepository.getMonitor(id);
  if (!currentMonitor) return res.sendStatus(404);
  if (currentMonitor.userId !== userId) return res.sendStatus(403);

  //se ativo, desativa o monitor no exchange monitor

  await monitorsRepository.deleteMonitor(id);
  res.sendStatus(204);
}

async function startMonitor(req, res) {
  const userId = res.locals.token.id;
  const id = req.params.id;

  const currentMonitor = await monitorsRepository.getMonitor(id);
  if (!currentMonitor) return res.sendStatus(404);
  if (currentMonitor.isActive) return res.sendStatus(204);
  if (currentMonitor.userId !== userId) return res.sendStatus(403);

  //inicializa no exchange monitor
  currentMonitor.isActive = true;
  await currentMonitor.save();

  res.json(currentMonitor.get({ plain: true }));
}

async function stopMonitor(req, res) {
  const userId = res.locals.token.id;
  const id = req.params.id;

  const currentMonitor = await monitorsRepository.getMonitor(id);
  if (!currentMonitor) return res.sendStatus(404);
  if (!currentMonitor.isActive) return res.sendStatus(204);
  if (currentMonitor.userId !== userId) return res.sendStatus(403);

  //desativa no exchange monitor
  currentMonitor.isActive = false;
  await currentMonitor.save();

  res.json(currentMonitor.get({ plain: true }));
}

export default {
  getMonitor,
  getMonitors,
  insertMonitor,
  updateMonitor,
  deleteMonitor,
  startMonitor,
  stopMonitor,
};
