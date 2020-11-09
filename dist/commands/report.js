"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../classes/Command");
module.exports = class Report extends Command_1.default {
    constructor(client) {
        super(client, {
            name: 'report',
            description: 'Signaler un utilisateur',
            aliases: [
                'iléméchan'
            ]
        });
    }
    async run(message, args) {
        if (!args[0] || !args[1]) {
            message.channel.send(`${message.author}! Veuillez préciser qui signaler!`);
        }
        let user = this.client.users.resolve(args[0]);
        if (!user) {
            return message.channel.send('Impossible de trouver l\'utilisateur!');
        }
        message.channel.send('', {
            embed: {
                title: `Report de ${user.username}`,
                fields: [
                    {
                        name: 'Raison:',
                        value: `${args[1]}`
                    }
                ],
                timestamp: new Date(),
                thumbnail: {
                    url: `${user.avatarURL({ format: 'png' })}`
                },
                footer: {
                    text: `Report par ${message.author.username} depuis ${message.guild.name}`,
                    icon_url: `${message.author.avatarURL({ format: 'png' })}`
                },
                color: 'RANDOM'
            }
        });
    }
};
