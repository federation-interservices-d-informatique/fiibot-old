import { mokaMessage } from "discordjs-moka";
import FIIClient from "../classes/Client";
import fiiCommand from "../classes/Command";

module.exports = class extends fiiCommand {
    constructor(client: FIIClient) {
        super(client, {
            name: 'ignorechan',
            description: "Ignorer des canaux de l'antispam",
            userPermissions: ["ADMINISTRATOR"],
            guildOnly: true
        });
    }
    async run(message: mokaMessage) {
        let currentchans: Array<string> = message.guild.settings.get('ignorespam') || new Array();
        message.mentions.channels.forEach(m => {
            if(!currentchans.includes(m.id.toString())) {
                currentchans.push(m.id.toString());
            }
        });
        message.guild.settings.set('ignorespam', currentchans);
        message.channel.send('', { embed: {
            description: `Canal ajouté!`,
            color: 'GREEN'
        }});
    }
}