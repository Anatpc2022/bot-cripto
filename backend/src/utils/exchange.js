import Binance from "node-binance-api";

const LOGS = process.env.BINANCE_LOGS === "true";
const APIKEY = process.env.ACCESS_KEY;
const APISECRET = process.env.SECRET_KEY;

export default class Exchange {

    constructor() {
        this.binance = new Binance().options({
            APIKEY,
            APISECRET,
            family: 0,
            test: process.env.NODE_ENV !== "production",
            verbose: LOGS
        })
    }

    exchangeInfo() {
        return this.binance.exchangeInfo();
    }

    async balance(){
        await this.binance.useServerTime();
        return this.binance.balance();
    }

}