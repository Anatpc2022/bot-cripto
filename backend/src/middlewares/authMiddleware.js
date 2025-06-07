import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
import authController from "../controllers/authController.js";

export default async (req, res, next) => {
    const token = req.headers["authorization"];
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded) {
                const isBlacklisted = authController.isBlacklisted(token);
                if (!isBlacklisted) {
                    res.locals.token = decoded;
                    return next();
                }
            }
        } catch (err) {
            logger("sistema", err);
        }
    }

    res.sendStatus(401);
}