import userModel from "../models/userModel.js";

function getUserByEmail(email) {
    return userModel.findOne({ where: { email } });
}

export default {
    getUserByEmail
}