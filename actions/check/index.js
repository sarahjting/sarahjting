const Pet = require('../../src/Pet.js');
const Data = require('../../src/Data.js');
const axios = require('axios');
const core = require('@actions/core');

const data = new Data();
const pet = new Pet(data);

pet.decay();

axios.get(`https://api.github.com/users/${data.get('username')}/events`, {
    headers: {
        Authorization: `Bearer ${core.getInput('token')}`,
    }
}).then(res => {
    const allowedTypes = {
        PushEvent: 'push',
        PullRequestReviewEvent: 'review',
        PullRequestEvent: 'pr',
    };

    res.data.reverse()
        .filter(event => new Date(event.created_at) > new Date(data.get('last_played_at')))
        .filter(event => !!allowedTypes[event.type])
        .forEach(event => {
            pet.play(
                event.actor.login,
                event.public ? event.repo.name : `private#${event.repo.id.toString(16)}`,
                allowedTypes[event.type],
                new Date(event.created_at).toISOString()
            );
        });

    pet.save();
});