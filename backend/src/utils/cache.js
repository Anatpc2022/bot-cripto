export default class Cache {
  MEMORY = {};

  constructor() {
    this.MEMORY = {};
  }

  async get(key) {
    return this.MEMORY[key];
  }

  async getAll(...keys) {
    const results = {};
    keys.map((k) => (results[k] = this.MEMORY[k]));
    return results;
  }

  async set(key, value) {
    this.MEMORY[key] = value;
  }

  async setAll(keyValues) {
    const keys = Object.keys(keyValues);
    keys.map((k) => (this.MEMORY[k] = keyValues[k]));
  }

  unset(key) {
    return (this.MEMORY[key] = undefined);
  }

  async search(pattern) {
    if (!pattern) return { ...this.MEMORY };

    //faz a busca com o padrão
  }
}
