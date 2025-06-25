import RiberBot from "../riberBot.js";

async function getMemory(req, res) {
    const memory = await RiberBot.getInstance().getMemory();
    res.json(memory);
}

async function getBrain(req, res){
    const brain = await RiberBot.getInstance().getBrain();
    res.json(brain);
}

async function updateMemory(req, res) {
    const memoryKey = req.params.index;
    let [symbol, index] = memoryKey.split(":");

    index = index.split("_")[0];
    const interval = index.split("_")[1];
    const value = req.body.data;

    let results = await RiberBot.getInstance().updateMemory(symbol, index, interval, value, true);
    if (results && results.length) results = results.filter(r => r);
    res.json(results);
}

export default {
    getMemory,
    getBrain,
    updateMemory
}