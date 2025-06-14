import database from "./db.js";
import app from "./app.js";
import logger from "./utils/logger.js";
import appEm from "./app-em.js";
import usersRepository from "./repositories/usersRepository.js";

async function start() {
    logger("sistema", "Sua versão do Node.js é " + process.version);

    logger("sistema", "Inicializando o backend do RiberBot...");

    const users = await usersRepository.getActiveUsers();
    if(!users || !users.length) return logger("sistema", "Nenhum usuário ativo encontrado!");

    logger("sistema", "Iniciando os Apps do servidor...");

    app.listen(process.env.PORT, () => {
        logger("sistema", "O App está escutando na porta " + process.env.PORT);
    })

    appEm.init(users[0].id);
}

start();