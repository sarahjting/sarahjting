const Cert = require('./Cert.js');

module.exports = class Pet {
    constructor(data) {
        this.data = data;
    }
    feed(username, food) {
        this.data.set('hunger', Math.min(this.data.get('hunger_max'), this.data.get('hunger') + 1));
        this.data.pushLog('hunger_log', {username, food});
        this.save();
    }
    play(username, repo, commit) {
        this.data.set('play', Math.min(this.data.get('play_max'), this.data.get('play') + 1));
        this.data.pushLog('play_log', {username, repo, commit});
        this.save();
    }
    decay() {
        ['hunger', 'play'].forEach((key) => {
            this.data.set(key, Math.max(0, this.data.get(key) - 1));
        });

        this.save();
    }
    save() {
        this.data.set('position', Math.round(Math.random() * 150 - 75));
        const cert = new Cert(this.data);
        cert.build();
        this.data.save();
    }
};