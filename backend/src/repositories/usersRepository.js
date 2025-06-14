import userModel from "../models/userModel.js";

function getUserByEmail(email) {
    return userModel.findOne({ where: { email } });
}

function getActiveUsers() {
    return userModel.findAll({
        where: { isActive: true },
        include: [{ all: true, nested: true }]
    })
}

export default {
    getUserByEmail,
    getActiveUsers
}