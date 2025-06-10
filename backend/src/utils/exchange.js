import Binance from "node-binance-api";

const LOGS = process.env.BINANCE_LOGS === "true";

export default class Exchange {

    constructor() {
        this.binance = new Binance().options({
            family: 0,
            test: process.env.NODE_ENV !== "production",
            verbose: LOGS
        })
    }

    exchangeInfo() {
        return this.binance.exchangeInfo();
    }

}