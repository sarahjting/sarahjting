const Pet = require('../../src/Pet.js');
const Data = require('../../src/Data.js');
const core = require('@actions/core');

let [command, args] = (core.getInput('title') || 'feed:snack').split(':', 2);
args = args.replace(/\W/g, '');

if (command === 'feed' && args) {
    const pet = new Pet(new Data());
    pet.feed(core.getInput('username'), args);
    pet.save();
}
