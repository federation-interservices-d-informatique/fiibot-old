import { mokaMessage } from "discordjs-moka";
import FIIClient from "../../classes/Client";
import fiiCommand from "../../classes/Command";

module.exports = class extends fiiCommand {
    constructor(client: FIIClient) {
        super(client, {
            name: 'unautoriseinvites',
            description: 'Interdire les invites dans un salon / sur le serveur',
            userPermissions: ['ADMINISTRATOR']
        })
    }
    async run(message: mokaMessage) {
        const autorised = await message.guild.settings.get('autoriseinvites') || false;
        let autorisedChans: Array<string> = await message.guild.settings.get('autorisedinviteschans') || new Array();
        if(!message.mentions.channels.first()) {
            await message.guild.settings.set('autoriseinvites', autorised ? false : true);
            message.channel.send(`Les invitations sont maintenant ${autorised ? 'interdites' : 'autorisées'}`);
            return
        }
        const todisable = new Array();
        message.mentions.channels.forEach(c => todisable.push(c.id))
        autorisedChans = autorisedChans.filter(c => todisable.includes(c) == false)
        await message.guild.settings.set('autorisedinviteschans', autorisedChans);
        message.channel.send(`Les salons ${autorisedChans.map(c => `<#${c}>`).toString()} sont encore ignorés!`)
    }
}