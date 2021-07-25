const Cert = require('./Cert.js');

module.exports = class Pet {
    constructor(data) {
        this.data = data;
    }
    feed(username, food) {
        this.data.set('hunger', Math.min(this.data.get('hunger_max'), this.data.get('hunger') + 1));
        this.data.pushLog('hunger_log', {username, food});
    }
    play(username, repo, action, created_at) {
        this.data.set('play', Math.min(this.data.get('play_max'), this.data.get('play') + 1));
        this.data.set('last_played_at', created_at);
        this.data.pushLog('play_log', {username, repo, action, created_at});
    }
    decay() {
        const lastDecayedAt = this.data.get('last_decayed_at');
        const currentDate = new Date().toISOString();
        if (lastDecayedAt.substr(0, 10) !== currentDate.substr(0, 10)) {
            this.data.set('last_decayed_at', currentDate);
            ['hunger', 'play'].forEach((key) => {
                this.data.set(key, Math.max(0, this.data.get(key) - 1));
            });
        }
    }
    save() {
        this.data.set('position', Math.round(Math.random() * 150 - 75));
        const cert = new Cert(this.data);
        cert.build();
        this.data.save();
    }
};