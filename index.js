const {
    fiiMembers
} = require('./config');

require('dotenv').config();
const FIIB = require('./classes/client');
const client = new FIIB({
    token: process.env.TOKEN,
    prefix: '&',
    owners: ['743851266635071710', '462796153558138881'],
    fiim: fiiMembers,
    commandPath: [`${__dirname}/commands`]
});
client.on('ready', () => {
    client.user.setActivity('gérer la FII');
});
client.on('guildMemberAdd', (member) => {
    if(client.raidmode) {
        member.user.send('', {embed: {
            title: 'Vous avez été expulsé!',
            description: `Le serveur ${member.guild.name} est actuellement en Raidmode, revenez plus tard!`,
            footer: {
                text: 'RaidMode de FIIBOT',
                iconURL: client.user.avatarURL({
                    format: 'png'
                })
            },
            color: 'RED'
        }});
        member.kick('RAIDMODE');

    }
});