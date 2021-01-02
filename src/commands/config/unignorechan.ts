import { mokaClient, mokaMessage } from "discordjs-moka";
import fiiCommand from "../../classes/Command";

module.exports = class extends fiiCommand {
    constructor(client: mokaClient) {
        super(client, {
            name: 'unignorechan',
            description: 'Arrêter d\'ignorer un salon',
            userPermissions: ["ADMINISTRATOR"],
            guildOnly: true,
            aliases: ['stopignore']
        })
    }
    async run(message: mokaMessage) {
        let spchans: string[] = message.guild.settings.get('ignorespam') || new Array();
        message.mentions.channels.forEach(c => {
            spchans = spchans.filter(f => f != c.id);
            message.channel.send(`Le canal ${c} ne sera plus ignoré!`);
        });
        message.guild.settings.set('ignorespam', spchans);
    }
}