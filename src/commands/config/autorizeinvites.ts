import { mokaMessage } from "discordjs-moka";
import FIIClient from "../../classes/Client";
import fiiCommand from "../../classes/Command";

module.exports = class extends fiiCommand {
    constructor(client: FIIClient) {
        super(client, {
            name: 'autorizeinvites',
            description: 'Autoriser les invations sur le serveur / dans un canal en particulier',
            userPermissions: ['ADMINISTRATOR'],
            aliases: [
                'autoriseinvites'
            ]
        })
    }
    async run(message: mokaMessage) {
        const autorised = message.guild.settings.get('autoriseinvites') || false;
        const autorisedChans: Array<string> = message.guild.settings.get('autorisedinviteschans') || new Array();
        if(!message.mentions.channels.first()) {
            message.guild.settings.set('autoriseinvites', autorised ? false : true);
            message.channel.send(`Les invitations sont maintenant ${autorised ? 'interdites' : 'autorisées'}`);
            return
        }
        message.mentions.channels.forEach(c => {
            if(!autorisedChans.includes(c.id)) {
                autorisedChans.push(c.id);
            }
        });
        message.guild.settings.set('autorisedinviteschans', autorisedChans);
        message.channel.send(`Les salons ${autorisedChans.map(c => `<#${c}>`).toString()} seront ignorés!`)
    }
}