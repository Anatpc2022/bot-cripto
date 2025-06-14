import app from "./app.js";
import logger from "./utils/logger.js";
import appEm from "./app-em.js";

async function start() {
    logger("sistema", "Sua versão do Node.js é " + process.version);

    logger("sistema", "Inicializando o backend do RiberBot...");

    logger("sistema", "Nenhum usuário ativo encontrado!");

    logger("sistema", "Iniciando os Apps do servidor...");

    app.listen(process.env.PORT, () => {
        logger("sistema", "O App está escutando na porta " + process.env.PORT);
    })

    appEm.init();
}

start();