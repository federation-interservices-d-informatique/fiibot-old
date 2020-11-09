"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
dotenv_1.config();
const config_1 = require("./config");
const discordjs_moka_1 = require("discordjs-moka");
const Client_1 = require("./classes/Client");
const client = new Client_1.default({}, {
    token: process.env.TOKEN,
    prefix: '$',
    owner: config_1.owners
});
client.setHandler(new discordjs_moka_1.mokaHandler(client, {
    loadDefault: true,
    commandPath: [
        `${__dirname}/commands`
    ]
}));
client.handler.init();
client.on('ready', () => {
    client.user.setActivity('gérer la FII');
});
client.on('guildMemberAdd', (member) => {
    if (client.raidmode) {
        member.user.send('', {
            embed: {
                title: 'Vous avez été expulsé!',
                description: `Le serveur ${member.guild.name} est actuellement en Raidmode, revenez plus tard!`,
                footer: {
                    text: 'RaidMode de FIIBOT',
                    iconURL: client.user.avatarURL({
                        format: 'png'
                    })
                },
                color: 'RED'
            }
        });
        member.kick('RAIDMODE');
    }
});
