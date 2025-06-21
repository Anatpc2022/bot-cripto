import RiberBot from "../riberBot.js";

async function getMemory(req, res) {
    const memory = await RiberBot.getInstance().getMemory();
    res.json(memory);
}

async function getBrain(req, res){
    const brain = await RiberBot.getInstance().getBrain();
    res.json(brain);
}

export default {
    getMemory,
    getBrain
}