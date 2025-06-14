export default class Cache {

    MEMORY = {};

    constructor() {
        this.MEMORY = {};
    }

    async get(key) {
        return this.MEMORY[key];
    }

    async set(key, value) {
        this.MEMORY[key] = value;
    }

}