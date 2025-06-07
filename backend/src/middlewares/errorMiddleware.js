import logger from "../utils/logger.js";

export default (error, req, res, next) => {
    logger("sistema", error);
    return res.status(500).json(error.response ? error.response.data : error.message);
}