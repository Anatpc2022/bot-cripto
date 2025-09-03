import userModel from "../models/userModel.js";

function getUserByEmail(email) {
  return userModel.findOne({ where: { email } });
}

function getUser(id) {
  return userModel.findByPk(id);
}

function getActiveUsers() {
  return userModel.findAll({
    where: { isActive: true },
    include: [{ all: true, nested: true }],
  });
}

export default {
  getUser,
  getUserByEmail,
  getActiveUsers,
};
