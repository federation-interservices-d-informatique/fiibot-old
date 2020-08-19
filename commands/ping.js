const Command = require('../classes/Command');

module.exports = class ping extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: 'Obtenir le Ping du bot',
            aliases: [
                'pong'
            ]
        });
    }
    async run(message) {
        let send = Date.now();
        message.channel.send('Mesure...').then(m => {
            m.edit(`Pong! En ${Date.now() - send}ms`);
        })
    }
};