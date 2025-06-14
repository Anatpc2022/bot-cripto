import Cache from "./utils/cache.js";

export default class RiberBot {

    static instance;

    static getInstance(automations = []) {
        if (!RiberBot.instance)
            RiberBot.instance = new RiberBot(automations);
        return RiberBot.instance;
    }

    constructor(automations) {
        this.cache = new Cache();

        //inicializar o cérebro
    }

    async setCache(symbol, index, interval, value, executeAutomations = true){
        return true;
    }

    async updateTickerMemory(symbol, index, value, executeAutomations = true){
        this.setCache(symbol, index, null, value, executeAutomations);
    }

    async updateMemory(symbol, index, interval, value, executeAutomations = true) {
        if (value === undefined || value === null) return false;
        if (value.toJSON) value = value.toJSON();
        if (value.get) value = value.get({ plain: true });

        if(index === "TICKER")
            return this.updateTickerMemory(symbol, index, value, executeAutomations);
        else
            return this.setCache(symbol, index, interval, value, executeAutomations);
    }

}