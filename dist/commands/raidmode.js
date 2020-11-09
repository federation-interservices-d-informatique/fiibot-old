"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../classes/Command");
module.exports = class extends Command_1.default {
    constructor(client) {
        super(client, {
            name: 'raidmode',
            description: 'Lancer le raidmode',
            aliases: [
                'raid'
            ],
            ownerOnly: true,
            usage: 'raidmode'
        });
    }
    run(message) {
        if (this.client.raidmode) {
            message.channel.send('', { embed: {
                    title: 'Raidmode',
                    description: 'Raidmode Désactivé!',
                    color: 'RED'
                } });
            this.client.raidmode = false;
            let chan = this.client.channels.cache.get('705372306481872963');
            chan.send('', {
                embed: {
                    title: 'Raidmode',
                    description: `Le raidmode a été désactivé par ${message.author.tag} sur ${message.guild.name}`,
                    color: 'RED'
                }
            });
            this.client.user.setActivity('gérer la FII');
        }
        else {
            message.channel.send('', { embed: {
                    title: 'Raidmode',
                    description: 'Raidmode Activé!',
                    color: 'RED'
                } });
            this.client.raidmode = true;
            let chan = this.client.channels.cache.get('705372306481872963');
            if (chan.type === "text") {
                chan.send('', {
                    embed: {
                        title: 'Raidmode',
                        description: `Le raidmode a été activé par ${message.author.tag} sur ${message.guild.name}`,
                        color: 'RED'
                    }
                });
                this.client.user.setActivity('protéger la FII');
            }
        }
    }
};
