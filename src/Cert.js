const gm = require('gm');

const imagemagick = gm.subClass({imageMagick: true});
const width = 226;
const height = 218;

module.exports = class Cert {
    constructor(data) {
        this.data = data;
    }
    async build() {
        await this._buildPet();
        await this._buildHungerPanel();
        await this._buildPlayPanel();
    }
    _step(fileName, im) {
        return new Promise((res, rej) => {
            im.write(`./build/${fileName}`, err => {
                if (err) {
                    rej(err);
                } else {
                    res();
                }
            });
        });
    }
    async _buildPet() {
        await this._buildFrame(1);
        await this._buildFrame(2);
        return this._step(`pet.gif`, imagemagick()
            .in('-delay', 100)
            .in('./build/pet-01.png')
            .in('./build/pet-02.png'));
    }
    _buildFrame(frame) {
        frame = `${frame}`;

        return this._step(`pet-${frame.padStart(2, '0')}.png`, imagemagick(width, height, 'transparent')
            .out('./static/images/bg-01.png')
            .out('-composite')
            .out(`static/images/pet-01-${frame.padStart(2, '0')}.png`)
            .out('-gravity', 'South')
            .out('-geometry', `+${this.data.get('position')}+10`)
            .out('-composite')
            .out('./static/images/frame-01.png')
            .out('-composite')
            .font('./static/fonts/smallest_pixel-7.ttf')
            .out('-gravity', 'NorthWest')
            .fontSize(10)
            .out('+antialias')
            .drawText(35, 9, `@${this.data.get('username')}`));
    }
    _buildHungerPanel() {
        return this._buildPanel(
            'hngr',
            this.data.get('hunger') / this.data.get('hunger_max'),
            this.data.get('hunger_log').map((log) => `[${log.created_at.substr(5, 5)}] ${log.username} fed ${log.food}`)
        );
    }
    _buildPlayPanel() {
        return this._buildPanel(
            'play',
            this.data.get('play') / this.data.get('play_max'),
            this.data.get('play_log').map((log) => `[${log.created_at.substr(5, 5)}] ${log.action} on ${log.repo}`)
        );
    }
    _buildPanel(header, barPercentage, log) {
        const im = imagemagick(width, height, "transparent")
            .out('./static/images/panel-01.png')
            .out('-composite')
            .font('./static/fonts/smallest_pixel-7.ttf')
            .out('-gravity', 'NorthWest')
            .fontSize(10)
            .out('+antialias')
            .drawText(40, 9, header)
            .stroke('transparent')
            .fill('#ff0000')
            .drawRectangle(66, 12, Math.round((195 - 66) * barPercentage + 66), 15);

        log.forEach((log, i) => {
            im.fill('#000000').fontSize(10).drawText(12, 36 + 10 * i, log);
        });

        return this._step(`${header}.png`, im);
    }
};
