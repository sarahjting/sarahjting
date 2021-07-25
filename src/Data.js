const fs = require('fs');

const path = './data.json';

module.exports = class Data {
    constructor() {
        this.data = JSON.parse(fs.readFileSync(path));
    }
    data() {
        return this.data;
    }
    get(key) {
        return this.data[key];
    }
    set(key, value) {
        this.data[key] = value;
    }
    push(key, value) {
        if (!Array.isArray(this.data[key])) {
            throw new Error('Pushing into invalid type.');
        }

        this.data[key].push(value);
        while (this.data[key].length > 17) {
            this.data[key].shift();
        }
    }
    pushLog(key, value) {
        this.push(key, {
            created_at: new Date().toISOString(),
            ...value,
        });
    }
    save() {
        fs.writeFileSync(path, JSON.stringify(this.data));
    }
}